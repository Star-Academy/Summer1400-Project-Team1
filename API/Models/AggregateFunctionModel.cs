using API.Aggregation;
using Microsoft.EntityFrameworkCore;

namespace API.Models
{
    [Owned]
    public class AggregateFunctionModel
    {
        public AggregationType AggregationType { get; set; }
        public string ColumnName { get; set; }
        public string OutputColumnName { get; set; }
    }
}