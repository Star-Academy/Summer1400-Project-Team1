using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class JoinModel
    {
        [Key]
        public int Id { get; set; }
        public string SecondTableName { get; set; }
        public string FirstTablePk { get; set; }
        public string SecondTablePk { get; set; }
        public int JoinType { get; set; }
    }
}