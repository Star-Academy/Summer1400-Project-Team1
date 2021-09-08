using System;
using System.Collections.Generic;
using System.Linq;
using API.Models;

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

        public DatabaseHandler(ApiContext apiContext)
        {
            _context = apiContext;
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
            pipeline.Components.Insert(orderId,new ComponentModel()
            {
                Name = aggregationModel.Name,
                OrderId = orderId,
                Type = ComponentType.Aggregation,
                RelatedComponentId = aggregationModel.Id
            });
            _context.SaveChanges();
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
                Type = ComponentType.Filter,
                OrderId = orderId,
                RelatedComponentId = filterId
            };
            
            _context.Pipeline.Find(pipelineId).Components.Add(newComponentModel);

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

        public PipelineModel GetPipeline(int id)
        {
            return _context.Pipeline.Find(id);
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
    }
}