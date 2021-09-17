using System;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using CsvHelper;
using CsvHelper.Configuration;

namespace API
{
    public class CsvHandler : ICsvHandler
    {
        private DataTable _dataTable;
        private bool _isHeaderIncluded;
        private bool[] _columnsDetected;
        private readonly ISqlHandler _sqlHandler;
        private string _tableName;

        public CsvHandler(ISqlHandler sqlHandler)
        {
            _sqlHandler = sqlHandler;
        }
        
        public void LoadCsv(string pathToCsv,string delimiter,bool isHeaderIncluded)
        {
            var file = File.OpenText(pathToCsv);
            var config = new CsvHelper.Configuration.CsvConfiguration(CultureInfo.CurrentCulture)
            {
                MissingFieldFound              = null,Delimiter = delimiter
            };
            using var csvReader = new CsvReader(file, config);
            using var dataReader = new CsvDataReader(csvReader);
            _dataTable = new DataTable();
            _dataTable.Load(dataReader);
            _isHeaderIncluded = isHeaderIncluded;
            _columnsDetected = new bool[_dataTable.Columns.Count];
        }

        private void CreateTable()
        {
            if(!_sqlHandler.IsOpen())_sqlHandler.Open();
            var command = new SqlCommand($"CREATE TABLE {_tableName} (temp int);",_sqlHandler.Connection);
            command.ExecuteNonQuery();
            _sqlHandler.Close();
        }

        private void AddColumnText(int index)
        {
            if(!_sqlHandler.IsOpen())_sqlHandler.Open();
            var command =
                new SqlCommand($"ALTER TABLE {_tableName} ADD {_dataTable.Columns[index].ColumnName}" + " VARCHAR(MAX);",
                    _sqlHandler.Connection);
            command.ExecuteNonQuery();
            _sqlHandler.Close();
        }

        private void AddColumnDate(int index)
        {
            if(!_sqlHandler.IsOpen())_sqlHandler.Open();
            var command =
                new SqlCommand(
                    $"ALTER TABLE {_tableName} ADD {_dataTable.Columns[index].ColumnName}" + " datetime;",
                    _sqlHandler.Connection);
            command.ExecuteNonQuery();
            _sqlHandler.Close();
        }

        private void AddColumnFloat(int index)
        {
            if(!_sqlHandler.IsOpen())_sqlHandler.Open();
            var command =
                new SqlCommand($"ALTER TABLE {_tableName} ADD {_dataTable.Columns[index].ColumnName}" + " float;",
                    _sqlHandler.Connection);
            command.ExecuteNonQuery();
            _sqlHandler.Close();
        }

        private void AddColumnInt(int index)
        {
            if(!_sqlHandler.IsOpen())_sqlHandler.Open();
            var command =
                new SqlCommand($"ALTER TABLE {_tableName} ADD {_dataTable.Columns[index].ColumnName}" + " int;",
                    _sqlHandler.Connection);
            command.ExecuteNonQuery();
            _sqlHandler.Close();
        }
        
        private void AddColumn(DataRow row, int index)
        {
            if (int.TryParse(row[index].ToString(),out var t))
            {
                AddColumnInt(index);
                return;
            }
            if (float.TryParse(row[index].ToString(),out var t2))
            {
                AddColumnFloat(index);
                return;
            }
            if (DateTime.TryParse(row[index].ToString(),out var t3))
            {
                AddColumnDate(index);
                return;
            }
            AddColumnText(index);
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
            var command = new SqlCommand($"ALTER TABLE {_tableName} DROP COLUMN temp", _sqlHandler.Connection);
            command.ExecuteNonQuery();
            _sqlHandler.Close();
        }

        public void CsvToSql(string tableName)
        {
            _tableName = tableName;
            CreateTable();
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

        public void SqlToCsv(string tableName, string pathToCsv, string delimiter,bool header)
        {
            if (!_sqlHandler.IsOpen()) _sqlHandler.Open();
            var adaptor = new SqlDataAdapter($"SELECT * FROM {tableName}", _sqlHandler.Connection);
            _dataTable = new DataTable();
            adaptor.Fill(_dataTable);
            var config = new CsvConfiguration(CultureInfo.CurrentCulture)
            {
                Delimiter = delimiter,HasHeaderRecord = header
            };
            using var writer = new StreamWriter(pathToCsv);
            using var csvWriter = new CsvWriter(writer, config);
            if (header)
            {
                foreach (DataColumn dc in _dataTable.Columns)
                {
                    csvWriter.WriteField(dc.ColumnName);
                }
                csvWriter.NextRecord();
            }

            foreach (DataRow dr in _dataTable.Rows)
            {
                foreach (DataColumn dc in _dataTable.Columns)
                {
                    csvWriter.WriteField(dr[dc]);
                }
                csvWriter.NextRecord();
            }
        }
    }
}