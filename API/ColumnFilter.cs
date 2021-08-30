using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace API
{
    public class ColumnFilter:IColumnFilter
    {
        private SqlHandler _sqlHandler;
        private StringBuilder _stringBuilder = new StringBuilder();
        
        public ColumnFilter(SqlHandler sqlHandler)
        {
            _sqlHandler = sqlHandler;
        }
        
        public DataTable GetConditionResult(Node root, string tableName)
        {
            if (!_sqlHandler.IsOpen())
            {
                _sqlHandler.Open();
            }

            string query = CreateQuery(root,tableName);
            DataTable dataTable = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(query, _sqlHandler.Connection);
            
            adapter.Fill(dataTable);
            _sqlHandler.Close();
            return dataTable;
        }
        
        private void Traverse(Node node){
            if (node.IsLeaf())
            {
                _stringBuilder.Append("(" + node.GetKey() + node.GetOperator() + node.GetValue() + ")");
            }
            else
            {
                _stringBuilder.Append("(");
                for (int i = 0; i < node.GetChildes().Count; i++)
                {
                    Traverse(node.GetChildes()[i]);
                    if (i<node.GetChildes().Count-1)
                    {
                        _stringBuilder.Append(node.GetConditionType());
                    }
                }
                _stringBuilder.Append(")");
            }
        }

        private string CreateQuery(Node root, string tableName)
        {
            _stringBuilder.Clear();
            Traverse(root);
            return "select * from "+tableName+" where "+ _stringBuilder;
        }
    }
}