using System;
using System.Collections.Generic;
using System.Linq;
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