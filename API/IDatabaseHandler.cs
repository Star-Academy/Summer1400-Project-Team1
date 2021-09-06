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
        List<string> GetDatabases(int connectionId);
        List<string> GetTables(int connectionId, string databaseName);
        List<DatasetModel> GetDatasets();
        void AddSqlDataset(string datasetName, int connectionId, string databaseName, string tableNames);
        void AddCsvDataset(string pathToCsv);
        string GetCsvDataset(int datasetId);
        List<PipelineModel> GetPipelines();
        int AddPipeline(string name);
        List<ComponentModel> GetComponents(int pipelineId);
        void AddAggregateComponent(int pipelineId, AggregationModel aggregationModel, int orderId);
        void AddFilterComponent(int pipelineId, string body,string name, int orderId);
        void AddJoinComponent(int pipelineId, JoinModel joinModel, int orderId);
        Tuple<int,int> GetComponent(int pipelineId, int orderId);
        AggregationModel GetAggregateComponent(int componentId);
        FilterModel GetFilterComponent(int componentId);
        JoinModel GetJoinComponent(int componentId);
    }
}