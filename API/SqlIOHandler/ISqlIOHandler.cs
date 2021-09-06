using System.Collections.Generic;

namespace API.SqlIOHandler
{
    public interface ISqlIOHandler
    {
        bool IsServerConnected(string sourceConnectionString);
        IEnumerable<string> GetDataBaseList(string sourceConnectionString);
        IEnumerable<string> GetTableList(string sourceConnectionString);
    }
}