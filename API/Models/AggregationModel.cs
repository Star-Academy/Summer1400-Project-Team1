using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using YamlDotNet.Serialization;

namespace API.Models
{
    public class AggregationModel
    {
        [Key]
        [YamlIgnore]
        public int Id { get; set; }
        public List<AggregateFunctionModel> AggregateFunctions { get; set; }
        public List<GroupModel> GroupByItems { get; set; }
    }
}