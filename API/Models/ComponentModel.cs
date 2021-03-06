using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace API.Models
{
    [Owned]
    public class ComponentModel
    {
        public int OrderId { get; set; }
        public string Name { get; set; }
        public ComponentType Type { get; set; }
        public int RelatedComponentId { get; set; }
    }
}