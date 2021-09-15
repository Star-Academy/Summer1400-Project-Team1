using System;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace API.Filter
{
    public class ColumnFilter : IPipelineComponent
    {
        private ISqlHandler _sqlHandler;
        public StringBuilder StringBuilder = new StringBuilder();
        private Node _root;
        private string _temporaryTableName;

        public ColumnFilter(ISqlHandler sqlHandler, Node root)
        {
            _sqlHandler = sqlHandler;
            _root = root;
            _temporaryTableName = RandomNameGenerator();
        }

        private string RandomNameGenerator()
        {
            return "##TableFilter" + Guid.NewGuid().ToString().Replace("-", "");
        }

        //for test
        public DataTable GetConditionResult(string tableName)
        {
            if (!_sqlHandler.IsOpen())
            {
                _sqlHandler.Open();
            }

            var query = CreateSelectQuery(_root, tableName);
            var dataTable = new DataTable();
            var adapter = new SqlDataAdapter(query, _sqlHandler.Connection);

            adapter.Fill(dataTable);
            _sqlHandler.Close();
            return dataTable;
        }

        private void Traverse(Node node)
        {
            if (node.IsLeaf())
            {
                StringBuilder.Append("(" + node.GetKey() + node.GetOperator() + node.GetValue() + ")");
            }
            else
            {
                StringBuilder.Append('(');
                for (var i = 0; i < node.GetChildes().Count; i++)
                {
                    Traverse(node.GetChildes()[i]);
                    if (i < node.GetChildes().Count - 1)
                    {
                        StringBuilder.Append(node.GetConditionType());
                    }
                }

                StringBuilder.Append(')');
            }
        }

        private string CreateSelectIntoTemporaryTableQuery(Node root, string sourceDataset)
        {
            if (StringBuilder.Equals(""))
            {
                Traverse(root);
            }

            return "SELECT * INTO " + _temporaryTableName + " FROM " + sourceDataset + " WHERE " + StringBuilder;
        }

        //for test
        private string CreateSelectQuery(Node root, string tableName)
        {
            if (StringBuilder.Equals(""))
            {
                Traverse(root);
            }

            return "SELECT * FROM " + tableName + " WHERE " + StringBuilder;
        }

        public int OrderId { get; set; }

        public string Execute(string sourceDataset)
        {
            if (!_sqlHandler.IsOpen())
            {
                _sqlHandler.Open();
            }

            var query = CreateSelectIntoTemporaryTableQuery(_root, sourceDataset);
            var command = new SqlCommand(query, _sqlHandler.Connection);
            command.ExecuteNonQuery();
            return _temporaryTableName;
        }

        public string ExecuteTemplate(string sourceDataset)
        {
            if (!_sqlHandler.IsOpen())
            {
                _sqlHandler.Open();
            }

            var query = "SELECT * INTO " + _temporaryTableName + " FROM " + sourceDataset + " WHERE 0";
            var command = new SqlCommand(query, _sqlHandler.Connection);
            command.ExecuteNonQuery();
            return _temporaryTableName;
        }
    }
}