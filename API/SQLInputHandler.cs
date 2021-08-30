using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace API
{
    public class SQLInputHandler
    {
        private readonly SqlConnection _destinationConnection;

        public SQLInputHandler(SqlConnection destinationConnection)
        {
            _destinationConnection = destinationConnection;
        }

        public bool IsServerConnected(string sourceConnectionString)
        {
            using var sourceServer = new SqlConnection(sourceConnectionString);
            try
            {
                sourceServer.Open();
                return true;
            }
            catch (SqlException)
            {
                return false;
            }
        }

        public IEnumerable<string> GetDataBaseList(string sourceConnectionString)
        {
            using var sourceConnection = new SqlConnection(sourceConnectionString);
            sourceConnection.Open();
            var databases = sourceConnection.GetSchema("Databases");
            var databasesName = (from DataRow database in databases.Rows 
                select database.Field<string>("database_name")).ToList();
            
            return databasesName;
        }

        public IEnumerable<string> GetTableList(string sourceConnectionString)
        {
            using var sourceConnection = new SqlConnection(sourceConnectionString);
            sourceConnection.Open();
            var tables = sourceConnection.GetSchema("Tables");
            var tablesName = (from DataRow database in tables.Rows 
                select database.Field<string>("TABLE_NAME")).ToList();
            
            return tablesName;
        }

        public void CopyDataToDataBase(string sourceServer, string sourceDataBase, string sourceTable)
        {
            var addLinkedSrvQuery =
                "EXEC sp_addlinkedserver @server='project1LinkedSrv',@srvproduct=N'', @provider=N'SQLNCLI'," +
                $" @datasrc=N'{sourceServer}', @provstr='Integrated Security=SSPI;'"+
                "EXEC sp_addlinkedsrvlogin 'project1LinkedSrv', true";
            var selectQuery =
                $"SELECT * INTO Project1.dbo.{sourceTable} FROM project1LinkedSrv.{sourceDataBase}.dbo.{sourceTable}";
            var dropLinkedSrvQuery = "EXEC sp_dropserver 'project1LinkedSrv', 'droplogins'";
           
            _destinationConnection.Open();
            using (var command = _destinationConnection.CreateCommand())
            {
                command.CommandText = addLinkedSrvQuery;
                command.ExecuteNonQuery();
                command.CommandText = selectQuery;
                command.ExecuteNonQuery();
                command.CommandText = dropLinkedSrvQuery;
                command.ExecuteNonQuery();
            }
            _destinationConnection.Close();
        } 
    }
}