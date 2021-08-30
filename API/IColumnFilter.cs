using System.Data;

namespace API
{
    public interface IColumnFilter
    {
        DataTable GetConditionResult(Node root, string tableName);
    }
}