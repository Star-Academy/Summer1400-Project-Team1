using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text.RegularExpressions;

namespace API.Join
{
    public class JoinTask : IPipelineComponent
    {
        private readonly ISqlHandler _sqlHandler;
        private readonly string _secondTableName;
        private readonly string _firstTablePk, _secondTablePk;
        private readonly IDictionary<string, string> _firstTableMapping, _secondTableMapping;
        private readonly JoinType _joinType;

        public JoinTask(ISqlHandler sqlHandler, string secondTableName, JoinType joinType,
            string firstTablePk,
            string secondTablePk)
        {
            _sqlHandler = sqlHandler;
            _secondTableName = secondTableName;
            _joinType = joinType;
            _firstTablePk = firstTablePk;
            _secondTablePk = secondTablePk;
        }

        public JoinTask(ISqlHandler sqlHandler, string secondTableName, JoinType joinType,
            string firstTablePk,
            string secondTablePk, IDictionary<string, string> firstTableMapping,
            IDictionary<string, string> secondTableMapping)
        {
            _sqlHandler = sqlHandler;
            _secondTableName = secondTableName;
            _joinType = joinType;
            _firstTablePk = firstTablePk;
            _secondTablePk = secondTablePk;
            _firstTableMapping = firstTableMapping;
            _secondTableMapping = secondTableMapping;
        }

        public int OrderId { get; set; }

        public string Execute(string sourceDataset)
        {
            string tempTableName = GetTempTableNameFromSourceDataset(sourceDataset);
            string sqlString = GetSqlString(sourceDataset, tempTableName);
            if (!_sqlHandler.IsOpen())
                _sqlHandler.Open();
            SqlCommand command = new SqlCommand(sqlString, _sqlHandler.Connection);
            Console.WriteLine(sqlString);
            command.ExecuteNonQuery();
            return tempTableName;
        }

        private static string GetTempTableNameFromSourceDataset(string sourceDataset)
        {
            string tempTableName = sourceDataset;
            Match match = Regex.Match(tempTableName, "(\\w+)_temp(\\d+)");
            if (match.Success)
            {
                tempTableName = match.Groups[1].Value + "_temp" + (int.Parse(match.Groups[2].Value) + 1);
            }
            else
            {
                tempTableName += "_temp1";
            }

            return tempTableName;
        }

        private string GetSqlString(string sourceDataset, string tempTableName)
        {
            string sqlString = "SELECT ";
            sqlString = AddMappingToSqlString(sqlString, sourceDataset, _firstTableMapping) + ", ";
            sqlString = AddMappingToSqlString(sqlString, _secondTableName, _secondTableMapping);
            sqlString += " INTO ##" + tempTableName + " FROM " + sourceDataset + " ";
            sqlString += _joinType.ToString().Replace("Join", "").ToUpper() + " JOIN " + _secondTableName + " ON ";
            sqlString += sourceDataset + "." + _firstTablePk + " = " + _secondTableName + "." + _secondTablePk;
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

    public enum JoinType
    {
        InnerJoin,
        LeftJoin,
        RightJoin,
        FullJoin
    }
}