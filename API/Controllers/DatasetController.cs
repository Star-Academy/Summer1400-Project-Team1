using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class DatasetController : ControllerBase
    {
        private readonly IDatabaseHandler _databaseHandler;

        public DatasetController(IDatabaseHandler databaseHandler)
        {
            _databaseHandler = databaseHandler;
        }

        [HttpGet]
        public IActionResult GetDatasets()
        {
            var datasets = _databaseHandler.GetDatasets().ToList();
            return Ok(datasets);
        }

        [HttpPost("sql")]
        public IActionResult AddSqlDataset(SqlDataset sqlDataset)
        {
            _databaseHandler.AddSqlDataset(sqlDataset.Name,sqlDataset.ConnectionId,
                sqlDataset.DatabaseName,sqlDataset.TableName);
            return Ok();
        }
        
    }

    public class SqlDataset
    {
        public readonly string Name;
        public readonly int ConnectionId;
        public readonly string DatabaseName;
        public readonly string TableName;
    }
}