using System.Data;

namespace API.Aggregation
{
    public interface IAggregationTask
    {
        DataTable Run();
    }
}