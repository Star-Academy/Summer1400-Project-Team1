namespace API.SqlIOHandler
{
    public class SqlDataset
    {
        public string Name { get; set; }
        public int ConnectionId { get; set; }
        public string DatabaseName { get; set; }
        public string TableName { get; set; }
    }
}