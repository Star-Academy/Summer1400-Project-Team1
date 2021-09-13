using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using YamlDotNet.Serialization;
using ContentDispositionHeaderValue = System.Net.Http.Headers.ContentDispositionHeaderValue;
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
            return Ok(JsonSerializer.Serialize(_databaseHandler.GetPipelines()));
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult GetPipeline(int id)
        {
            return Ok(JsonSerializer.Serialize(_databaseHandler.GetPipeline(id)));
        }

        [HttpPost]
        public IActionResult Post([FromBody] JsonElement body)
        {
            var sid = -1;
            var did = -1;
            if (body.TryGetProperty("SourceId", out var source)) sid = source.GetInt32();
            if (body.TryGetProperty("DestinationId", out var destination)) did = destination.GetInt32();
            try
            {
                return Ok(_databaseHandler.AddPipeline(body.GetProperty("Name").GetString(), sid, did));
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [HttpPatch]
        [Route("{id}")]
        public IActionResult Patch(int id, [FromBody] JsonElement body)
        {
            var sid = -1;
            var did = -1;
            if (body.TryGetProperty("SourceId", out var source)) sid = source.GetInt32();
            if (body.TryGetProperty("DestinationId", out var destination)) did = destination.GetInt32();
            try
            {
                _databaseHandler.UpdatePipeline(id, body.GetProperty("Name").GetString(), sid, did);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _databaseHandler.DeletePipeline(id);
                return Delete(id);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
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
        public void PostComponent(int id, string type, int index, string name, [FromBody] JsonElement body)
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
        public IActionResult PatchComponent(int pid, int cid, [FromQuery] string name, [FromBody] JsonElement body)
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

            if (name != null) _databaseHandler.UpdateComponent(pid, cid, name);
            if (body.ToString() == "{}") return Ok();

            switch (componentInfo.Item1)
            {
                case ComponentType.Filter:
                    return PatchFilter(componentInfo.Item2, body.ToString());
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
                if (!json.ToLower().Contains("jointype"))
                {
                    model.JoinType = _databaseHandler.GetJoinComponent(id).JoinType;
                }

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

        [HttpGet]
        [Route("{pid}/run/{id}")]
        public IActionResult RunByIndex(int pid, int id)
        {
            var pipeline = new Pipeline(_sqlHandler, _databaseHandler);
            pipeline.LoadFromModel(_databaseHandler.GetPipeline(pid));
            try
            {
                return Ok(pipeline.RunByIndex(id));
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }

            return Ok();
        }

        private string GetContentType(string path)
        {
            var provider = new FileExtensionContentTypeProvider();
            string contentType;

            if (!provider.TryGetContentType(path, out contentType))
            {
                contentType = "application/octet-stream";
            }

            return contentType;
        }

        [HttpGet, DisableRequestSizeLimit]
        [Route("{id}/yml")]
        public async Task<IActionResult> DownloadYml(int id)
        {
            var filePath = _databaseHandler.GetPipelineYml(id);
            if (!System.IO.File.Exists(filePath))
                return NotFound();

            var memory = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }

            memory.Position = 0;

            return File(memory, GetContentType(filePath), Path.GetFileName(filePath));
        }

        [HttpPost, DisableRequestSizeLimit]
        [Route("yml")]
        public IActionResult UploadYml()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "YMLs");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length <= 0) return BadRequest();
                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                var fullPath = Path.Combine(pathToSave, fileName);
                var dbPath = Path.Combine(folderName, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                _databaseHandler.AddYmlPipeline(fullPath);
                return Ok(new {dbPath});
            }
            catch (Exception e)
            {
                return StatusCode(500, $"internal server error {e}");
            }
        }
    }
}