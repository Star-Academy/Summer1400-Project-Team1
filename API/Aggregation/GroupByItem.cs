namespace API.Aggregation
{
    public class GroupByItem
    {
        public GroupByItem(string columnName)
        {
            ColumnName = columnName;
        }

        public string ColumnName { get; set; }
    }
}