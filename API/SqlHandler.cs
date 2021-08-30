using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace API
{
    public class SqlHandler : ISqlHandler
    {
        public SqlConnection Connection { get; }

        public SqlHandler(IConfiguration configuration)
        {
            Connection = new SqlConnection(configuration[configuration["method"]]);
        }
        
        public bool IsOpen()
        {
            return Connection.State == ConnectionState.Open;
        }

        public void Open()
        {
            Connection.Open();
        }

        public void Close()
        {
            Connection.Close();
        }

        public IDbCommand CreatCommand()
        {
            return Connection.CreateCommand();
        }
    }
}