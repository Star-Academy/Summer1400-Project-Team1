using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace API.SqlIOHandler
{
    [Index(nameof(Name),IsUnique = true)]
    public class SqlDataset
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public int ConnectionId { get; set; }
        [Required]
        public string DatabaseName { get; set; }
        [Required]
        public string TableName { get; set; }
    }
}