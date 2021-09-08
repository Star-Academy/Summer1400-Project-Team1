using System;
using System.Text.Json;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class PipelineController : ControllerBase
    {
        private readonly IDatabaseHandler _databaseHandler;
        private readonly ISqlHandler _sqlHandler;
        public PipelineController(ISqlHandler sqlHandler,IDatabaseHandler databaseHandler)
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
            Console.WriteLine("get pipeline"+id);
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
            Console.WriteLine("id is :"+id);
        }

        [HttpPost("{pid}/aggregate")]
        public IActionResult AddAggregate([FromRoute] int pid, [FromQuery] int index,
            [FromBody] AggregationModel aggregationModel)
        {
            try
            {
                _databaseHandler.AddAggregateComponent(pid, aggregationModel, index);
                return Ok(aggregationModel);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        
        void AddAggregate(int pipelineId, int orderId,string name, string body)
        {
            AggregationModel aggregation = JsonSerializer.Deserialize<AggregationModel>(body);
            if(aggregation==null)
                return;
            aggregation.Name = name;
            AddAggregate(pipelineId, orderId, aggregation);
        }
        
        void AddFilter(int pipelineId, int orderId,string name, string body)
        {
            _databaseHandler.AddFilterComponent(pipelineId,body,name,orderId);
        }
        
        void AddJoin(int pipelineId, int orderId,string name, string body)
        {
        }

        [HttpPost]
        [Route("{id}/component")]
        public void PostComponent(int id,string type, int index,string name)
        {
            switch (type)
            {
                case "join":
                {
                    AddJoin(id,index,name,Response.Body.ToString());
                    break;
                }
                case "aggregate":
                {
                    AddAggregate(id,index,name,Response.Body.ToString());
                    break;
                }
                case "filter":
                {
                    AddFilter(id,index,name,Response.Body.ToString());
                    break;
                }
            }
        }

        [HttpPatch("{pid}/component/{cid}")]
        public IActionResult PatchComponent(int pid, int cid)
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
                    break;
                case ComponentType.Join:
                    break;
                case ComponentType.Aggregation:
                    return PatchAggregation(componentInfo.Item2,Request.Body.ToString());
                default:
                    throw new ArgumentOutOfRangeException();
            }

            return Ok();
        }

        private IActionResult PatchAggregation(int id, string json)
        {
            var replace = JsonSerializer.Deserialize<AggregationModel>(json);
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
                    break;
                case ComponentType.Join:
                    break;
                case ComponentType.Aggregation:
                    return GetAggregation(componentInfo.Item2);
                default:
                    throw new ArgumentOutOfRangeException();
            }

            return Ok();
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
                    break;
                case ComponentType.Join:
                    break;
                case ComponentType.Aggregation:
                    DeleteAggregation(componentInfo.Item2);
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            _databaseHandler.DeleteComponent(pid, cid);

            return Ok();
        }

        private IActionResult DeleteAggregation(int id)
        {
            try
            {
                _databaseHandler.DeleteAggregateComponent(id);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
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
                return StatusCode(500,e);
            }
            return Ok();
        }
        
        
    }
}