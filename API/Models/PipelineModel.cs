using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace API.Models
{
    public class PipelineModel
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public DatasetModel Source { get; set; }
        public DatasetModel Destination { get; set; }
        public List<ComponentModel> Components { get; set; }
        public DateTime DateCreated { get; set; }

    }
}