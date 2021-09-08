using System;
using System.Collections.Generic;
using System.IO;
using System.Data;
using System.Linq;
using API.Models;
using API.SqlIOHandler;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting.Internal;

namespace API
{
    public enum ComponentType
    {
        Aggregation = 0,
        Filter = 1,
        Join = 2
    }
    public class DatabaseHandler : IDatabaseHandler
    {
        private readonly ApiContext _context;
        private readonly ICsvHandler _csvHandler;
        private readonly ISqlIOHandler _sqlIoHandler;

        public DatabaseHandler(ApiContext apiContext, ISqlIOHandler sqlIoHandler,ICsvHandler csvHandler)
        {
            _context = apiContext;
            _csvHandler = csvHandler;
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
            newConnection.BuildConnectionString();
            _context.SaveChanges();
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
            var connectionStringToDatabase =
                _context.Connection.Find(connectionId).ConnectionString + $"Database={databaseName};";
            var tables = _sqlIoHandler.GetTables(connectionStringToDatabase);
            return tables;
        }

        public List<DatasetModel> GetDatasets()
        {
            return _context.Dataset.ToList();
        }

        public void AddSqlDataset(string datasetName, int connectionId, string databaseName, string tableName)
        {
            var connectionModel = _context.Connection.Find(connectionId);
            _sqlIoHandler.ImportDataFromSql(connectionModel, databaseName, tableName);
            _context.Dataset.Add(new DatasetModel()
            {
                Connection = connectionModel, Name = datasetName, DateCreated = DateTime.Now
            });
        }

        public void AddCsvDataset(string pathToCsv,string name,bool isHeaderIncluded)
        {
            _csvHandler.LoadCsv(pathToCsv,isHeaderIncluded);
            _csvHandler.CsvToSql(name);
        }

        public string GetCsvDataset(int datasetId)
        {
            var dataset = _context.Dataset.Find(datasetId);
            var folderName = Path.Combine("Resources", "CSVs");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var path = Path.Combine(pathToSave, $"{dataset.Name}.csv");
            _csvHandler.SqlToCsv(dataset.Name,path);
            return path;
        }

        public List<PipelineModel> GetPipelines()
        {
            return _context.Pipeline.ToList();
        }

        public PipelineModel GetPipeline(int pipelineId)
        {
            return _context.Pipeline.Find(pipelineId);
        }

        public int AddPipeline(string name)
        {
            var pipeline = new PipelineModel()
            {
                Name = name,
                DateCreated = DateTime.Now
            };
            _context.Pipeline.Add(pipeline);
            try
            {
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return 0;
            }
            
            return pipeline.Id;
        }

        public List<ComponentModel> GetComponents(int pipelineId)
        {
            return _context.Pipeline
                .Find(pipelineId)
                .Components.ToList();
        }

        private void AddComponent(PipelineModel pipelineModel, ComponentModel componentModel, int orderId)
        {
            pipelineModel.Components.OrderBy(c => c.OrderId);
            pipelineModel.Components.Insert(orderId,componentModel);
            for (int i = orderId+1; i < pipelineModel.Components.Count; i++)
            {
                pipelineModel.Components[i].OrderId++;
            }

            _context.SaveChanges();
        }

        public void AddAggregateComponent(int pipelineId, AggregationModel aggregationModel, int orderId)
        {
            /*if (!_context.Database.EnsureCreated())
            {
                Console.Error.WriteLine("database not created");
                return;
            }*/
            PipelineModel pipeline = _context.Pipeline.Find(pipelineId);
            if (pipeline == null)
                throw new Exception("pipeline not found");
            if (pipeline.Components.Count < orderId)
                throw new Exception("invalid order");
            _context.AggregateComponent.Add(aggregationModel);
            _context.SaveChanges();
            
            AddComponent(pipeline,new ComponentModel()
            {
                Name = aggregationModel.Name,
                OrderId = orderId,
                Type = ComponentType.Aggregation,
                RelatedComponentId = aggregationModel.Id
            },orderId);
            
        }

        public void AddFilterComponent(int pipelineId, string body, string name, int orderId)
        {
            var newFilterComponent = new FilterModel()
            {
                Query = body
            };

            _context.FilterComponent.Add(newFilterComponent);
            _context.SaveChanges();
            var filterId = newFilterComponent.Id;

            AddComponent( _context.Pipeline.Find(pipelineId),new ComponentModel()
            {
                Name = name,
                Type = ComponentType.Filter,
                OrderId = orderId,
                RelatedComponentId = filterId
            },orderId);

        }

        public void AddJoinComponent(int pipelineId, JoinModel joinModel, int orderId)
        {
            throw new NotImplementedException();
        }

        public Tuple<ComponentType, int> GetComponent(int pipelineId, int orderId)
        {
            PipelineModel pipeline = _context.Pipeline.Find(pipelineId);
            if (pipeline == null)
                throw new Exception("pipeline not found");
            if (orderId >= pipeline.Components.Count)
                throw new Exception("invalid orderId");
            ComponentModel component = pipeline.Components[orderId];
            return new Tuple<ComponentType, int>(component.Type, component.RelatedComponentId);
        }

        public AggregationModel GetAggregateComponent(int componentId)
        {
            return _context.AggregateComponent.Find(componentId);
        }

        public FilterModel GetFilterComponent(int componentId)
        {
            return _context.FilterComponent.Find(componentId);
        }

        public JoinModel GetJoinComponent(int componentId)
        {
            throw new NotImplementedException();
        }

        public void UpdateAggregateComponent(int id, AggregationModel newModel)
        {
            var oldModel = _context.AggregateComponent.Find(id);
            if (oldModel == null)
                throw new Exception("not found");
            oldModel.Name = newModel.Name;
            oldModel.AggregateFunctions = newModel.AggregateFunctions;
            oldModel.GroupByItems = newModel.GroupByItems;
            _context.SaveChanges();
        }

        public void UpdateFilterComponent(int id, FilterModel newModel)
        {
            var oldModel = _context.FilterComponent.Find(id);
            if (oldModel == null)
                throw new Exception("not found");
            oldModel.Query = newModel.Query;
            _context.SaveChanges();
        }

        public void UpdateJoinComponent(int id, JoinModel newModel)
        {
            throw new NotImplementedException();
        }
        

        public void DeleteComponent(int pipelineId, int componentId)
        {
            PipelineModel pipeline = _context.Pipeline.Find(pipelineId);
            if (pipeline == null)
                throw new Exception("pipeline not found");
            ComponentModel component = pipeline.Components.Find(c => c.OrderId==componentId);
            if (component == null)
                throw new Exception("component not found");
            pipeline.Components.Remove(component);
            _context.SaveChanges();
        }

        public void DeleteAggregateComponent(int id)
        {
            AggregationModel aggregation = _context.AggregateComponent.Find(id);
            if (aggregation == null)
                throw new Exception("aggregate not found");
            _context.AggregateComponent.Remove(aggregation);
            _context.SaveChanges();
        }

        public void DeleteFilterComponent(int id)
        {
            FilterModel filter = _context.FilterComponent.Find(id);
            if (filter == null)
                throw new Exception("filter not found");
            _context.FilterComponent.Remove(filter);
            _context.SaveChanges();
        }

        public void DeleteJoinComponent(int id)
        {
            throw new NotImplementedException();
        }
    }
}