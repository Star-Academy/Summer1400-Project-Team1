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

        public void CopyDataToDataBase(string sourceServer, string sourceDataBase, string sourceTable, string username, string password)
        {
            var sqlQuery =
                $"EXEC sp_addlinkedserver @server=\'{sourceServer}\'" +
                $"EXEC sp_addlinkedsrvlogin \'{sourceServer}\', \'false\', NULL, \'{username}\', \'{password}\'"+
                $"SELECT * INTO Project1.dbo.{sourceTable} FROM {sourceServer}.{sourceDataBase}.dbo.{sourceTable}"+
                $"EXEC sp_dropserver \'{sourceServer}\', \'droplogins\';";
            
            _destinationConnection.Open();
            var sqlCommand = new SqlCommand(sqlQuery, _destinationConnection);
            sqlCommand.ExecuteReader();
            _destinationConnection.Close();
        }
    }
}