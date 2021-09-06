using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ConnectionController : ControllerBase
    {
        private readonly IDatabaseHandler _databaseHandler;

        public ConnectionController(IDatabaseHandler databaseHandler)
        {
            _databaseHandler = databaseHandler;
        }

        [HttpGet]
        public IActionResult GetConnections()
        {
            var connections = _databaseHandler.GetConnections();
            return Ok(JsonConvert.SerializeObject(connections));
        }

        [HttpPost]
        public IActionResult AddConnection(string name, string server, string username, string password)
        {
            var id = _databaseHandler.AddConnection(name, server, username, password);
            return Ok(id);
        }
    }
}