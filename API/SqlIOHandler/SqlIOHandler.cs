using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using API.Models;

namespace API.SqlIOHandler
{
    public class SqlIOHandler : ISqlIOHandler
    {
        // public bool AddConnection(string sourceConnectionString)
        // {
        //     using var sourceServer = new SqlConnection(sourceConnectionString);
        //     try
        //     {
        //         sourceServer.Open();
        //         return true;
        //     }
        //     catch (SqlException)
        //     {
        //         return false;
        //     }
        // }

        public IEnumerable<string> GetDatabases(string sourceConnectionString)
        {
            using var sourceConnection = new SqlConnection(sourceConnectionString);
            sourceConnection.Open();
            var databases = sourceConnection.GetSchema("Databases");
            var databasesName = (from DataRow database in databases.Rows 
                select database.Field<string>("database_name")).ToList();
            
            return databasesName;
        }

        public IEnumerable<string> GetTables(string sourceConnectionString)
        {
            using var sourceConnection = new SqlConnection(sourceConnectionString);
            sourceConnection.Open();
            var tables = sourceConnection.GetSchema("Tables");
            var tablesName = (from DataRow table in tables.Rows 
                select table.Field<string>("TABLE_NAME")).ToList();
            
            return tablesName;
        }
        

    }
}