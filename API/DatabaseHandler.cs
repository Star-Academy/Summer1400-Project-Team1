using System;
using System.Collections.Generic;
using API.Models;

namespace API
{
    enum ComponentType
    {
        Aggregation = 0,
        Filter = 1,
        Join = 2
    }
    public class DatabaseHandler : IDatabaseHandler
    {
        private readonly ApiContext _context;

        public DatabaseHandler(ApiContext apiContext)
        {
            _context = apiContext;
        }

        public List<ConnectionModel> GetConnections()
        {
            return _context.Connection.ToList();
        }

        public ConnectionModel GetConnection(int connectionId)
        {
            return _context.Connection.Find(connectionId);
        }

        public int AddConnection(string name, string server, string username, string password)
        {
            var connection = new ConnectionModel()
            {
                Name = name, Server = server, Username = username, Password = password
            };
            _context.Connection.Add(connection);
            _context.SaveChanges();
            connection.BuildConnectionString();
            using var sourceServer = new SqlConnection(connection.ConnectionString);
            try
            {
                sourceServer.Open();
                return connection.Id;
            }
            catch (SqlException)
            {
                return 0;
            }
        }

        public List<string> GetDatabases(int connectionId)
        {
            using var sourceConnection = new SqlConnection(_context.Connection.Find(connectionId).ConnectionString);
            sourceConnection.Open();
            var databases = sourceConnection.GetSchema("Databases");
            var databasesName = (from DataRow database in databases.Rows 
                select database.Field<string>("database_name")).ToList();
            
            return databasesName;
        }

        public List<string> GetTables(int connectionId, string databaseName)
        {
            var connectionStringToDatabase = _context.Connection.Find(connectionId).ConnectionString +
                                             $"Database={databaseName};";
            using var sourceConnection = new SqlConnection(connectionStringToDatabase);
            sourceConnection.Open();
            var tables = sourceConnection.GetSchema("Tables");
            var tablesName = (from DataRow table in tables.Rows 
                select table.Field<string>("TABLE_NAME")).ToList();
            
            return tablesName;
        }

        public List<DatasetModel> GetDatasets()
        {
            throw new NotImplementedException();
        }

        public void AddSqlDataset(int connectionId, string databaseName, string tableName)
        {
            var server = _context.Connection.Find(connectionId).Server;
            var username = _context.Connection.Find(connectionId).Username;
            var password = _context.Connection.Find(connectionId).Password;
            _linkedServerHandler.AddLinkedServer(server,username,password);
            _linkedServerHandler.ImportToNewTable(server,databaseName,tableName);
            _linkedServerHandler.DropLinkedServer(server);
        }

        public void AddCsvDataset(string pathToCsv)
        {
            throw new NotImplementedException();
        }

        public string GetCsvDataset(int datasetId)
        {
            throw new NotImplementedException();
        }

        public List<PipelineModel> GetPipelines()
        {
            throw new NotImplementedException();
        }

        public int AddPipeline(string name)
        {
            throw new NotImplementedException();
        }

        public List<ComponentModel> GetComponents(int pipelineId)
        {
            throw new NotImplementedException();
        }

        public void AddAggregateComponent(int pipelineId, AggregationModel aggregationModel, int orderId)
        {
            throw new NotImplementedException();
        }

        public void AddFilterComponent(int pipelineId, string body,string name, int orderId)
        {
            var newFilterComponent = new FilterModel()
            {
                Query = body
            };

            _context.FilterComponent.Add(newFilterComponent);
            _context.SaveChanges();
            var filterId = newFilterComponent.Id;
            
            var newComponentModel = new ComponentModel()
            {
                Name = name,
                Type = (int)ComponentType.Filter,
                OrderId = orderId,
                RelatedComponentId = filterId
            };
            
            _context.Pipeline.Find(pipelineId).Components.Add(newComponentModel);

        }

        public void AddJoinComponent(int pipelineId, JoinModel joinModel, int orderId)
        {
            throw new NotImplementedException();
        }

        public Tuple<int, int> GetComponent(int pipelineId, int orderId)
        {
            throw new NotImplementedException();
        }

        public AggregationModel GetAggregateComponent(int componentId)
        {
            throw new NotImplementedException();
        }

        public FilterModel GetFilterComponent(int componentId)
        {
            return _context.FilterComponent.Find(componentId);
        }

        public JoinModel GetJoinComponent(int componentId)
        {
            throw new NotImplementedException();
        }
    }
}