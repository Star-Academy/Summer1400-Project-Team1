using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Models;
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

        public DatabaseHandler(ApiContext apiContext, ICsvHandler csvHandler)
        {
            _context = apiContext;
            _csvHandler = csvHandler;
        }

        public List<ConnectionModel> GetConnections()
        {
            throw new NotImplementedException();
        }

        public ConnectionModel GetConnection(int connectionId)
        {
            throw new NotImplementedException();
        }

        public int AddConnection(string name, string server, string username, string password)
        {
            throw new NotImplementedException();
        }

        public Dictionary<int, string> GetDatabases(int connectionId)
        {
            throw new NotImplementedException();
        }

        public Dictionary<int, string> GetTables(int connectionId, int databaseId)
        {
            throw new NotImplementedException();
        }

        public List<DatasetModel> GetDatasets()
        {
            throw new NotImplementedException();
        }

        public void AddSqlDataset(int connectionId, int databaseId, int tableId)
        {
            throw new NotImplementedException();
        }

        public void AddCsvDataset(string pathToCsv, string name, bool isHeaderIncluded)
        {
            _csvHandler.LoadCsv(pathToCsv, isHeaderIncluded);
            _csvHandler.CsvToSql(name);
        }

        public string GetCsvDataset(int datasetId)
        {
            var dataset = _context.Dataset.Find(datasetId);
            var folderName = Path.Combine("Resources", "CSVs");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var path = Path.Combine(pathToSave, $"{dataset.Name}.csv");
            _csvHandler.SqlToCsv(dataset.Name, path);
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
            pipelineModel.Components.Insert(orderId, componentModel);
            for (int i = orderId + 1; i < pipelineModel.Components.Count; i++)
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

            AddComponent(pipeline, new ComponentModel()
            {
                Name = aggregationModel.Name,
                OrderId = orderId,
                Type = ComponentType.Aggregation,
                RelatedComponentId = aggregationModel.Id
            }, orderId);
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

            AddComponent(_context.Pipeline.Find(pipelineId), new ComponentModel()
            {
                Name = name,
                Type = ComponentType.Filter,
                OrderId = orderId,
                RelatedComponentId = filterId
            }, orderId);
        }

        public void AddJoinComponent(int pipelineId, JoinModel joinModel, int orderId)
        {
            PipelineModel pipeline = _context.Pipeline.Find(pipelineId);
            if (pipeline == null)
                throw new Exception("pipeline not found");
            if (pipeline.Components.Count < orderId)
                throw new Exception("invalid order");
            _context.JoinComponent.Add(joinModel);
            _context.SaveChanges();
            AddComponent(pipeline, new ComponentModel()
            {
                Name = joinModel.Name,
                OrderId = orderId,
                Type = ComponentType.Aggregation,
                RelatedComponentId = joinModel.Id
            }, orderId);
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
            return _context.JoinComponent.Find(componentId);
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
            throw new NotImplementedException();
        }

        public void UpdateJoinComponent(int id, JoinModel newModel)
        {
            JoinModel oldModel = _context.JoinComponent.Find(id);
            if (oldModel == null)
                throw new Exception("not found");
            oldModel.Name = newModel.Name;
            oldModel.JoinType = newModel.JoinType;
            oldModel.SecondTableName = newModel.SecondTableName;
            oldModel.FirstTablePk = newModel.FirstTablePk;
            oldModel.SecondTablePk = newModel.SecondTablePk;
            _context.SaveChanges();
        }

        public void DeleteComponent(int pipelineId, int componentId)
        {
            PipelineModel pipeline = _context.Pipeline.Find(pipelineId);
            if (pipeline == null)
                throw new Exception("pipeline not found");
            ComponentModel component = pipeline.Components.Find(c => c.OrderId == componentId);
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
            throw new NotImplementedException();
        }

        public void DeleteJoinComponent(int id)
        {
            JoinModel join = _context.JoinComponent.Find(id);
            if (join == null)
                throw new Exception("join not found");
            _context.JoinComponent.Remove(join);
            _context.SaveChanges();
        }
    }
}