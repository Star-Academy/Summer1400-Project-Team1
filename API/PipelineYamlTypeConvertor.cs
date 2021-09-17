using System;
using System.Collections.Generic;
using System.Linq;
using API.Models;
using YamlDotNet.Core;
using YamlDotNet.Core.Events;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.Utilities;

namespace API
{
    public class PipelineYamlTypeConvertor : IYamlTypeConverter
    {
        private readonly IDatabaseHandler _databaseHandler;
        private readonly ApiContext _context;

        public PipelineYamlTypeConvertor(IDatabaseHandler databaseHandler,ApiContext apiContext)
        {
            _databaseHandler = databaseHandler;
            _context = apiContext;
        }
        
        public bool Accepts(Type type)
        {
            return true;
        }

        public object? ReadYaml(IParser parser, Type type)
        {
            var pipeline = new PipelineModel();
            pipeline.DateCreated = DateTime.Now;
            parser.MoveNext();
            parser.MoveNext();
            var name = parser.Current as Scalar;
            pipeline.Name = name.Value;
            parser.MoveNext();
            parser.MoveNext();
            var source = parser.Current as Scalar;
            pipeline.Source = _context.Dataset.SingleOrDefault(d => d.Name == source.Value);
            parser.MoveNext();
            parser.MoveNext();
            var destiantion = parser.Current as Scalar;
            pipeline.Destination = _context.Dataset.SingleOrDefault(d => d.Name == destiantion.Value);
            parser.MoveNext();
            parser.MoveNext();
            parser.MoveNext();
            var deserializer = new DeserializerBuilder().BuildValueDeserializer();
            pipeline.Components = new List<ComponentModel>();
            var orderId = 0;
            while (parser.MoveNext())
            {
                if (parser.Current is MappingEnd) break;
                var nameOfComponent = parser.Current as Scalar;
                parser.MoveNext();
                parser.MoveNext(); 
                var typeOfComponent = parser.Current as Scalar;
                parser.MoveNext();
                parser.MoveNext();
                switch (typeOfComponent.Value)
                {
                    case "Aggregation":
                    { 
                        var aggregate = deserializer.DeserializeValue(parser, typeof(AggregationModel), 
                            new SerializerState(), deserializer) as AggregationModel;
                        _context.AggregateComponent.Add(aggregate);
                        _context.SaveChanges();
                        pipeline.Components.Add(new ComponentModel()
                        {
                            Name = nameOfComponent.Value,OrderId = orderId,RelatedComponentId = aggregate.Id,Type = ComponentType.Aggregation
                        });
                        break;
                    }
                    case "Filter":
                    {
                        var filter = deserializer.DeserializeValue(parser, typeof(FilterModel),
                            new SerializerState(), deserializer) as FilterModel; 
                        _context.FilterComponent.Add(filter);
                        _context.SaveChanges();
                        pipeline.Components.Add(new ComponentModel()
                        {
                            Name = nameOfComponent.Value,OrderId = orderId,RelatedComponentId = filter.Id,Type = ComponentType.Filter
                        });
                        break;
                    }
                    case "Join":
                    {
                        var join = deserializer.DeserializeValue(parser, typeof(JoinModel),
                            new SerializerState(), deserializer) as JoinModel;
                        _context.JoinComponent.Add(join);
                        _context.SaveChanges();
                        pipeline.Components.Add(new ComponentModel()
                        {
                            Name = nameOfComponent.Value,OrderId = orderId,RelatedComponentId = join.Id,Type = ComponentType.Join
                        });
                        break;
                    }
                }

                _context.SaveChanges();
                orderId++;
            }

            parser.MoveNext();
            return pipeline;
        }
        
        private void AddComponent(IEmitter emitter, PipelineModel pipeline)
        {
            var serializer = new SerializerBuilder().BuildValueSerializer();
            pipeline.Components.Sort((c1,c2) => c1.OrderId-c2.OrderId);
            emitter.Emit(new MappingStart(null,null,false,MappingStyle.Block));
            foreach (var c in pipeline.Components)
            {
                emitter.Emit(new Scalar(null,"Name"));
                emitter.Emit(new Scalar(null,c.Name));
                emitter.Emit(new Scalar(null,"Type"));
                switch (c.Type)
                {
                    case ComponentType.Aggregation:
                    {
                        emitter.Emit(new Scalar(null, "Aggregation"));
                        emitter.Emit(new Scalar(null, "Component"));
                        serializer.SerializeValue(emitter,_databaseHandler.GetAggregateComponent(c.RelatedComponentId),typeof(AggregationModel));
                        break;
                    }
                    case ComponentType.Filter:
                    {
                        emitter.Emit(new Scalar(null, "Filter"));
                        emitter.Emit(new Scalar(null, "Component"));
                        serializer.SerializeValue(emitter,_databaseHandler.GetFilterComponent(c.RelatedComponentId),typeof(FilterModel));
                        break;
                    }
                    case ComponentType.Join:
                    {
                        emitter.Emit(new Scalar(null, "Join"));
                        emitter.Emit(new Scalar(null, "Component"));
                        serializer.SerializeValue(emitter,_databaseHandler.GetJoinComponent(c.RelatedComponentId),typeof(JoinModel));
                        break;
                    }
                }
            }
            emitter.Emit(new MappingEnd());
        }

        public void WriteYaml(IEmitter emitter, object? value, Type type)
        {
            var pipeline = (PipelineModel) value;

            emitter.Emit(new MappingStart(null,null,false,MappingStyle.Block));
            
            emitter.Emit(new Scalar(null,"Name"));
            emitter.Emit(new Scalar(null,pipeline.Name));
            
            emitter.Emit(new Scalar(null,"Source"));
            if(pipeline.Source != null)emitter.Emit(new Scalar(null,pipeline.Source.Name));
            else emitter.Emit(new Scalar(null,""));

            emitter.Emit(new Scalar(null,"Destination"));
            if(pipeline.Destination != null)emitter.Emit(new Scalar(null,pipeline.Destination.Name));
            else emitter.Emit(new Scalar(null,""));
            
            emitter.Emit(new Scalar(null,"Components"));
            
            AddComponent(emitter,pipeline);

            emitter.Emit(new MappingEnd());
        }
    }
}