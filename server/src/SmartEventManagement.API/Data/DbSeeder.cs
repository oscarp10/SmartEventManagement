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

        var techInnovationId = Guid.Parse("5b686f92-50cf-4f60-aed7-b057ec0ef631");
        var leadershipWorkshopId = Guid.Parse("79917f1a-9f3a-41ad-a559-f4ef7ed50e91");
        var networkingNightId = Guid.Parse("ea12f113-5afd-4650-8f2f-2dbf8f752457");
        var musicFestivalId = Guid.Parse("af773afb-c7b2-4355-93d7-f705a8f6f152");
        var artExhibitionId = Guid.Parse("22889f9d-8f5f-4a93-9028-8866b431a91b");
        var foodMarketId = Guid.Parse("1c2ecfd7-a0e2-4434-a3a6-fd437fac49d4");
        var pendingReviewId = Guid.Parse("a1000001-0000-4000-8000-000000000001");
        var rejectedListingId = Guid.Parse("a2000001-0000-4000-8000-000000000002");

        var events = new[]
        {
            new Event
            {
                Id = techInnovationId,
                Title = "Tech Innovation Summit 2026",
                Description = "Modern stage talks and demos on next-gen technology, AI, and startup innovation.",
                DateTime = new DateTimeOffset(2026, 4, 15, 9, 0, 0, TimeSpan.Zero),
                Location = "Melbourne Convention Centre",
                PriceLabel = "Free",
                ImageUrl = "https://images.unsplash.com/photo-1761223976372-f2324a8e2812?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29uZmVyZW5jZSUyMG1vZGVybiUyMHN0YWdlfGVufDF8fHx8MTc3NTIyMzA2OXww&ixlib=rb-4.1.0&q=80&w=1080",
                Rating = 4.9m,
                ReviewCount = 342,
                AttendeeCount = 1200,
                Category = "Technology",
                Capacity = 1500,
                IsApproved = true,
                OrganizerId = organizerId,
                Tags = ["ai", "career", "technology"]
            },
            new Event
            {
                Id = leadershipWorkshopId,
                Title = "Leadership Workshop",
                Description = "Business strategy, communication, and team collaboration workshop for emerging leaders.",
                DateTime = new DateTimeOffset(2026, 4, 8, 10, 0, 0, TimeSpan.Zero),
                Location = "Sydney Business Hub",
                PriceLabel = "$49",
                ImageUrl = "https://images.unsplash.com/photo-1768796370577-c6e8b708b980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvcmtzaG9wJTIwdGVhbSUyMGNvbGxhYm9yYXRpb258ZW58MXx8fHwxNzc1MjcyMTk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
                Rating = 4.8m,
                ReviewCount = 156,
                AttendeeCount = 85,
                Category = "Business",
                Capacity = 220,
                IsApproved = true,
                OrganizerId = organizerId,
                Tags = ["business", "leadership", "workshop"]
            },
            new Event
            {
                Id = networkingNightId,
                Title = "Industry Networking Night",
                Description = "Evening networking event connecting students with professionals across industries.",
                DateTime = new DateTimeOffset(2026, 4, 20, 18, 0, 0, TimeSpan.Zero),
                Location = "Brisbane City Centre",
                PriceLabel = "Free",
                ImageUrl = "https://images.unsplash.com/photo-1531058020387-3be344556be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JraW5nJTIwZXZlbnQlMjBwZW9wbGUlMjBtZWV0aW5nfGVufDF8fHx8MTc3NTI1OTgyMXww&ixlib=rb-4.1.0&q=80&w=1080",
                Rating = 4.7m,
                ReviewCount = 234,
                AttendeeCount = 450,
                Category = "Networking",
                Capacity = 700,
                IsApproved = true,
                OrganizerId = organizerId,
                Tags = ["networking", "industry", "community"]
            },
            new Event
            {
                Id = musicFestivalId,
                Title = "Summer Music Festival",
                Description = "Beachfront music festival featuring live acts, food stalls, and sunset performances.",
                DateTime = new DateTimeOffset(2026, 4, 25, 14, 0, 0, TimeSpan.Zero),
                Location = "Gold Coast Beachfront",
                PriceLabel = "$79",
                ImageUrl = "https://images.unsplash.com/photo-1672841821756-fc04525771c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBjcm93ZCUyMGZlc3RpdmFsfGVufDF8fHx8MTc3NTIwMjgyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
                Rating = 5.0m,
                ReviewCount = 892,
                AttendeeCount = 3500,
                Category = "Music",
                Capacity = 5000,
                IsApproved = true,
                OrganizerId = organizerId,
                Tags = ["music", "festival", "outdoor"]
            },
            new Event
            {
                Id = artExhibitionId,
                Title = "Contemporary Art Exhibition",
                Description = "Opening exhibition showcasing contemporary Australian artists and immersive installations.",
                DateTime = new DateTimeOffset(2026, 4, 12, 11, 0, 0, TimeSpan.Zero),
                Location = "National Gallery, Canberra",
                PriceLabel = "$25",
                ImageUrl = "https://images.unsplash.com/photo-1742497359760-2094fe95347a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwZXhoaWJpdGlvbiUyMG9wZW5pbmd8ZW58MXx8fHwxNzc1MjI0MjQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
                Rating = 4.6m,
                ReviewCount = 127,
                AttendeeCount = 320,
                Category = "Art",
                Capacity = 600,
                IsApproved = true,
                OrganizerId = organizerId,
                Tags = ["art", "exhibition", "gallery"]
            },
            new Event
            {
                Id = foodMarketId,
                Title = "Gourmet Food Market",
                Description = "Open-air gourmet market featuring chef stations, local produce, and tasting experiences.",
                DateTime = new DateTimeOffset(2026, 4, 18, 12, 0, 0, TimeSpan.Zero),
                Location = "Perth Waterfront",
                PriceLabel = "Free Entry",
                ImageUrl = "https://images.unsplash.com/photo-1773720261664-4f031d4ed1a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwZm9vZCUyMGZlc3RpdmFsJTIwbWFya2V0fGVufDF8fHx8MTc3NTI3MjE5OHww&ixlib=rb-4.1.0&q=80&w=1080",
                Rating = 4.9m,
                ReviewCount = 567,
                AttendeeCount = 2100,
                Category = "Food & Drink",
                Capacity = 3000,
                IsApproved = true,
                OrganizerId = organizerId,
                Tags = ["food", "market", "drink"]
            },
            new Event
            {
                Id = pendingReviewId,
                Title = "Campus Theatre Showcase (Pending Review)",
                Description = "Student-led performances and short plays in the main theatre.",
                DateTime = new DateTimeOffset(2026, 5, 5, 19, 0, 0, TimeSpan.Zero),
                Location = "KOI Theatre",
                PriceLabel = "$12",
                ImageUrl = "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80",
                Rating = 4.2m,
                ReviewCount = 0,
                AttendeeCount = 0,
                Category = "Arts",
                Capacity = 180,
                IsApproved = false,
                AdminComment = "Please confirm final cast list and accessibility seating count.",
                RegistrationsOpen = true,
                OrganizerId = organizerId,
                Tags = ["theatre", "student", "campus"]
            },
            new Event
            {
                Id = rejectedListingId,
                Title = "AI Lab Open Day (Rejected)",
                Description = "Hands-on AI tooling session — needs clearer safety and capacity details.",
                DateTime = new DateTimeOffset(2026, 5, 12, 13, 0, 0, TimeSpan.Zero),
                Location = "Innovation Lab",
                PriceLabel = "Free",
                ImageUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
                Rating = 4.0m,
                ReviewCount = 0,
                AttendeeCount = 0,
                Category = "Technology",
                Capacity = 40,
                IsApproved = false,
                RejectionReason = "Needs a clearer agenda, safety notes, and confirmed lab capacity before approval.",
                RegistrationsOpen = true,
                OrganizerId = organizerId,
                Tags = ["ai", "lab", "workshop"]
            }
        };

        var registrations = new[]
        {
            new Registration
            {
                Id = Guid.Parse("4586346f-a0b8-4204-81de-07a9de087f13"),
                EventId = techInnovationId,
                AttendeeId = attendeeId,
                Status = RegistrationStatus.Registered
            },
            new Registration
            {
                Id = Guid.Parse("f9926cc0-4e1a-4ff5-bb82-24dd3ebf09ee"),
                EventId = leadershipWorkshopId,
                AttendeeId = attendeeId,
                Status = RegistrationStatus.Attended
            }
        };

        var notifications = new[]
        {
            new Notification
            {
                Id = Guid.Parse("c8e4af8b-8776-45d5-acf5-c6172f70bcae"),
                UserId = attendeeId,
                Message = "Your registration for Tech Innovation Summit 2026 is confirmed.",
                IsRead = false,
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-1)
            },
            new Notification
            {
                Id = Guid.Parse("9af1f6f8-cf5f-454c-99b2-19ef1149442e"),
                UserId = organizerId,
                Message = "Summer Music Festival has reached 70% capacity.",
                IsRead = false,
                CreatedAt = DateTimeOffset.UtcNow.AddHours(-6)
            },
            new Notification
            {
                Id = Guid.Parse("d1000001-0000-4000-8000-000000000001"),
                UserId = adminId,
                Message = "Review queue: pending listings may need approval before they go live.",
                IsRead = false,
                CreatedAt = DateTimeOffset.UtcNow.AddHours(-2)
            }
        };

        var feedback = new[]
        {
            new Feedback
            {
                Id = Guid.Parse("b1000001-0000-4000-8000-000000000001"),
                EventId = networkingNightId,
                AttendeeId = attendeeId,
                Rating = 5,
                Comment = "Great atmosphere and useful mentor introductions.",
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-4)
            },
            new Feedback
            {
                Id = Guid.Parse("b1000002-0000-4000-8000-000000000002"),
                EventId = techInnovationId,
                AttendeeId = attendeeId,
                Rating = 4,
                Comment = "Strong keynotes — would love more Q&A time next year.",
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-2)
            }
        };

        var eventSuggestions = new[]
        {
            new EventSuggestion
            {
                Id = Guid.Parse("c1000001-0000-4000-8000-000000000001"),
                AttendeeId = attendeeId,
                Title = "Inter-faculty chess night",
                Description = "Casual blitz tournament in the student lounge with snacks.",
                Rationale = "Several students asked for low-cost social events.",
                CreatedAt = DateTimeOffset.UtcNow.AddDays(-3)
            }
        };

        dbContext.Profiles.AddRange(profiles);
        dbContext.Events.AddRange(events);
        dbContext.Registrations.AddRange(registrations);
        dbContext.Notifications.AddRange(notifications);
        dbContext.Feedback.AddRange(feedback);
        dbContext.EventSuggestions.AddRange(eventSuggestions);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
