using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace API.Aggregation
{
    public class AggregationTask : IPipelineComponent
    {
        private ISqlHandler _sqlHandler;
        private IEnumerable<GroupByItem> _groupByItems;
        private IEnumerable<AggregateFunction> _aggregateFunctions;

        public AggregationTask(ISqlHandler sqlHandler, IEnumerable<GroupByItem> groupByItems,
            IEnumerable<AggregateFunction> aggregateFunctions)
        {
            _sqlHandler = sqlHandler;
            _groupByItems = groupByItems;
            _aggregateFunctions = aggregateFunctions;
        }

        public int OrderId { get; set; }

        public string Execute(string sourceDataset)
        {
            var destinationName = "##Aggregation" + new Random().Next();
            var sqlString = GetSqlString(sourceDataset, destinationName);
            Console.WriteLine(sqlString);
            if (!_sqlHandler.IsOpen())
                _sqlHandler.Open();
            var command = new SqlCommand(sqlString, _sqlHandler.Connection);
            command.ExecuteNonQuery();
            return destinationName;
        }

        private string GetSqlString(string sourceDataset, string destinationName)
        {
            var sqlString = "SELECT ";
            var first = true;
            foreach (var function in _aggregateFunctions)
            {
                if (!first)
                    sqlString += ",";
                else
                    first = false;
                sqlString += function;
            }

            sqlString += "INTO " + destinationName + " ";
            sqlString += "FROM " + sourceDataset + " ";
            if (!_groupByItems.Any()) return sqlString;
            sqlString += "GROUP BY ";
            first = true;
            foreach (var groupBy in _groupByItems)
            {
                if (!first)
                    sqlString += ",";
                else
                    first = false;
                sqlString += groupBy.ColumnName + " ";
            }

            return sqlString;
        }

        public string ExecuteTemplate(string sourceDataset)
        {
            var destinationName = "##Aggregation" + new Random().Next();
            var sqlString = GetSqlString(sourceDataset, destinationName)
                .Replace("INTO " + destinationName + " FROM " + sourceDataset + " ",
                    "INTO " + destinationName + " FROM " + sourceDataset + " WHERE 0 ");
            Console.WriteLine(sqlString);
            if (!_sqlHandler.IsOpen())
                _sqlHandler.Open();
            var command = new SqlCommand(sqlString, _sqlHandler.Connection);
            command.ExecuteNonQuery();
            return destinationName;
        }
    }
}