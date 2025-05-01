using Microsoft.EntityFrameworkCore;
using PatoDraw.Infrastructure.Entities;

namespace PatoDraw.Infrastructure;

public class PatoDrawDbContext: DbContext
{
    public PatoDrawDbContext(DbContextOptions<PatoDrawDbContext> options): base(options) { }

    public DbSet<Folder> Folders { get; set; }
    public DbSet<Entities.File> Files { get; set; }
    public DbSet<Asset> Assets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Asset>(a => {
            a.ToTable("Asset");

            a.HasKey(a => a.Id);

            a.Property(a => a.ContentType)
            .IsRequired();
            a.Property(a => a.Name)
            .IsRequired();
            a.Property(a => a.SizeInBytes)
            .IsRequired();
            a.Property(a => a.CreatedAt)
            .IsRequired();

            a.HasOne(a => a.ParentFile)
            .WithMany(a => a.Assets)
            .HasForeignKey(a => a.ParentFileId);
        });

        modelBuilder.Entity<Entities.File>(x => {
            x.ToTable("File");
        });

        modelBuilder.Entity<Folder>(x => {
            x.ToTable("Folder");
        });

        modelBuilder.Entity<Folder>()
            .HasKey(f => f.Id);

        modelBuilder.Entity<Folder>()
            .HasOne(f => f.ParentFolder)
            .WithMany(f => f.Folders)
            .HasForeignKey(f => f.ParentFolderId);

        modelBuilder.Entity<Entities.File>()
            .HasKey(f => f.Id);

        modelBuilder.Entity<Entities.File>()
            .Property(f => f.OwnerId)
            .IsRequired();

        modelBuilder.Entity<Entities.File>()
            .Property(f => f.Name)
            .IsRequired();

        modelBuilder.Entity<Entities.File>()
            .Property(f => f.Color)
            .IsRequired(false);

        modelBuilder.Entity<Entities.File>()
            .Property(f => f.Type)
            .IsRequired();

        modelBuilder.Entity<Entities.File>()
            .Property(f => f.CreatedAt)
            .IsRequired();

        modelBuilder.Entity<Entities.File>()
            .Property(f => f.ModifiedAt)
            .IsRequired();

        modelBuilder.Entity<Entities.File>()
            .Property(f => f.DeletedAt)
            .IsRequired(false);

        modelBuilder.Entity<Entities.File>()
            .HasOne(f => f.ParentFolder)
            .WithMany(f => f.Files)
            .HasForeignKey(f => f.ParentFolderId);

        modelBuilder.Entity<Folder>()
            .HasKey(f => f.Id);

        modelBuilder.Entity<Folder>()
            .Property(f => f.Name)
            .IsRequired();

        modelBuilder.Entity<Folder>()
            .Property(f => f.Color)
            .IsRequired(false);

        modelBuilder.Entity<Folder>()
            .Property(f => f.CreatedAt)
            .IsRequired();

        modelBuilder.Entity<Folder>()
            .Property(f => f.ModifiedAt)
            .IsRequired();

        modelBuilder.Entity<Folder>()
            .Property(f => f.OwnerId)
            .IsRequired();

        modelBuilder.Entity<Folder>()
            .Property(f => f.Depth)
            .IsRequired();

        modelBuilder.Entity<Folder>()
            .Property(f => f.DeletedAt)
            .IsRequired(false);
    }
}
