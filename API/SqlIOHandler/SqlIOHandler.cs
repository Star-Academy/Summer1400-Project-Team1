using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace API.SqlIOHandler
{
    public class SqlIOHandler : ISqlIOHandler
    {
        private readonly ILinkedServerHandler _linkedServerHandler;

        public SqlIOHandler(ILinkedServerHandler linkedServerHandler)
        {
            _linkedServerHandler = linkedServerHandler;
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

        public void ImportToNewTable(string sourceServer, string sourceDataBase, string sourceTable)
        {
            _linkedServerHandler.AddLinkedServer(sourceServer);
            _linkedServerHandler.ImportToNewTable(sourceServer,sourceDataBase,sourceTable);
            _linkedServerHandler.DropLinkedServer(sourceServer);
            
        }
        
        public void ExportToNewTable(string desServer, string desDataBase,string desTable, string sourceTable)
        {
            _linkedServerHandler.AddLinkedServer(desServer);
            _linkedServerHandler.ExportToNewTable(desServer,desDataBase,desTable,sourceTable);
            _linkedServerHandler.DropLinkedServer(desServer);
            
        }
        
        public void ExportToSelectedTable(string desServer, string desDataBase,string desTable, string sourceTable)
        {
            _linkedServerHandler.AddLinkedServer(desServer);
            _linkedServerHandler.ExportDataToSelectedTable(desServer,desDataBase,desTable,sourceTable);
            _linkedServerHandler.DropLinkedServer(desServer);
            
        }

    }
}