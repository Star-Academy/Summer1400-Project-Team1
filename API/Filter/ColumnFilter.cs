using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace API.Filter
{
    public class ColumnFilter:IPipelineComponent
    {
        private SqlHandler _sqlHandler;
        public StringBuilder StringBuilder = new StringBuilder();
        private Node _root;
        private string _temporaryTableName = "##"+System.Guid.NewGuid();
        
        public ColumnFilter(SqlHandler sqlHandler,Node root)
        {
            _sqlHandler = sqlHandler;
            _root = root;
        }
        
        //for test
        public DataTable GetConditionResult(string tableName)
        {
            if (!_sqlHandler.IsOpen())
            {
                _sqlHandler.Open();
            }

            string query = CreateSelectQuery(_root,tableName);
            DataTable dataTable = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(query, _sqlHandler.Connection);
            
            adapter.Fill(dataTable);
            _sqlHandler.Close();
            return dataTable;
        }
        
        private void Traverse(Node node){
            if (node.IsLeaf())
            {
                StringBuilder.Append("(" + node.GetKey() + node.GetOperator() + node.GetValue() + ")");
            }
            else
            {
                StringBuilder.Append("(");
                for (int i = 0; i < node.GetChildes().Count; i++)
                {
                    Traverse(node.GetChildes()[i]);
                    if (i<node.GetChildes().Count-1)
                    {
                        StringBuilder.Append(node.GetConditionType());
                    }
                }
                StringBuilder.Append(")");
            }
        }

        private string CreateSelectIntoTemporaryTableQuery(Node root, string sourceDataset)
        {
            if (StringBuilder.Equals(""))
            {
                Traverse(root);
            }
            return "select * into "+_temporaryTableName+" from "+sourceDataset+" where "+ StringBuilder;
        }
        
        //for test
        private string CreateSelectQuery(Node root, string tableName)
        {
            if (StringBuilder.Equals(""))
            {
                Traverse(root);
            }
            return "select * from "+tableName+" where "+ StringBuilder;
        }

        public string Execute(string sourceDataset)
        {
            if (!_sqlHandler.IsOpen())
            {
                _sqlHandler.Open();
            }

            string query = CreateSelectIntoTemporaryTableQuery(_root,sourceDataset);
            
            SqlCommand command = new SqlCommand(query, _sqlHandler.Connection);
            command.Connection.Open();
            command.ExecuteNonQuery();
            _sqlHandler.Close();
            
            return _temporaryTableName;
        }
    }
}