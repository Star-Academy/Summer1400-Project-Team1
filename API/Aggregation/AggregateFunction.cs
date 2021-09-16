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
            string result = "";
            if (Type == AggregationType.None)
            {
                result += ColumnName + " ";
                if (OutputColumnName != null)
                    result += "AS " + OutputColumnName + " ";
            }
            else
                result += $"{Type}({ColumnName}) AS {OutputColumnName} ";

            
            return result;
        }
    }

    public enum AggregationType
    {
        Count,
        Sum,
        Avg,
        Min,
        Max,
        None
    }
}