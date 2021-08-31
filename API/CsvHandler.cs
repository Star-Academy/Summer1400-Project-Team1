using System;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using CsvHelper;

namespace API
{
    public class CsvHandler : ICsvHandler
    {
        private DataTable _dataTable;
        private bool _isHeaderIncluded;
        private bool[] _columnsDetected;
        private readonly ISqlHandler _sqlHandler;

        public CsvHandler(ISqlHandler sqlHandler)
        {
            _sqlHandler = sqlHandler;
        }
        
        public void LoadCsv(string pathToCsv,bool isHeaderIncluded)
        {
            var file = File.OpenText(pathToCsv);
            var config = new CsvHelper.Configuration.CsvConfiguration(CultureInfo.CurrentCulture)
            {
                MissingFieldFound              = null
            };
            var csvReader = new CsvReader(file, config);
            var dataReader = new CsvDataReader(csvReader);
            _dataTable = new DataTable();
            _dataTable.Load(dataReader);
            _isHeaderIncluded = isHeaderIncluded;
            _columnsDetected = new bool[_dataTable.Columns.Count];
        }

        private void CreateTable(string tableName)
        {
            if(!_sqlHandler.IsOpen())_sqlHandler.Open();
            var command = new SqlCommand($"CREATE TABLE {tableName} (temp int);",_sqlHandler.Connection);
            command.ExecuteNonQuery();
            _sqlHandler.Close();
        }

        private void AddColumnText(int index)
        {
            if(!_sqlHandler.IsOpen())_sqlHandler.Open();
            var command =
                new SqlCommand($"ALTER TABLE myTable ADD {_dataTable.Columns[index].ColumnName}" + " text;",
                    _sqlHandler.Connection);
            command.ExecuteNonQuery();
            _sqlHandler.Close();
        }

        private void AddColumnDate(int index)
        {
            if(!_sqlHandler.IsOpen())_sqlHandler.Open();
            var command =
                new SqlCommand(
                    $"ALTER TABLE myTable ADD {_dataTable.Columns[index].ColumnName}" + " datetime;",
                    _sqlHandler.Connection);
            command.ExecuteNonQuery();
            _sqlHandler.Close();
        }

        private void AddColumnFloat(int index)
        {
            if(!_sqlHandler.IsOpen())_sqlHandler.Open();
            var command =
                new SqlCommand($"ALTER TABLE myTable ADD {_dataTable.Columns[index].ColumnName}" + " float;",
                    _sqlHandler.Connection);
            command.ExecuteNonQuery();
            _sqlHandler.Close();
        }

        private void AddColumnInt(int index)
        {
            if(!_sqlHandler.IsOpen())_sqlHandler.Open();
            var command =
                new SqlCommand($"ALTER TABLE myTable ADD {_dataTable.Columns[index].ColumnName}" + " int;",
                    _sqlHandler.Connection);
            command.ExecuteNonQuery();
            _sqlHandler.Close();
        }
        
        private void AddColumn(DataRow row, int index)
        {
            switch (row[index])
            {
                case int:
                    AddColumnInt(index);
                    return;
                case float:
                    AddColumnFloat(index);
                    return;
                case DateTime:
                    AddColumnDate(index);
                    return;
                default:
                    AddColumnText(index);
                    break;
            }
        }
        
        private void DetectRemainingColumns()
        {
            for (int index = 0 ; index < _columnsDetected.Length ; index++)
            {
                if (_columnsDetected[index]) continue;
                if(_isHeaderIncluded == false) _dataTable.Columns[index].ColumnName = "column" + index;
                
                AddColumnText(index);
            }  
        }
        
        
        private void DetectColumns()
        {
            var rows = _dataTable.Select();
            foreach (var row in rows)
            {
                for (int index = 0; index < _dataTable.Columns.Count; index++)
                {
                    if (row[index].ToString() == "")
                    {
                        _dataTable.Columns[index].ReadOnly = false;
                        _dataTable.Rows[_dataTable.Rows.IndexOf(row)][index] = null;
                        continue;
                    }
                    if (_columnsDetected[index]) continue;
                    _columnsDetected[index] = true;
                    if(_isHeaderIncluded == false) _dataTable.Columns[index].ColumnName = "column" + index;
                    if(!_sqlHandler.IsOpen())_sqlHandler.Open();

                    AddColumn(row, index);
                }
            }
            DetectRemainingColumns();
        }
        
        private void RemoveTempColumn()
        {
            if(!_sqlHandler.IsOpen())_sqlHandler.Open();
            var command = new SqlCommand("ALTER TABLE myTable DROP COLUMN temp", _sqlHandler.Connection);
            command.ExecuteNonQuery();
            _sqlHandler.Close();
        }

        public void CsvToSql(string tableName)
        {
            CreateTable(tableName);
            DetectColumns();
            RemoveTempColumn();
            
            if(!_sqlHandler.IsOpen())_sqlHandler.Open();
            using (SqlBulkCopy bulkCopy = new SqlBulkCopy(_sqlHandler.Connection))
            {
                foreach (DataColumn c in _dataTable.Columns)
                {
                    bulkCopy.ColumnMappings.Add(c.ColumnName, c.ColumnName);
                }

                bulkCopy.DestinationTableName = tableName;
                try
                {
                    bulkCopy.WriteToServer(_dataTable);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
            _sqlHandler.Close();
        }
    }
}