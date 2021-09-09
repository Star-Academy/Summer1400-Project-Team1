using System.ComponentModel.DataAnnotations;
using API.Join;

namespace API.Models
{
    public class JoinModel
    {
        [Key] 
        public int Id { get; set; }
        public string SecondTableName { get; set; }
        public string FirstTablePk { get; set; }
        public string SecondTablePk { get; set; }
        public JoinType JoinType { get; set; }
    }
}