using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using API.Models;

namespace API
{
    public interface IDatabaseHandler
    {
        List<ConnectionModel> GetConnections();
        ConnectionModel GetConnection(int connectionId);
        int AddConnection(string name,string server,string username,string password);
        void DeleteConnection(int id);
        void UpdateConnection(int id, string name, string server, string username, string password);
        IEnumerable<string> GetDatabases(int connectionId);
        IEnumerable<string> GetTables(int connectionId, string databaseName);
        List<DatasetModel> GetDatasets();
        int GetDatasetStatistics(int id);
        public IEnumerable<PipelineModel> GetDatasetPipelines(int id, int count);
        string GetDatasetSamples(int id, int count);
        void DeleteDataset(int id);
        int AddDataset(string name);
        void AddSqlDataset(string datasetName, int connectionId, string databaseName, string tableNames);
        void AddCsvDataset(string pathToCsv,string name,bool isHeaderIncluded);
        string GetCsvDataset(int datasetId);
        List<PipelineModel> GetPipelines();
        PipelineModel GetPipeline(int pipelineId);
        void AddYmlPipeline(string pathToYml);
        string GetPipelineYml(int pipelineId);
        int AddPipeline(string name,int sid,int did);
        void UpdatePipeline(int id, string name, int sid, int did);
        void DeletePipeline(int id);
        List<ComponentModel> GetComponents(int pipelineId);
        void AddAggregateComponent(int pipelineId, string name, AggregationModel aggregationModel, int orderId);
        void AddFilterComponent(int pipelineId, string body,string name, int orderId);
        void AddJoinComponent(int pipelineId, string name,JoinModel joinModel, int orderId);
        Tuple<ComponentType,int> GetComponent(int pipelineId, int orderId);
        AggregationModel GetAggregateComponent(int componentId);
        FilterModel GetFilterComponent(int componentId);
        JoinModel GetJoinComponent(int componentId);
        void UpdateComponent(int pipelineId, int componentId, string name);
        void UpdateAggregateComponent(int id, AggregationModel newModel);
        void UpdateFilterComponent(int id, FilterModel newModel);
        void UpdateJoinComponent(int id, JoinModel newModel);
        void DeleteComponent(int pipelineId, int componentId);
        void DeleteAggregateComponent(int id);
        void DeleteFilterComponent(int id);
        void DeleteJoinComponent(int id);
    }
}