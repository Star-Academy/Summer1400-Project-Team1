using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using API.Models;
using API.SqlIOHandler;
using Microsoft.Data.SqlClient;

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
        private readonly ILinkedServerHandler _linkedServerHandler;
        private readonly ISqlIOHandler _sqlIoHandler;

        public DatabaseHandler(ApiContext apiContext,ILinkedServerHandler linkedServerHandler, ISqlIOHandler sqlIoHandler)
        {
            _context = apiContext;
            _linkedServerHandler = linkedServerHandler;
            _sqlIoHandler = sqlIoHandler;
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
            var newConnection = new ConnectionModel()
            {
                Name = name, Server = server, Username = username, Password = password
            };
            _context.Connection.Add(newConnection);
            _context.SaveChanges();
            newConnection.BuildConnectionString();
            return newConnection.Id;
        }

        public IEnumerable<string> GetDatabases(int connectionId)
        {
            var serverConnectionString = _context.Connection.Find(connectionId).ConnectionString;
            var databases = _sqlIoHandler.GetDatabases(serverConnectionString);
            
            return databases;
        }

        public IEnumerable<string> GetTables(int connectionId, string databaseName)
        {
            var connectionStringToDatabase = _context.Connection.Find(connectionId).ConnectionString + $"Database={databaseName};";
            var tables = _sqlIoHandler.GetTables(connectionStringToDatabase);
            return tables;
        }

        public List<DatasetModel> GetDatasets()
        {
            return _context.Dataset.ToList();
        }

        public void AddSqlDataset(string datasetName,int connectionId, string databaseName, string tableName)
        {
            var server = _context.Connection.Find(connectionId).Server;
            var username = _context.Connection.Find(connectionId).Username;
            var password = _context.Connection.Find(connectionId).Password;
            _linkedServerHandler.AddLinkedServer(server,username,password);
            _linkedServerHandler.ImportToNewTable(server,databaseName,tableName);
            _linkedServerHandler.DropLinkedServer(server);
            _context.Dataset.Add(new DatasetModel()
            {
                Connection = _context.Connection.Find(connectionId), Name = datasetName,
                DateCreated = DateTime.Now
            });
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