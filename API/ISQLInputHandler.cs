using System.Collections.Generic;

namespace API
{
    public interface ISQLInputHandler
    {
        bool IsServerConnected(string sourceConnectionString);
        IEnumerable<string> GetDataBaseList(string sourceConnectionString);
        IEnumerable<string> GetTableList(string sourceConnectionString);
        void CopyDataToDataBase(string sourceServer, string sourceDataBase, string sourceTable);
    }
}