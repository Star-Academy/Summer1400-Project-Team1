using System;
using System.IO;
using System.Text.Json;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class PipelineController : ControllerBase
    {
        private readonly IDatabaseHandler _databaseHandler;
        private readonly ISqlHandler _sqlHandler;

        public PipelineController(ISqlHandler sqlHandler, IDatabaseHandler databaseHandler)
        {
            _sqlHandler = sqlHandler;
            _databaseHandler = databaseHandler;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok();
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult GetPipeline(int id)
        {
            Console.WriteLine("get pipeline" + id);
            return Ok();
        }

        [HttpPost]
        public void Post()
        {
        }

        [HttpPatch]
        [Route("{id}")]
        public void Patch(int id)
        {
            Console.WriteLine("id is :" + id);
        }

        void AddAggregate(int pipelineId, int orderId, string name, string body)
        {
            AggregationModel aggregation = JsonConvert.DeserializeObject<AggregationModel>(body);
            if (aggregation == null)
                return;
            _databaseHandler.AddAggregateComponent(pipelineId, name, aggregation, orderId);
        }

        void AddFilter(int pipelineId, int orderId, string name, string body)
        {
            _databaseHandler.AddFilterComponent(pipelineId, body, name, orderId);
        }

        void AddJoin(int pipelineId, int orderId, string name, string body)
        {
            JoinModel join = JsonSerializer.Deserialize<JoinModel>(body);
            if (join == null)
                return;
            _databaseHandler.AddJoinComponent(pipelineId, name, join, orderId);
        }

        [HttpPost]
        [Route("{id}/component")]
        public void PostComponent(int id, string type, int index, string name,[FromBody] JsonElement body)
        {
            switch (type)
            {
                case "join":
                {
                    AddJoin(id, index, name, body.ToString());
                    break;
                }
                case "aggregate":
                {
                    AddAggregate(id, index, name, body.ToString());
                    break;
                }
                case "filter":
                {
                    AddFilter(id, index, name, body.ToString());
                    break;
                }
            }
        }

        [HttpPatch("{pid}/component/{cid}")]
        public IActionResult PatchComponent(int pid, int cid,[FromQuery] string name,[FromBody] JsonElement body)
        {
            Tuple<ComponentType, int> componentInfo;
            try
            {
                componentInfo = _databaseHandler.GetComponent(pid, cid);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            
            if(name != null) _databaseHandler.UpdataComponent(pid,cid,name);
            
            switch (componentInfo.Item1)
            {
                case ComponentType.Filter:
                    return PatchFilter(componentInfo.Item2,body.ToString());
                case ComponentType.Join:
                    return PatchJoin(componentInfo.Item2, body.ToString());
                case ComponentType.Aggregation:
                    return PatchAggregation(componentInfo.Item2, body.ToString());
                default:
                    throw new ArgumentOutOfRangeException();
            }

        }

        private IActionResult PatchFilter(int id, string json)
        {
            var replace = JsonSerializer.Deserialize<FilterModel>(json);
            if (replace != null)
            {
                try
                {
                    _databaseHandler.UpdateFilterComponent(id, replace);
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
                
            }
            else
            {
                return BadRequest();
            }

            return Ok();
        }

        private IActionResult PatchAggregation(int id, string json)
        {
            var replace = JsonConvert.DeserializeObject<AggregationModel>(json);
            if (replace != null)
            {
                try
                {
                    _databaseHandler.UpdateAggregateComponent(id, replace);
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }
            else
            {
                return BadRequest();
            }

            return Ok();
        }

        private IActionResult PatchJoin(int id, string json)
        {
            JoinModel model = JsonSerializer.Deserialize<JoinModel>(json);
            if (model == null)
            {
                return BadRequest();
            }
            try
            {
                _databaseHandler.UpdateJoinComponent(id, model);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            return Ok();
        }

        [HttpGet]
        [Route("{pid}/component/{cid}")]
        public IActionResult GetComponent(int pid, int cid)
        {
            Tuple<ComponentType, int> componentInfo;
            try
            {
                componentInfo = _databaseHandler.GetComponent(pid, cid);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            switch (componentInfo.Item1)
            {
                case ComponentType.Filter:
                    return GetFilter(componentInfo.Item2);
                case ComponentType.Join:
                    return GetJoin(componentInfo.Item2);
                case ComponentType.Aggregation:
                    return GetAggregation(componentInfo.Item2);
                default:
                    throw new ArgumentOutOfRangeException();
            }

            return Ok();
        }

        private IActionResult GetFilter(int id)
        {
            var filter = _databaseHandler.GetFilterComponent(id);
            if (filter == null)
                return NotFound();
            return Ok(new
            {
                Type = ComponentType.Filter,
                Component = filter
            });
        }

        private IActionResult GetAggregation(int id)
        {
            var aggregation = _databaseHandler.GetAggregateComponent(id);
            if (aggregation == null)
                return NotFound();
            return Ok(new
            {
                Type = ComponentType.Aggregation,
                Component = aggregation
            });
        }
        
        private IActionResult GetJoin(int id)
        {
            var join = _databaseHandler.GetJoinComponent(id);
            if (join == null)
                return NotFound();
            return Ok(new
            {
                Type = ComponentType.Join,
                Component = join
            });
        }

        [HttpDelete("{pid}/component/{cid}")]
        public IActionResult DeleteComponent(int pid, int cid)
        {
            Tuple<ComponentType, int> componentInfo;
            try
            {
                componentInfo = _databaseHandler.GetComponent(pid, cid);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            switch (componentInfo.Item1)
            {
                case ComponentType.Filter:
                    _databaseHandler.DeleteFilterComponent(componentInfo.Item2);
                    break;
                case ComponentType.Join:
                    _databaseHandler.DeleteJoinComponent(componentInfo.Item2);
                    break;
                case ComponentType.Aggregation:
                    _databaseHandler.DeleteAggregateComponent(componentInfo.Item2);
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            _databaseHandler.DeleteComponent(pid, cid);

            return Ok();
        }

        [HttpPost]
        [Route("{id}/run")]
        public IActionResult Run(int id)
        {
            var pipeline = new Pipeline(_sqlHandler, _databaseHandler);
            pipeline.LoadFromModel(_databaseHandler.GetPipeline(id));
            try
            {
                pipeline.Run();
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }

            return Ok();
        }
        
        [HttpPost]
        [Route("{pid}/run/{id}")]
        public IActionResult RunByIndex(int pid,int id)
        {
            var pipeline = new Pipeline(_sqlHandler, _databaseHandler);
            pipeline.LoadFromModel(_databaseHandler.GetPipeline(pid));
            try
            {
                pipeline.RunByIndex(id);
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }

            return Ok();
        }
    }
}