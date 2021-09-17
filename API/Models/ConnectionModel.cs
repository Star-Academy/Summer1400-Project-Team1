using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;


namespace API.Models
{
    [Index(nameof(Name),IsUnique = true)]
    public class ConnectionModel
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Server { get; set; }
        [Required]
        public string Username { get; set; }
        [DataType(DataType.Password)]
        [Required]
        public string Password { get; set; }
        public DateTime DateCreated { get; set; }
        public string ConnectionString { get; private set; }

        public void BuildConnectionString()
        {
            ConnectionString = $"Server={Server};User Id={Username}; Password={Password};";
        }
    }
}