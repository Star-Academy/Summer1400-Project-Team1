using System;
using System.Collections.Generic;
using System.Data;
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
            _firstTableMapping = new Dictionary<string, string>();
            _secondTableMapping = new Dictionary<string, string>();
        }

        public int OrderId { get; set; }

        public string Execute(string sourceDataset)
        {
            var tempTableName = GetTempTableNameFromSourceDataset(sourceDataset);
            PutTableMappings(sourceDataset);
            var sqlString = GetSqlString(sourceDataset, tempTableName);
            if (!_sqlHandler.IsOpen())
                _sqlHandler.Open();
            var command = new SqlCommand(sqlString, _sqlHandler.Connection);
            Console.WriteLine(sqlString);
            command.ExecuteNonQuery();
            return "##" + tempTableName;
        }

        public string ExecuteTemplate(string sourceDataset)
        {
            var tempTableName = GetTempTableNameFromSourceDataset(sourceDataset);
            PutTableMappings(sourceDataset);
            var sqlString = GetSqlString(sourceDataset, tempTableName) + "WHERE 0";
            if (!_sqlHandler.IsOpen())
                _sqlHandler.Open();
            var command = new SqlCommand(sqlString, _sqlHandler.Connection);
            Console.WriteLine(sqlString);
            command.ExecuteNonQuery();
            return "##" + tempTableName;
        }

        private void PutTableMappings(string sourceDataset)
        {
            if (!_sqlHandler.IsOpen()) _sqlHandler.Open();
            var sourceColumns = _sqlHandler.Connection.GetSchema("Columns", new[] {null, null, sourceDataset});
            foreach (DataRow rowColumn in sourceColumns.Rows)
            {
                var columnName = rowColumn[3].ToString();
                if (columnName != null) _firstTableMapping[columnName] = columnName;
            }

            var secondTableColumns =
                _sqlHandler.Connection.GetSchema("Columns", new[] {null, null, _secondTableName});
            foreach (DataRow rowColumn in secondTableColumns.Rows)
            {
                var columnName = rowColumn[3].ToString();
                if (columnName != null) _secondTableMapping[columnName] = columnName;
            }

            RemoveIntersection(sourceDataset);
        }

        private void RemoveIntersection(string sourceDataset)
        {
            while (true)
            {
                var hadIntersect = false;
                foreach (var firstKey in _firstTableMapping.Keys)
                {
                    foreach (var secondKey in _secondTableMapping.Keys)
                    {
                        if (_firstTableMapping[firstKey] != _secondTableMapping[secondKey]) continue;
                        hadIntersect = true;
                        _firstTableMapping[firstKey] = sourceDataset.ToLower() + "_" + _firstTableMapping[firstKey];
                        _secondTableMapping[secondKey] =
                            _secondTableName.ToLower() + "_" + _secondTableMapping[secondKey];
                    }
                }

                hadIntersect = hadIntersect || RemoveSelfIntersect(_firstTableMapping, sourceDataset);
                hadIntersect = hadIntersect || RemoveSelfIntersect(_secondTableMapping, _secondTableName);
                if (!hadIntersect) return;
            }
        }

        private bool RemoveSelfIntersect(IDictionary<string, string> mapping, string tableName)
        {
            var hadIntersect = false;
            foreach (var firstKey in mapping.Keys)
            {
                foreach (var secondKey in mapping.Keys)
                {
                    if (firstKey == secondKey || mapping[firstKey] != mapping[secondKey])
                        continue;
                    hadIntersect = true;
                    if (mapping[firstKey].Length - firstKey.Length <=
                        mapping[secondKey].Length - secondKey.Length)
                    {
                        mapping[firstKey] = tableName.ToLower() + "_" + mapping[firstKey];
                    }
                    else
                    {
                        mapping[secondKey] = tableName.ToLower() + "_" + mapping[secondKey];
                    }
                }
            }

            return hadIntersect;
        }

        private static string GetTempTableNameFromSourceDataset(string sourceDataset)
        {
            var tempTableName = sourceDataset;
            var match = Regex.Match(tempTableName, "(\\w+)_temp(\\d+)");
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
            var sqlString = "SELECT ";
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
            var first = true;
            foreach (var (key, value) in tableMapping)
            {
                if (!first)
                {
                    sqlString += ", ";
                }
                else
                {
                    first = false;
                }

                sqlString += tableName + "." + key + " AS " + value;
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