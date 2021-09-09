using System;
using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class DatasetModel
    {
        [Key]
        public int Id { get; set;}
        public string Name { get; set; }
        public string Table { get; set; }
        public ConnectionModel Connection { get; set; }
        public DateTime DateCreated { get; set; }
    }
}