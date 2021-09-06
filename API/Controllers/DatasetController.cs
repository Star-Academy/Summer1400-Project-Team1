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

        [HttpPost]
        [Route("sql")]
        public IActionResult AddSqlDataset(string name, int connectionId, 
            string databaseName, string tableName)
        {
            _databaseHandler.AddSqlDataset(name,connectionId,databaseName,tableName);
            return Ok();
        }
    }
}