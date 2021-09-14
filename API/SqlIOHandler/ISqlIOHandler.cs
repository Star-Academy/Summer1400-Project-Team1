using System.Collections.Generic;
using API.Models;
using System.Data.SqlClient;

namespace API.SqlIOHandler
{
    public interface ISqlIOHandler
    {
        IEnumerable<string> GetDatabases(string sourceConnectionString);
        IEnumerable<string> GetTables(string sourceConnectionString);
        void ImportDataFromSql(ConnectionModel connectionModel,string datasetNAme, string databaseName, string tableName);
        string GetTableSample(string tableName, int count);
        int GetNumberOfRows(string tableName);
    }
}