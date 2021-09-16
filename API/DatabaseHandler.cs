using System;
using System.Collections.Generic;
using System.IO;
using System.Data;
using System.Linq;
using API.Models;
using API.SqlIOHandler;
using System.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting.Internal;
using YamlDotNet.Serialization;

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
        private readonly ISqlHandler _sqlHandler;

        public DatabaseHandler(ApiContext apiContext, ISqlIOHandler sqlIoHandler, ICsvHandler csvHandler,ISqlHandler sqlHandler)
        {
            _context = apiContext;
            _csvHandler = csvHandler;
            _sqlIoHandler = sqlIoHandler;
            _sqlHandler = sqlHandler;
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

        public void DeleteConnection(int id)
        {
            var connectionModel = _context.Connection.Find(id);
            if (connectionModel == null)
                throw new Exception("connection not found");
            _context.Connection.Remove(connectionModel);
            _context.SaveChanges();
        }

        public void UpdateConnection(int id, string name, string server, string username, string password)
        {
            var connectionModel = _context.Connection.Find(id);
            if (connectionModel == null)
                throw new Exception("connectionNot found");
            connectionModel.Name = name ?? connectionModel.Name;
            connectionModel.Server = server ?? connectionModel.Server;
            connectionModel.Username = username ?? connectionModel.Username;
            connectionModel.Password = password ?? connectionModel.Password;
            connectionModel.BuildConnectionString();
            _context.SaveChanges();
        }

        public IEnumerable<string> GetDatabases(int connectionId)
        {
            var serverConnectionString = _context.Connection.Find(connectionId)?.ConnectionString;
            if (serverConnectionString == null)
                return null;
            var databases = _sqlIoHandler.GetDatabases(serverConnectionString);

            return databases;
        }

        public IEnumerable<string> GetTables(int connectionId, string databaseName)
        {
            if (!GetDatabases(connectionId).Contains(databaseName) || _context.Connection.Find(connectionId) == null)
                return null;
            var connectionStringToDatabase =
                _context.Connection.Find(connectionId).ConnectionString + $"Database={databaseName};";
            var tables = _sqlIoHandler.GetTables(connectionStringToDatabase);
            return tables;
        }

        public List<DatasetModel> GetDatasets()
        {
            return _context.Dataset.ToList();
        }

        public IEnumerable<PipelineModel> GetDatasetPipelines(int id, int count)
        {
            return _context.Pipeline.Where(model => model.Source.Id == id).Take(count);
        }
        
        public string GetDatasetSamples(int id, int count)
        {
            var tableName = _context.Dataset.Find(id).Name;
            if (tableName == null)
                throw new Exception("dataset not found");
            return _sqlIoHandler.GetTableSample(tableName, count);
        }

        public void DeleteDataset(int id)
        {
            var dataset = _context.Dataset.Find(id);
            if (dataset == null)
                throw new Exception("dataset not found");
            DeleteTable(dataset.Name);
            _context.Dataset.Remove(dataset);
            _context.SaveChanges();
        }

        public int AddDataset(string name)
        {
            var dataset = new DatasetModel()
            {
                Name = name, DateCreated = DateTime.Now, Connection = null
            };
            _context.Dataset.Add(dataset);
            _context.SaveChanges();
            return dataset.Id;
        }

        public void AddSqlDataset(string datasetName, int connectionId, string databaseName, string tableName)
        {
            var connectionModel = _context.Connection.Find(connectionId);
            _sqlIoHandler.ImportDataFromSql(connectionModel, datasetName, databaseName, tableName);
            _context.Dataset.Add(new DatasetModel()
            {
                Connection = connectionModel, Name = datasetName, DateCreated = DateTime.Now
            });
            _context.SaveChanges();
        }

        public void AddCsvDataset(string pathToCsv, string name, string delimiter, bool isHeaderIncluded)
        {
            _csvHandler.LoadCsv(pathToCsv, delimiter,isHeaderIncluded);
            _csvHandler.CsvToSql(name);
            _context.Dataset.Add(new DatasetModel()
            {
                Connection = null, Name = name, DateCreated = DateTime.Now
            });
            _context.SaveChanges();
        }

        public string GetCsvDataset(int datasetId,string delimiter,bool header)
        {
            var dataset = _context.Dataset.Find(datasetId);
            var folderName = Path.Combine("Resources", "CSVs");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var path = Path.Combine(pathToSave, $"{dataset.Name}.csv");
            _csvHandler.SqlToCsv(dataset.Name, path,delimiter,header);
            return path;
        }

        public void ExportToNewSqlTable(int connectionId, int datasetId, string databaseName, string tableName)
        {
            var connectionModel = _context.Connection.Find(connectionId);
            var datasetModel = _context.Dataset.Find(datasetId);
            if (datasetModel == null || connectionModel == null)
                throw new Exception("invalid id");
            _sqlIoHandler.ExportIntoNewTable(connectionModel,datasetModel.Name,databaseName,tableName);
        }
        
        public void ExportToSelectedSqlTable(int connectionId, int datasetId, string databaseName, string tableName)
        {
            var connectionModel = _context.Connection.Find(connectionId);
            var datasetModel = _context.Dataset.Find(datasetId);
            if (datasetModel == null || connectionModel == null)
                throw new Exception("invalid id");
            _sqlIoHandler.ExportIntoSelectedTable(connectionModel,datasetModel.Name,databaseName,tableName);
        }

        public List<PipelineModel> GetPipelines()
        {
            return _context.Pipeline
                .Include(p => p.Source)
                .Include(p => p.Destination)
                .ToList();
        }

        public PipelineModel GetPipeline(int pipelineId)
        {
            var pipeline = _context.Pipeline.Find(pipelineId);
            _context.Entry(pipeline).Reference(p => p.Source).Load();
            _context.Entry(pipeline).Reference(p => p.Destination).Load();
            _context.Entry(pipeline).Collection(p => p.Components).Load();
            return pipeline;
        }

        public void AddYmlPipeline(string pathToYml)
        {
            var file = File.OpenText(pathToYml);
            var serializer = new DeserializerBuilder()
                .WithTypeConverter(new PipelineYamlTypeConvertor(this, _context))
                .Build();
            var pipeline = serializer.Deserialize(file) as PipelineModel;
            _context.Pipeline.Add(pipeline);
            _context.SaveChanges();
        }

        public string GetPipelineYml(int pipelineId)
        {
            var pipeline = GetPipeline(pipelineId);
            var serializer = new SerializerBuilder()
                .WithTypeConverter(new PipelineYamlTypeConvertor(this, _context))
                .Build();
            var yml = serializer.Serialize(pipeline);
            var folderName = Path.Combine("Resources", "YMLs");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var path = Path.Combine(pathToSave, $"{pipeline.Name}.yml");
            using var writer = new StreamWriter(path);
            writer.Write(yml);
            return path;
        }

        public int AddPipeline(string name, int sid, int did)
        {
            var pipeline = new PipelineModel()
            {
                Name = name,
                Source = _context.Dataset.Find(sid),
                Destination = _context.Dataset.Find(did),
                DateCreated = DateTime.Now
            };
            _context.Pipeline.Add(pipeline);
            try
            {
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("pipeline with this name already exists");
            }

            return pipeline.Id;
        }

        public void UpdatePipeline(int id, string name, int sid, int did)
        {
            var pipeline = _context.Pipeline.Find(id);
            _context.Entry(pipeline).Reference(p => p.Source).Load();
            _context.Entry(pipeline).Reference(p => p.Destination).Load();
            if (pipeline == null) throw new Exception("not found");
            pipeline.Name = name;
            if (sid != -1) pipeline.Source = _context.Dataset.Find(sid);
            if (did != -1) pipeline.Destination = _context.Dataset.Find(did);
            _context.SaveChanges();
        }

        public void DeletePipeline(int id)
        {
            var pipeline = _context.Pipeline.Find(id);
            if (pipeline == null) throw new Exception("not found");
            _context.Pipeline.Remove(pipeline);
            _context.SaveChanges();
        }

        public List<ComponentModel> GetComponents(int pipelineId)
        {
            return _context.Pipeline
                .Find(pipelineId)
                .Components.ToList();
        }

        private void AddComponent(PipelineModel pipelineModel, ComponentModel componentModel, int orderId)
        {
            pipelineModel.Components.Sort((c1, c2) => c1.OrderId - c2.OrderId);
            pipelineModel.Components.Insert(orderId, componentModel);
            for (int i = orderId + 1; i < pipelineModel.Components.Count; i++)
            {
                pipelineModel.Components[i].OrderId++;
            }

            _context.SaveChanges();
        }

        public void AddAggregateComponent(int pipelineId, string name, AggregationModel aggregationModel, int orderId)
        {
            PipelineModel pipeline = _context.Pipeline.Find(pipelineId);
            if (pipeline == null)
                throw new Exception("pipeline not found");
            if (pipeline.Components.Count < orderId)
                throw new Exception("invalid order");
            _context.AggregateComponent.Add(aggregationModel);
            _context.SaveChanges();

            AddComponent(pipeline, new ComponentModel()
            {
                Name = name,
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

        public void AddJoinComponent(int pipelineId, string name, JoinModel joinModel, int orderId)
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
                Name = name,
                OrderId = orderId,
                Type = ComponentType.Join,
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
            ComponentModel component = pipeline.Components.Find(c => c.OrderId == orderId);
            return new Tuple<ComponentType, int>(component.Type, component.RelatedComponentId);
        }

        public AggregationModel GetAggregateComponent(int componentId)
        {
            var component = _context.AggregateComponent.Find(componentId);
            _context.Entry(component).Collection(c => c.AggregateFunctions).Load();
            _context.Entry(component).Collection(c => c.GroupByItems).Load();
            return component;
        }

        public FilterModel GetFilterComponent(int componentId)
        {
            return _context.FilterComponent.Find(componentId);
        }

        public JoinModel GetJoinComponent(int componentId)
        {
            return _context.JoinComponent.Find(componentId);
        }

        public void UpdateComponent(int pipelineId, int componentId, string name)
        {
            PipelineModel pipeline = _context.Pipeline.Find(pipelineId);
            if (pipeline == null)
                throw new Exception("pipeline not found");
            if (componentId >= pipeline.Components.Count)
                throw new Exception("invalid orderId");
            ComponentModel component = pipeline.Components.Find(c => c.OrderId == componentId);
            component.Name = name;
            _context.SaveChanges();
        }

        public void UpdateAggregateComponent(int id, AggregationModel newModel)
        {
            var oldModel = _context.AggregateComponent.Find(id);
            if (oldModel == null)
                throw new Exception("not found");
            if (newModel.AggregateFunctions != null)
                oldModel.AggregateFunctions = newModel.AggregateFunctions;
            if (newModel.GroupByItems != null)
                oldModel.GroupByItems = newModel.GroupByItems;
            _context.SaveChanges();
        }

        public void UpdateFilterComponent(int id, FilterModel newModel)
        {
            var oldModel = _context.FilterComponent.Find(id);
            if (oldModel == null)
                throw new Exception("not found");
            if (oldModel.Query != newModel.Query)
            {
                oldModel.Query = newModel.Query;
                _context.SaveChanges();
            }
        }

        public void UpdateJoinComponent(int id, JoinModel newModel)
        {
            JoinModel oldModel = _context.JoinComponent.Find(id);
            if (oldModel == null)
                throw new Exception("not found");
            oldModel.JoinType = newModel.JoinType;
            if(newModel.SecondTableName != null)oldModel.SecondTableName = newModel.SecondTableName;
            if(newModel.FirstTablePk != null)oldModel.FirstTablePk = newModel.FirstTablePk;
            if(newModel.SecondTablePk != null)oldModel.SecondTablePk = newModel.SecondTablePk;
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
            pipeline.Components.Sort((c1, c2) => c1.OrderId - c2.OrderId);
            for (int i = componentId; i < pipeline.Components.Count; i++)
            {
                pipeline.Components[i].OrderId--;
            }

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
            JoinModel join = _context.JoinComponent.Find(id);
            if (join == null)
                throw new Exception("join not found");
            _context.JoinComponent.Remove(join);
            _context.SaveChanges();
        }

        public List<string> GetColumn(string dataset)
        {
            if (!_sqlHandler.IsOpen()) _sqlHandler.Open();
            var columns = _sqlHandler.Connection.GetSchema("Columns", new[] {null, null, dataset});
            return (from DataRow r in columns.Rows select r[3].ToString()).ToList();
        }

        public List<string> GetTempColumn(string dataset)
        {
            var result = new List<string>();
            if (!_sqlHandler.IsOpen()) _sqlHandler.Open();
            var command = new SqlCommand($"Select name From  Tempdb.Sys.Columns Where Object_ID = Object_ID('tempdb..{dataset}')",_sqlHandler.Connection);
            using var reader = command.ExecuteReader();
            result.AddRange(from IDataRecord r in reader select r.GetValue(0).ToString());

            return result;
        }

        public void DeleteTable(string tableName)
        {
            if(!_sqlHandler.IsOpen())_sqlHandler.Open();
            var command = new SqlCommand($"DROP TABLE IF EXISTS {tableName}", _sqlHandler.Connection);
            command.ExecuteNonQuery();
        }
    }
}