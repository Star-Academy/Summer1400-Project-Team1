namespace API.SqlIOHandler
{
    public class LinkedServerHandler : ILinkedServerHandler
    {
        private readonly ISqlHandler _sqlHandler;

        public LinkedServerHandler(ISqlHandler sqlHandler)
        {
            _sqlHandler = sqlHandler;
        }

        public void AddLinkedServer(string serverLinkedWith)
        {
            if (!_sqlHandler.IsOpen())
                _sqlHandler.Open();
            var addLinkedSrvQuery = $"EXEC sp_addlinkedserver @server='{serverLinkedWith}'" +
                                    $"EXEC sp_addlinkedsrvlogin '{serverLinkedWith}', true";
            _sqlHandler.ExecuteSQLQuery(addLinkedSrvQuery);
            _sqlHandler.Close();
        }

        public void DropLinkedServer(string serverLinkedWith)
        {
            if (!_sqlHandler.IsOpen())
                _sqlHandler.Open();
            var dropLinkedSrvQuery = $"EXEC sp_dropserver '{serverLinkedWith}', 'droplogins'";
            _sqlHandler.ExecuteSQLQuery(dropLinkedSrvQuery);
            _sqlHandler.Close();
        }
        
        public void ImportToNewTable(string serverLinkedWith,string sourceDataBaseName, string sourceTableName)
        {
            if (!_sqlHandler.IsOpen())
                _sqlHandler.Open();
            var selectQuery =
                $"SELECT * INTO {sourceTableName} FROM {serverLinkedWith}.{sourceDataBaseName}.dbo.{sourceTableName}";
            _sqlHandler.ExecuteSQLQuery(selectQuery);
            _sqlHandler.Close();
        }
        
        public void ExportToNewTable(string serverLinkedWith,string desDataBaseName, string desTableName,
            string sourceTableName)
        {
            if (!_sqlHandler.IsOpen())
                _sqlHandler.Open();
            var selectQuery =
                $"SELECT * INTO {serverLinkedWith}.{desDataBaseName}.dbo.{desTableName} FROM {sourceTableName}";
            _sqlHandler.ExecuteSQLQuery(selectQuery);
            _sqlHandler.Close();
        }
        
        public void ExportDataToSelectedTable(string serverLinkedWith,string desDataBaseName,
            string desTableName, string sourceTableName)
        {
            if (!_sqlHandler.IsOpen())
                _sqlHandler.Open();
            var selectQuery =
                $"INSERT INTO {serverLinkedWith}.{desDataBaseName}.dbo.{desTableName} SELECT * FROM {sourceTableName}";
            _sqlHandler.ExecuteSQLQuery(selectQuery);
            _sqlHandler.Close();
        }
    }
}