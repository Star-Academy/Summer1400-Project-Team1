using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace API
{
    public class SQLInputHandler : ISQLInputHandler
    {
        private readonly ISqlHandler _destinationConnection;

        public SQLInputHandler(ISqlHandler destinationConnection)
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
            var tablesName = (from DataRow table in tables.Rows 
                select table.Field<string>("TABLE_NAME")).ToList();
            
            return tablesName;
        }

        public void CopyDataToDataBase(string sourceServer, string sourceDataBase, string sourceTable)
        {
            _destinationConnection.Open();
            AddLinkedServer(sourceServer);
            GetTableDataViaLinkedServer(sourceServer,sourceDataBase,sourceTable);
            DropLinkedServer(sourceServer);
            _destinationConnection.Close();
        }

        public void AddLinkedServer(string serverLinkWith)
        {
            var addLinkedSrvQuery =
                $"EXEC sp_addlinkedserver @server='{serverLinkWith}'"+
                $"EXEC sp_addlinkedsrvlogin '{serverLinkWith}', true";
            _destinationConnection.ExecuteSQLQuery(addLinkedSrvQuery);
        }

        public void DropLinkedServer(string serverLinkWith)
        {
            var dropLinkedSrvQuery = $"EXEC sp_dropserver '{serverLinkWith}', 'droplogins'";
            _destinationConnection.ExecuteSQLQuery(dropLinkedSrvQuery);
        }

        public void GetTableDataViaLinkedServer(string linkedServerName,string sourceDataBase, string tableName)
        {
            var selectQuery =
                $"SELECT * INTO {tableName} FROM {linkedServerName}.{sourceDataBase}.dbo.{tableName}";
            _destinationConnection.ExecuteSQLQuery(selectQuery);
        }
        
    }
}