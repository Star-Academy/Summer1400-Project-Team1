using System.Data;

namespace API.Filter
{
    public interface IColumnFilter
    {
        //for test
        DataTable GetConditionResult(string tableName);
    }
}