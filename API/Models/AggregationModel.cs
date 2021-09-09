using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class AggregationModel
    {
        [Key]
        public int Id { get; set; }
        public List<AggregateFunctionModel> AggregateFunctions { get; set; }
        public List<GroupModel> GroupByItems { get; set; }
    }
}