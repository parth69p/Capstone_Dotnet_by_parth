using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly FractoDbContext _context;
    private readonly IJwtService _jwtService;
    private readonly IFileService _fileService;

      public UserController(FractoDbContext context, IJwtService jwtService, IFileService fileService)
    {
        _context = context;
        _jwtService = jwtService;
        _fileService = fileService;
    }

    // ======================================================= USER SIDE =====================================================

    [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterRequest request, IFormFile? profileImage)
        {
            if (await _context.Users.AnyAsync(u => u.username == request.username))
                return BadRequest("Username already exists.");

            var user = new User
            {
                username = request.username,
                // Role is set from the request. Defaults to "User" in the DTO.
                // An admin could potentially pass "Admin" here if needed.
                
                role = "User"
            };

            // Hash password
            var passwordHasher = new PasswordHasher<User>();
            user.password = passwordHasher.HashPassword(user, request.password);

            // Handle profile image
            if (profileImage != null)
            {
                user.profileImagePath = await _fileService.SaveImageAsync(profileImage, "users");
            }
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }
    // POST: api/User/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.username == loginRequest.username);
        if (user == null)
            return Unauthorized("Invalid username or password.");

        var passwordHasher = new PasswordHasher<User>();
        if (!string.IsNullOrWhiteSpace(user.password) && !string.IsNullOrEmpty(loginRequest.password))
        {
            var result = passwordHasher.VerifyHashedPassword(user, user.password, loginRequest.password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid username or password.");

            var token = _jwtService.GenerateToken(user);
            return Ok(new { Token = token, Role = user.role ,User = user.userId ,Username = user.username});
        }
        return BadRequest("Write username and password");
    }

    // POST: api/User/logout
    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
        return Ok(new { message = "Logout successful. Please remove the token from client storage." });
    }




    //========================================== ADMIN SIDE ================================================

    
}

