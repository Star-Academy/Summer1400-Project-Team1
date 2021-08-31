using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

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

        public string Execute(string sourceDataset)
        {
            var sqlString = "SELECT ";
            bool first = true;
            foreach (var function in _aggregateFunctions)
            {
                if (!first)
                    sqlString += ",";
                else
                    first = false;
                sqlString += function;
            }
            
            var destinationName = "##Aggregation";
            sqlString += "INTO " + destinationName + " ";

            sqlString += "FROM " + sourceDataset + " ";
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


            Console.WriteLine(sqlString);
            if(!_sqlHandler.IsOpen())
                _sqlHandler.Open();
            SqlCommand command = new SqlCommand(sqlString, _sqlHandler.Connection);
            var stream = command.ExecuteReader();
            DataTable table = new DataTable();
            table.Load(stream);
            _sqlHandler.Close();

            return destinationName;
        }
    }
}