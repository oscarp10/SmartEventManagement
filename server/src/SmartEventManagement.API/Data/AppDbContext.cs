using Microsoft.EntityFrameworkCore;
using SmartEventManagement.API.Models;

namespace SmartEventManagement.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Registration> Registrations => Set<Registration>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Feedback> Feedback => Set<Feedback>();
    public DbSet<EventSuggestion> EventSuggestions => Set<EventSuggestion>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasPostgresEnum<UserRole>();
        modelBuilder.HasPostgresEnum<RegistrationStatus>();

        modelBuilder.Entity<Profile>(entity =>
        {
            entity.ToTable("profiles", "public");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.FullName).HasColumnName("full_name").HasMaxLength(200).IsRequired();
            entity.Property(x => x.Email).HasColumnName("email").HasMaxLength(320).IsRequired();
            entity.Property(x => x.PasswordHash).HasColumnName("password_hash").HasColumnType("text").IsRequired();
            entity.Property(x => x.Role).HasColumnName("role").HasConversion<string>().IsRequired();
            entity.Property(x => x.Interests).HasColumnName("interests").HasColumnType("text[]");
            entity.HasIndex(x => x.Email).IsUnique();
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.ToTable("events", "public");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.Title).HasColumnName("title").HasMaxLength(250).IsRequired();
            entity.Property(x => x.Description).HasColumnName("description").HasColumnType("text").IsRequired();
            entity.Property(x => x.DateTime).HasColumnName("date_time").IsRequired();
            entity.Property(x => x.Location).HasColumnName("location").HasMaxLength(250).IsRequired();
            entity.Property(x => x.PriceLabel).HasColumnName("price_label").HasMaxLength(120).IsRequired();
            entity.Property(x => x.ImageUrl).HasColumnName("image_url").HasColumnType("text").IsRequired();
            entity.Property(x => x.Rating).HasColumnName("rating").HasPrecision(3, 2).HasDefaultValue(0m);
            entity.Property(x => x.ReviewCount).HasColumnName("review_count").HasDefaultValue(0);
            entity.Property(x => x.AttendeeCount).HasColumnName("attendee_count").HasDefaultValue(0);
            entity.Property(x => x.Category).HasColumnName("category").HasMaxLength(120).IsRequired();
            entity.Property(x => x.Capacity).HasColumnName("capacity").IsRequired();
            entity.Property(x => x.IsApproved).HasColumnName("is_approved").HasDefaultValue(false);
            entity.Property(x => x.RejectionReason).HasColumnName("rejection_reason").HasColumnType("text");
            entity.Property(x => x.AdminComment).HasColumnName("admin_comment").HasColumnType("text");
            entity.Property(x => x.RegistrationsOpen).HasColumnName("registrations_open").HasDefaultValue(true);
            entity.Property(x => x.OrganizerId).HasColumnName("organizer_id").IsRequired();
            entity.Property(x => x.Tags).HasColumnName("tags").HasColumnType("text[]");

            entity.HasOne(x => x.Organizer)
                .WithMany(x => x.OrganizedEvents)
                .HasForeignKey(x => x.OrganizerId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Registration>(entity =>
        {
            entity.ToTable("registrations", "public");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.EventId).HasColumnName("event_id").IsRequired();
            entity.Property(x => x.AttendeeId).HasColumnName("attendee_id").IsRequired();
            entity.Property(x => x.Status).HasColumnName("status").HasConversion<string>().IsRequired();
            entity.HasIndex(x => new { x.EventId, x.AttendeeId }).IsUnique();

            entity.HasOne(x => x.Event)
                .WithMany(x => x.Registrations)
                .HasForeignKey(x => x.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.Attendee)
                .WithMany(x => x.Registrations)
                .HasForeignKey(x => x.AttendeeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.ToTable("notifications", "public");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.UserId).HasColumnName("user_id").IsRequired();
            entity.Property(x => x.Message).HasColumnName("message").HasColumnType("text").IsRequired();
            entity.Property(x => x.IsRead).HasColumnName("is_read").HasDefaultValue(false);
            entity.Property(x => x.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("now()");

            entity.HasOne(x => x.User)
                .WithMany(x => x.Notifications)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.ToTable("feedback", "public");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.EventId).HasColumnName("event_id").IsRequired();
            entity.Property(x => x.AttendeeId).HasColumnName("attendee_id").IsRequired();
            entity.Property(x => x.Rating).HasColumnName("rating").IsRequired();
            entity.Property(x => x.Comment).HasColumnName("comment").HasColumnType("text").IsRequired();
            entity.Property(x => x.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("now()");
            entity.HasIndex(x => new { x.EventId, x.AttendeeId }).IsUnique();

            entity.HasOne(x => x.Event)
                .WithMany(x => x.Feedback)
                .HasForeignKey(x => x.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.Attendee)
                .WithMany()
                .HasForeignKey(x => x.AttendeeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<EventSuggestion>(entity =>
        {
            entity.ToTable("event_suggestions", "public");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.AttendeeId).HasColumnName("attendee_id").IsRequired();
            entity.Property(x => x.Title).HasColumnName("title").HasMaxLength(250).IsRequired();
            entity.Property(x => x.Description).HasColumnName("description").HasColumnType("text").IsRequired();
            entity.Property(x => x.Rationale).HasColumnName("rationale").HasColumnType("text");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("now()");

            entity.HasOne(x => x.Attendee)
                .WithMany(x => x.EventSuggestions)
                .HasForeignKey(x => x.AttendeeId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
