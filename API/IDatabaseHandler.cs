using System;
using System.Collections.Generic;
using API.Models;

namespace API
{
    public interface IDatabaseHandler
    {
        List<ConnectionModel> GetConnections();
        ConnectionModel GetConnection(int connectionId);
        int AddConnection(string name,string server,string username,string password);
        Dictionary<int,string> GetDatabases(int connectionId);
        Dictionary<int,string> GetTables(int connectionId, int databaseId);
        List<DatasetModel> GetDatasets();
        void AddSqlDataset(int connectionId, int databaseId, int tableId);
        void AddCsvDataset(string pathToCsv,string name,bool isHeaderIncluded);
        string GetCsvDataset(int datasetId);
        List<PipelineModel> GetPipelines();

        PipelineModel GetPipeline(int pipelineId);
        int AddPipeline(string name);
        List<ComponentModel> GetComponents(int pipelineId);
        void AddAggregateComponent(int pipelineId, AggregationModel aggregationModel, int orderId);
        void AddFilterComponent(int pipelineId, string body,string name, int orderId);
        void AddJoinComponent(int pipelineId, JoinModel joinModel, int orderId);
        Tuple<ComponentType,int> GetComponent(int pipelineId, int orderId);
        AggregationModel GetAggregateComponent(int componentId);
        FilterModel GetFilterComponent(int componentId);
        JoinModel GetJoinComponent(int componentId);
        void UpdateAggregateComponent(int id, AggregationModel newModel);
        void UpdateFilterComponent(int id, AggregationModel newModel);
        void UpdateJoinComponent(int id, AggregationModel newModel);
        void DeleteComponent(int pipelineId, int componentId);
        void DeleteAggregateComponent(int id);
        void DeleteFilterComponent(int id);
        void DeleteJoinComponent(int id);
    }
}