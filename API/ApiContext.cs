using System.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace API
{
    public class ApiContext: DbContext
    {
        public DbSet<PipelineModel> Pipeline { get; set; }
        public DbSet<FilterModel> FilterComponent { get; set; }
        public DbSet<AggregationModel> AggregateComponent { get; set; }
        public DbSet<JoinModel> JoinComponent { get; set; }
        public DbSet<ConnectionModel> Connection { get; set; }
        public DbSet<DatasetModel> Dataset { get; set; }

        private static IConfiguration _configuration;

        public ApiContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_configuration[_configuration["method"]]);
        }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DatasetModel>()
                .HasIndex(d => d.Name)
                .IsUnique();
            modelBuilder.Entity<PipelineModel>()
                .HasIndex(p => p.Name)
                .IsUnique();
        }
    }
}