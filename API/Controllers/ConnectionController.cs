using System;
using API.Models;
using API.SqlIOHandler;
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

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetConnectionInfo(int id)
        {
            var connectionInfo = _databaseHandler.GetConnection(id);
            return Ok(JsonConvert.SerializeObject(connectionInfo));
        }

        [HttpGet]
        [Route("{id:int}/database")]
        public IActionResult GetDatabases(int id)
        {
            var databases = _databaseHandler.GetDatabases(id);
            return Ok(JsonConvert.SerializeObject(databases));
        }

        [HttpGet]
        [Route("{id:int}/database/{name}")]
        public IActionResult GetTables(int id, string name)
        {
            var tables = _databaseHandler.GetTables(id, name);
            return Ok(JsonConvert.SerializeObject(tables));
        }

        [HttpPost]
        public IActionResult AddConnection(ConnectionModel connectionModel)
        {
            var id = _databaseHandler.AddConnection(connectionModel.Name, connectionModel.Server,
                connectionModel.Username, connectionModel.Password);
            return Ok(id);
        }
    }
}