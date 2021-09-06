using System.Collections.Generic;

namespace API.SqlIOHandler
{
    public interface ISqlIOHandler
    {
        bool AddConnection(string sourceConnectionString);
        IEnumerable<string> GetDataBaseList(string sourceConnectionString);
        IEnumerable<string> GetTableList(string sourceConnectionString);
    }
}