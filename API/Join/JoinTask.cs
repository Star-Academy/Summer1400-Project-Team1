using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace API.Join
{
    public class JoinTask : IJoinTask
    {
        private readonly ISqlHandler _sqlHandler;
        private readonly string _firstTableName, _secondTableName;
        private readonly string _firstTablePk, _secondTablePk;
        private readonly IDictionary<string, string> _firstTableMapping, _secondTableMapping;
        private readonly JoinType _joinType;

        public JoinTask(ISqlHandler sqlHandler, string firstTableName, string secondTableName, JoinType joinType,
            string firstTablePk,
            string secondTablePk)
        {
            _sqlHandler = sqlHandler;
            _firstTableName = firstTableName;
            _secondTableName = secondTableName;
            _joinType = joinType;
            _firstTablePk = firstTablePk;
            _secondTablePk = secondTablePk;
        }

        public JoinTask(ISqlHandler sqlHandler, string firstTableName, string secondTableName, JoinType joinType,
            string firstTablePk,
            string secondTablePk, IDictionary<string, string> firstTableMapping,
            IDictionary<string, string> secondTableMapping)
        {
            _sqlHandler = sqlHandler;
            _firstTableName = firstTableName;
            _secondTableName = secondTableName;
            _joinType = joinType;
            _firstTablePk = firstTablePk;
            _secondTablePk = secondTablePk;
            _firstTableMapping = firstTableMapping;
            _secondTableMapping = secondTableMapping;
        }

        public DataTable Run()
        {
            string sqlString = GetSqlString();
            if (!_sqlHandler.IsOpen())
                _sqlHandler.Open();
            SqlCommand command = new SqlCommand(sqlString, _sqlHandler.Connection);
            var stream = command.ExecuteReader();
            DataTable table = new DataTable();
            table.Load(stream);
            _sqlHandler.Close();
            return table;
        }

        private string GetSqlString()
        {
            string sqlString = "SELECT ";
            sqlString = AddMappingToSqlString(sqlString, _firstTableName, _firstTableMapping) + ", ";
            sqlString = AddMappingToSqlString(sqlString, _secondTableName, _secondTableMapping);
            sqlString += " FROM " + _firstTableName + " ";
            sqlString += _joinType.ToString().Replace("Join", "").ToUpper() + " JOIN " + _secondTableName + " ON ";
            sqlString += _firstTableName + "." + _firstTablePk + " = " + _secondTableName + "." + _secondTablePk;
            return sqlString;
        }

        private string AddMappingToSqlString(string sqlString, string tableName,
            IDictionary<string, string> tableMapping)
        {
            if (tableMapping != null)
            {
                bool first = true;
                foreach (KeyValuePair<string, string> mapping in tableMapping)
                {
                    if (!first)
                    {
                        sqlString += ", ";
                    }
                    else
                    {
                        first = false;
                    }

                    sqlString += tableName + "." + mapping.Key + " AS " + mapping.Value;
                }
            }
            else
            {
                sqlString += tableName + ".*";
            }

            return sqlString;
        }
    }
}