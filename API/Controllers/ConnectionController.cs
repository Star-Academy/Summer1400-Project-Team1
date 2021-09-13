using System;
using System.Text.Json;
using API.Models;
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
            if (connectionInfo == null)
                return BadRequest("connection not found");
            return Ok(JsonConvert.SerializeObject(connectionInfo));
        }

        [HttpGet]
        [Route("{id:int}/database")]
        public IActionResult GetDatabases(int id)
        {
            var databases = _databaseHandler.GetDatabases(id);
            if (databases == null)
                return BadRequest("connection not found");
            return Ok(JsonConvert.SerializeObject(databases));
        }

        [HttpGet]
        [Route("{id:int}/database/{name}")]
        public IActionResult GetTables(int id, string name)
        {
            var tables = _databaseHandler.GetTables(id, name);
            if (tables == null)
                return BadRequest("database not found");
            return Ok(JsonConvert.SerializeObject(tables));
        }

        [HttpPost]
        public IActionResult AddConnection(ConnectionModel connectionModel)
        {
            try
            {
                var id = _databaseHandler.AddConnection(connectionModel.Name, connectionModel.Server,
                    connectionModel.Username, connectionModel.Password);
                return Ok(id);
            }
            catch (Exception e)
            {
                return BadRequest("duplicate connection name");
            }
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteConnection(int id)
        {
            try
            {
                _databaseHandler.DeleteConnection(id);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest("connection not found");
            }
        }

        [HttpPatch("{id:int}")]
        public IActionResult PatchConnection([FromRoute] int id, [FromBody] JsonElement body)
        {
            string name = null, server = null, username = null, password = null;
            try
            {
                if (body.TryGetProperty("name", out var patchName)) name = patchName.GetString();
                if (body.TryGetProperty("server", out var patchServer)) server = patchServer.GetString();
                if (body.TryGetProperty("username", out var patchUsername)) username = patchUsername.GetString();
                if (body.TryGetProperty("password", out var patchPassword)) password = patchPassword.GetString();
                
                _databaseHandler.UpdateConnection(id, name, server, username, password);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest("connection not found");
            }
        }
    }
}