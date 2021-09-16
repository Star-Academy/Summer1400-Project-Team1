using System.ComponentModel.DataAnnotations;
using API.Filter;
using YamlDotNet.Serialization;

namespace API.Models
{
    public class FilterModel
    {
        [Key]
        [YamlIgnore]
        public int Id {get; set; }
        public string Query { get; set; }
    }
}