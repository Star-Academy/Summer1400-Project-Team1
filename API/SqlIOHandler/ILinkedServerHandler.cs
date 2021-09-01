namespace API.SqlIOHandler
{
    public interface ILinkedServerHandler
    {
        void AddLinkedServer(string serverLinkedWith);
        void DropLinkedServer(string serverLinkedWith);
        void ImportToNewTable(string serverLinkedWith, string sourceDataBaseName, string sourceTableName);
        void ExportToNewTable(string serverLinkedWith, string desDataBaseName, string desTableName,
            string sourceTableName);
        void ExportDataToSelectedTable(string serverLinkedWith, string desDataBaseName,
            string desTableName, string sourceTableName);
    }
}