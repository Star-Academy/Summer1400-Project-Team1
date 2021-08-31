using System.Data;

namespace API.Join
{
    public interface IJoinTask
    {
        DataTable Run();
    }

    public enum JoinType
    {
        InnerJoin,
        LeftJoin,
        RightJoin,
        FullJoin
    }
}