using System.Data;
using System.Data.SqlClient;

namespace API
{
    public interface ISqlHandler
    {
        SqlConnection Connection { get; }
        bool IsOpen();
        void Open();
        void Close();
        IDbCommand CreatCommand();
    }
}