using System;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using API.SqlIOHandler;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Newtonsoft.Json;

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

        [HttpPost]
        public IActionResult Post([FromBody] string name)
        {
            if (name == null)
                return BadRequest("invalid input");
            return Ok(_databaseHandler.AddDataset(name));
        }
        
        [HttpPost, DisableRequestSizeLimit]
        [Route("csv")]
        public IActionResult UploadCsv(string name,bool header)
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "CSVs");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length <= 0) return BadRequest();
                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                var fullPath = Path.Combine(pathToSave, fileName);
                var dbPath = Path.Combine(folderName, fileName);

                using (var stream = new FileStream(fullPath,FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                try
                {
                    _databaseHandler.AddCsvDataset(fullPath,name,header);
                }
                catch (Exception e)
                {
                    return BadRequest(e);
                }
                return Ok(new {dbPath});

            }
            catch (Exception e)
            {
                return StatusCode(500, $"internal server error {e}");
            }
        }
        
        [HttpGet,DisableRequestSizeLimit]
        [Route("csv/{id}")]
        public async Task<IActionResult> DownloadCsv(int id)
        {
            var filePath = _databaseHandler.GetCsvDataset(id);
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
        
        
        [HttpGet]
        public IActionResult GetDatasets()
        {
            var datasets = _databaseHandler.GetDatasets();
            return Ok(JsonConvert.SerializeObject(datasets));
        }
        
        [HttpGet("{id:int}")]
        public IActionResult GetDataset(int id)
        {
            try
            {
                var numberOfRows = _databaseHandler.GetDatasetStatistics(id);
                return Ok(JsonConvert.SerializeObject(numberOfRows));
            }
            catch (Exception e)
            {
                return BadRequest("dataset not found");
            }
        }
        
        [HttpGet("{id:int}")]
        public IActionResult GetDataset(int id,string type,int count)
        {
            switch (type)
            {
                case "pipeline": 
                    var pipelines = _databaseHandler.GetDatasetPipelines(id, count);
                    return Ok(JsonConvert.SerializeObject(pipelines));
                case "sample":
                    try
                    {
                        var samples = _databaseHandler.GetDatasetSamples(id,count);
                        return Ok(samples);
                    }
                    catch (Exception e)
                    {
                        return BadRequest("invalid id");
                    }
                default: 
                    return BadRequest("invalid inputs");
            }
        }

        [HttpPost("sql")]
        public IActionResult AddSqlDataset(SqlDataset sqlDataset)
        {
            try
            {
                _databaseHandler.AddSqlDataset(sqlDataset.Name,sqlDataset.ConnectionId,
                    sqlDataset.DatabaseName,sqlDataset.TableName);
                return Ok("sql dataset added");
            }
            catch (Exception e)
            {
                return BadRequest("duplicate dataset name");
            }
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteDataset(int id)
        {
            try
            {
                _databaseHandler.DeleteDataset(id);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest("dataset not found");
            }
            
        }
        
    }
    
}