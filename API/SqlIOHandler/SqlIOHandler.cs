using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using API.Models;
using Newtonsoft.Json;

namespace API.SqlIOHandler
{
    public class SqlIOHandler : ISqlIOHandler
    {
        private readonly ILinkedServerHandler _linkedServerHandler;
        private readonly ISqlHandler _sqlHandler;

        public SqlIOHandler(ILinkedServerHandler linkedServerHandler, ISqlHandler sqlHandler)
        {
            _linkedServerHandler = linkedServerHandler;
            _sqlHandler = sqlHandler;
        }

        public IEnumerable<string> GetDatabases(string sourceConnectionString)
        {
            using var sourceConnection = new SqlConnection(sourceConnectionString);
            sourceConnection.Open();
            var databases = sourceConnection.GetSchema("Databases");
            var databasesName = (from DataRow database in databases.Rows
                select database.Field<string>("database_name")).ToList();

            return databasesName;
        }

        public IEnumerable<string> GetTables(string sourceConnectionString)
        {
            using var sourceConnection = new SqlConnection(sourceConnectionString);
            sourceConnection.Open();
            var tables = sourceConnection.GetSchema("Tables");
            var tablesName = (from DataRow table in tables.Rows
                select table.Field<string>("TABLE_NAME")).ToList();

            return tablesName;
        }

        public void ImportDataFromSql(ConnectionModel connectionModel,string datasetName, string databaseName, string tableName)
        {
            try
            {
                _linkedServerHandler.AddLinkedServer(connectionModel.Server, connectionModel.Username, connectionModel.Password);
                _linkedServerHandler.ImportToNewTable(connectionModel.Server,datasetName, databaseName, tableName);
                _linkedServerHandler.DropLinkedServer(connectionModel.Server);
            }
            catch (Exception e)
            {
                _linkedServerHandler.DropLinkedServer(connectionModel.Server);
                throw;
            }
        }

        public string GetTableSample(string tableName, int count)
        {
            if (!_sqlHandler.IsOpen())
                _sqlHandler.Open();
            var selectQuery = $"SELECT TOP {count} * FROM {tableName}";
            var cmd = new SqlCommand(selectQuery, _sqlHandler.Connection);
            var samples = cmd.ExecuteReader();
            var tableInJSON = SqlDataToJson(samples);
            _sqlHandler.Close();
            return tableInJSON;
        }

        private string SqlDataToJson(IDataReader dataReader)
        {
            var dataTable = new DataTable();
            dataTable.Load(dataReader);
            var JSONString = JsonConvert.SerializeObject(dataTable);
            return JSONString;
        }
    }
}