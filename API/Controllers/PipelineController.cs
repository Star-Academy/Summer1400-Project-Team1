using System;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class PipelineController : ControllerBase
    {
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

        void AddAggregate(int pipelineId, int orderId, string body)
        {
        }
        
        void AddFilter(int pipelineId, int orderId, string body)
        {
        }
        
        void AddJoin(int pipelineId, int orderId, string body)
        {
        }

        [HttpPost]
        [Route("{id}/component")]
        public void PostComponent(int id,string type, int index)
        {
            switch (type)
            {
                case "join":
                {
                    AddJoin(id,index,Response.Body.ToString());
                    break;
                }
                case "aggregate":
                {
                    AddAggregate(id,index,Response.Body.ToString());
                    break;
                }
                case "filter":
                {
                    AddFilter(id,index,Response.Body.ToString());
                    break;
                }
            }
        }

        [HttpGet]
        [Route("{pid}/component/{cid}")]
        public IActionResult GetComponent(int pid, int cid)
        {
            return Ok();
        }
        
        
        
        
    }
}