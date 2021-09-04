using System.ComponentModel.DataAnnotations;
using API.Filter;

namespace API.Models
{
    public class FilterModel
    {
        [Key]
        public int Id {get; set; }
        public string Query { get; set; }
    }
}