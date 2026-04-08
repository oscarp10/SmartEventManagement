using SmartEventManagement.API.Models;
using SmartEventManagement.API.Services;

namespace SmartEventManagement.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext dbContext, IPasswordHasher passwordHasher, CancellationToken cancellationToken = default)
    {
        if (dbContext.Profiles.Any()) return;

        var adminId = Guid.Parse("6a7bb5a8-cf98-4d4f-9a38-12b7f0b87a11");
        var organizerId = Guid.Parse("41bc60e7-61a2-4f59-8de2-85fe091f74f3");
        var attendeeId = Guid.Parse("f16fc2db-5abd-460f-8a5b-aaf7241f9320");

        var profiles = new[]
        {
            new Profile
            {
                Id = adminId,
                FullName = "Avery Thompson",
                Email = "admin@koi.edu.au",
                PasswordHash = passwordHasher.HashPassword("AdminPass123!"),
                Role = UserRole.Admin,
                Interests = ["governance", "quality", "leadership"]
            },
            new Profile
            {
                Id = organizerId,
                FullName = "Jordan Rivera",
                Email = "organizer@koi.edu.au",
                PasswordHash = passwordHasher.HashPassword("OrganizerPass123!"),
                Role = UserRole.Organizer,
                Interests = ["events", "analytics", "community"]
            },
            new Profile
            {
                Id = attendeeId,
                FullName = "Mia Patel",
                Email = "attendee@koi.edu.au",
                PasswordHash = passwordHasher.HashPassword("AttendeePass123!"),
                Role = UserRole.Attendee,
                Interests = ["ai", "networking", "design", "career"]
            }
        };

        dbContext.Profiles.AddRange(profiles);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
