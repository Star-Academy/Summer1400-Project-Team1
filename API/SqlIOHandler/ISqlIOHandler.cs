using System.Collections.Generic;

namespace API.SqlIOHandler
{
    public interface ISqlIOHandler
    {
        // bool AddConnection(string sourceConnectionString);
        IEnumerable<string> GetDatabases(string sourceConnectionString);
        IEnumerable<string> GetTables(string sourceConnectionString);
    }
}