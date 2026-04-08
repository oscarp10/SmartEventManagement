using Microsoft.AspNetCore.Mvc;
using SmartEventManagement.API.DTOs;

namespace SmartEventManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly ILogger<ContactController> _logger;

    public ContactController(ILogger<ContactController> logger) => _logger = logger;

    [HttpPost]
    public ActionResult Post([FromBody] ContactRequest request)
    {
        var name = request.Name?.Trim() ?? "";
        var email = request.Email?.Trim() ?? "";
        var subject = request.Subject?.Trim() ?? "";
        var message = request.Message?.Trim() ?? "";

        if (name.Length < 2) return BadRequest("Please enter your name.");
        if (email.Length < 5 || !email.Contains('@', StringComparison.Ordinal)) return BadRequest("Please enter a valid email.");
        if (subject.Length < 2) return BadRequest("Please enter a subject.");
        if (message.Length < 10) return BadRequest("Please enter a message (at least 10 characters).");

        _logger.LogInformation(
            "Contact form: from {Name} <{Email}> subject {Subject}: {Preview}",
            name,
            email,
            subject,
            message.Length > 200 ? message[..200] + "…" : message);

        return Ok(new { received = true });
    }
}
