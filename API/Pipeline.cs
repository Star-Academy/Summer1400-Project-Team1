using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using API.Aggregation;
using API.Filter;
using API.Join;
using API.Models;
using Newtonsoft.Json;
using static API.ComponentType;

namespace API
{
    public class Pipeline: IPipeline
    {
        public LinkedList<IPipelineComponent> Components { get; set; }
        public string SourceDataset { get; set; }
        public string DestinationDataset { get; set; }
        
        private readonly ISqlHandler _sqlHandler;
        private readonly IDatabaseHandler _databaseHandler;

        public Pipeline(ISqlHandler sqlHandler,IDatabaseHandler databaseHandler)
        {
            _sqlHandler = sqlHandler;
            _databaseHandler = databaseHandler;
            Components = new LinkedList<IPipelineComponent>();
        }
        
        
        private void AddComponent(ComponentModel componentModel)
        {
            switch (componentModel.Type)
            {
                case  ComponentType.Join:
                {
                    AddComponentJoin(componentModel);
                    break;
                }

                case ComponentType.Filter:
                {
                    AddComponentFilter(componentModel);
                    break;
                }

                case ComponentType.Aggregation:
                {
                    AddComponentAggregate(componentModel);
                    break;
                }

            }
        }

        private void AddComponentAggregate(ComponentModel componentModel)
        {
            var aggregateModel = _databaseHandler.GetAggregateComponent(componentModel.RelatedComponentId);

            var functions = aggregateModel.AggregateFunctions
                .Select(f => new AggregateFunction((AggregationType) f.AggregationType, f.ColumnName, f.OutputColumnName))
                .ToList();

            var groupItems = aggregateModel.GroupByItems
                .Select(g => new GroupByItem(g.ColumnName)).ToList();

            var component = new AggregationTask(_sqlHandler, groupItems, functions);
            Components.AddLast(component);
        }

        private void AddComponentFilter(ComponentModel componentModel)
        {
            var filterModel = _databaseHandler.GetFilterComponent(componentModel.RelatedComponentId);
            var parser = new Parser(filterModel.Query);
            var component = new ColumnFilter(_sqlHandler, parser.GetTree());
            Components.AddLast(component);
        }

        private void AddComponentJoin(ComponentModel componentModel)
        {
            var joinModel = _databaseHandler.GetJoinComponent(componentModel.RelatedComponentId);
            var component = new JoinTask(_sqlHandler, joinModel.SecondTableName, (JoinType) joinModel.JoinType,
                joinModel.FirstTablePk, joinModel.SecondTablePk);
            Components.AddLast(component);
        }

        public void LoadFromModel(PipelineModel pipelineModel)
        {
            if(pipelineModel.Source != null)SourceDataset = pipelineModel.Source.Table;
            if(pipelineModel.Destination != null)DestinationDataset = pipelineModel.Destination.Table;
            
             pipelineModel.Components.Sort((c1,c2) => c1.OrderId-c2.OrderId);

             foreach (var c in pipelineModel.Components)
            {
                AddComponent(c);
            }
        }

        public string GetSampleResult(string tableName)
        {
            if(!_sqlHandler.IsOpen())_sqlHandler.Open();
            var adaptor = new SqlDataAdapter($"SELECT TOP 50 * FROM {tableName}", _sqlHandler.Connection);
            var dataTable = new DataTable();
            adaptor.Fill(dataTable);
            return JsonConvert.SerializeObject(dataTable);
        }
        public string RunByIndex(int index)
        {
            if (SourceDataset == "") return "";
            if(index >= Components.Count-1) 
            {
                Run();
                return DestinationDataset;
            }
            var source = SourceDataset;
            var destination = "";
            var count = 0;
            foreach (var c in Components)
            {
                destination = c.Execute(source);
                if(source != SourceDataset) DeleteTable(source);
                if (count == index) return GetSampleResult(destination);
                source = destination;
                count++;
            }

            return "";
        }

        private void DeleteTable(string tableName)
        {
            if(!_sqlHandler.IsOpen())_sqlHandler.Open();
            var command = new SqlCommand($"DROP TABLE {tableName}", _sqlHandler.Connection);
            command.ExecuteNonQuery();
        }

        private void CopyToDestination(string tableName)
        {
            if(!_sqlHandler.IsOpen())_sqlHandler.Open();
            var command =
                new SqlCommand(
                    $"DROP TABLE IF EXISTS {DestinationDataset};SELECT * INTO {DestinationDataset} FROM {tableName};",
                    _sqlHandler.Connection);
            command.ExecuteNonQuery();
            DeleteTable(tableName);
        }
        
        public void Run()
        {
            if (SourceDataset == "" || DestinationDataset == "") return;
            
            var source = SourceDataset;
            string destination;
            foreach (var c in Components)
            {
                destination = c.Execute(source);
                if(source != SourceDataset) DeleteTable(source);
                if (c != Components.Last.Value) source = destination;
                else CopyToDestination(destination);
            }

        }
    }
}