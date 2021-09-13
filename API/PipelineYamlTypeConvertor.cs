using System;
using System.IO;
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
        public IValueDeserializer ValueDeserializer { get; set; }

        public PipelineYamlTypeConvertor(IDatabaseHandler databaseHandler)
        {
            _databaseHandler = databaseHandler;
        }
        
        public bool Accepts(Type type)
        {
            return true;
        }

        public object? ReadYaml(IParser parser, Type type)
        {
            var pipeline = new PipelineModel();

            if (parser.Current is MappingStart)
            {
                parser.MoveNext();
                parser.MoveNext();
                var name = parser.Current as Scalar;
                pipeline.Name = name.Value;
                parser.MoveNext();
                parser.MoveNext();
                var source = parser.Current as Scalar;
                pipeline.Source = new DatasetModel()
                {
                    Name = source.Value
                };
                parser.MoveNext();
                parser.MoveNext();
                var destiantion = parser.Current as Scalar;
                pipeline.Destination = new DatasetModel()
                {
                    Name = destiantion.Value
                };
                parser.MoveNext();
                parser.MoveNext();
                parser.MoveNext();
                var deserializer = new DeserializerBuilder().BuildValueDeserializer();
                while (parser.MoveNext())
                {
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
                                new SerializerState(), deserializer);
                            Console.WriteLine("");
                            break;
                        }
                        case "Filter":
                        {
                            var filter = deserializer.DeserializeValue(parser, typeof(FilterModel),
                                new SerializerState(), deserializer);
                            Console.WriteLine("");
                            break;
                        }
                        case "Join":
                        {
                            var join = deserializer.DeserializeValue(parser, typeof(JoinModel),
                                new SerializerState(), deserializer);
                            Console.WriteLine("");
                            break;
                        }
                    }
                }
            }
            else throw new InvalidDataException();

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
            emitter.Emit(new Scalar(null,pipeline.Source.Name));
            
            emitter.Emit(new Scalar(null,"Destination"));
            emitter.Emit(new Scalar(null,pipeline.Destination.Name));
            
            emitter.Emit(new Scalar(null,"Components"));
            
            AddComponent(emitter,pipeline);

            emitter.Emit(new MappingEnd());
        }
    }
}