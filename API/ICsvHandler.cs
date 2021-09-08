namespace API
{
    public interface ICsvHandler
    {
        void LoadCsv(string pathToCsv,bool isHeaderIncluded);
        void CsvToSql(string tableName);
        void SqlToCsv(string tableName,string pathToCsv);
    }
}