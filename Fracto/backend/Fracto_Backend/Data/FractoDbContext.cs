using Microsoft.EntityFrameworkCore;
// using Fracto.Backend.Models;


    public class FractoDbContext : DbContext
    {
        public FractoDbContext(DbContextOptions<FractoDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Specialization> Specializations { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Rating> Ratings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.username)
                .IsUnique();

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.user)
                .WithMany(u => u.appointments)
                .HasForeignKey(a => a.userId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.doctor)
                .WithMany(d => d.appointments)
                .HasForeignKey(a => a.doctorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Rating>()
                .HasOne(r => r.user)
                .WithMany(u => u.ratings)
                .HasForeignKey(r => r.userId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Rating>()
                .HasOne(r => r.doctor)
                .WithMany(d => d.ratings)
                .HasForeignKey(r => r.doctorId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
