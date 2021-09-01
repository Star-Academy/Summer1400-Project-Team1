using System.Collections.Generic;

namespace API.SqlIOHandler
{
    public interface ISqlIOHandler
    {
        bool IsServerConnected(string sourceConnectionString);
        IEnumerable<string> GetDataBaseList(string sourceConnectionString);
        IEnumerable<string> GetTableList(string sourceConnectionString);
        void ImportToNewTable(string sourceServer, string sourceDataBase, string sourceTable);
        void ExportToNewTable(string desServer, string desDataBase, string desTable, string sourceTable);
        void ExportToSelectedTable(string desServer, string desDataBase, string desTable, string sourceTable);
    }
}