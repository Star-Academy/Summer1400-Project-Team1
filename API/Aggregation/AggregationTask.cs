using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace API.Aggregation
{
    public class AggregationTask : IAggregationTask
    {
        private ISqlHandler _sqlHandler;
        private string _tableName;
        private IEnumerable<GroupByItem> _groupByItems;
        private IEnumerable<AggregateFunction> _aggregateFunctions;

        public AggregationTask(ISqlHandler sqlHandler, string tableName, IEnumerable<GroupByItem> groupByItems,
            IEnumerable<AggregateFunction> aggregateFunctions)
        {
            _sqlHandler = sqlHandler;
            _groupByItems = groupByItems;
            _aggregateFunctions = aggregateFunctions;
            _tableName = tableName;
        }

        public DataTable Run()
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

            sqlString += "FROM " + _tableName + " ";
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

            return table;
        }
    }
}