using System;
using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

namespace API.Models
{
    public class ConnectionModel
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Server { get; set; }
        public string Username { get; set; }
        [DataType(DataType.Password)]
        public string Password { get; set; }
        public DateTime DateCreated { get; set; }
        public string ConnectionString { get; set; }

        public void BuildConnectionString()
        {
            ConnectionString = $"Server={Server};User Id={Username}; Password={Password};";
        }
    }
}