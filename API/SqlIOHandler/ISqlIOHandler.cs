using System.Collections.Generic;
using API.Models;

namespace API.SqlIOHandler
{
    public interface ISqlIOHandler
    {
        // bool AddConnection(string sourceConnectionString);
        IEnumerable<string> GetDatabases(string sourceConnectionString);
        IEnumerable<string> GetTables(string sourceConnectionString);
        void ImportDataFromSql(ConnectionModel connectionModel, string databaseName, string tableName);
    }
}