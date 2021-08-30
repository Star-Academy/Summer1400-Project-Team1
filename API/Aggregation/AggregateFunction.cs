namespace API.Aggregation
{
    public class AggregateFunction
    {
        public AggregationType Type { get; set; }
        public string ColumnName { get; set; }
        public string OutputColumnName { get; set; }
        public AggregateFunction(AggregationType type, string columnName, string outputColumnName)
        {
            Type = type;
            ColumnName = columnName;
            OutputColumnName = outputColumnName;
        }

        public override string ToString()
        {
            return Type + "(" + ColumnName + ")" + " AS " + OutputColumnName + " ";
        }
    }

    public enum AggregationType
    {
        Count,
        Sum,
        Avg,
        Min,
        Max
    }
}