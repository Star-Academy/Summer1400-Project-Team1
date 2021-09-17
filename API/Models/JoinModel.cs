using System.ComponentModel.DataAnnotations;
using API.Join;
using YamlDotNet.Serialization;

namespace API.Models
{
    public class JoinModel
    {
        [Key]
        [YamlIgnore]
        public int Id { get; set; }
        public string SecondTableName { get; set; }
        public string FirstTablePk { get; set; }
        public string SecondTablePk { get; set; }
        public JoinType JoinType { get; set; }
    }
}