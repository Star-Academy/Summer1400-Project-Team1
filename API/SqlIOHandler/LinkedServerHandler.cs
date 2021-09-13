namespace API.SqlIOHandler
{
    public class LinkedServerHandler : ILinkedServerHandler
    {
        private readonly ISqlHandler _sqlHandler;

        public LinkedServerHandler(ISqlHandler sqlHandler)
        {
            _sqlHandler = sqlHandler;
        }

        public void AddLinkedServer(string serverLinkedWith, string username, string password)
        {
            if (!_sqlHandler.IsOpen())
                _sqlHandler.Open();
            var addLinkedSrvQuery = $"EXEC sp_addlinkedserver @server='{serverLinkedWith}'" +
                                    $"EXEC sp_addlinkedsrvlogin @rmtsrvname='{serverLinkedWith}' ," +
                                    $"@useself='FALSE', @locallogin='sa', @rmtuser='{username}'," +
                                    $"@rmtpassword='{password}'";
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
        
        public void ImportToNewTable(string serverLinkedWith,string destinationTableName,string sourceDataBaseName, string sourceTableName)
        {
            if (!_sqlHandler.IsOpen())
                _sqlHandler.Open();
            var selectQuery =
                $"SELECT * INTO {destinationTableName} FROM {serverLinkedWith}.{sourceDataBaseName}.dbo.{sourceTableName}";
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