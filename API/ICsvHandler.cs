namespace API
{
    public interface ICsvHandler
    {
        void LoadCsv(string pathToCsv,string delimiter, bool isHeaderIncluded);
        void CsvToSql(string tableName);
        void SqlToCsv(string tableName,string pathToCsv,string delimiter,bool header);
    }
}