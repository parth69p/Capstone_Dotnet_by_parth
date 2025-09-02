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

    public UserController(FractoDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    // ================= USER SIDE =================

    // POST: api/User/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromForm] User user, IFormFile? profileImage)
    {
        if (await _context.Users.AnyAsync(u => u.username == user.username))
            return BadRequest("Username already exists.");

        user.role = "User"; // default role (alwaays user)

        // Handle profile image
        if (profileImage != null && profileImage.Length > 0)
        {
            var uploadDir = Path.Combine("wwwroot", "uploads", "users");
            if (!Directory.Exists(uploadDir))
            {
                Directory.CreateDirectory(uploadDir);
            }

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(profileImage.FileName)}";
            var filePath = Path.Combine(uploadDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await profileImage.CopyToAsync(stream);
            }

            user.profileImagePath = $"uploads/users/{fileName}";
        }

        // Hash password
        var passwordHasher = new PasswordHasher<User>();
        if (!string.IsNullOrWhiteSpace(user.password))
        {
            user.password = passwordHasher.HashPassword(user, user.password);
        }
        else
        {
            return BadRequest("Password cannot be null or empty.");
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
            return Ok(new { Token = token, Role = user.role });
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

    // ================= ADMIN SIDE =================

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsers()
    {
        // getiing all data from the server but not passing everything
        var usersFromDb = await _context.Users.ToListAsync();

        // basically not passing the password and all so its work on abstraction.
        var UserDto = usersFromDb.Select(user => new UserDto
          {
              id = user.userId,
              username = user.username,
              role = user.role,
             profileImage= user.profileImagePath
        });
        return Ok(UserDto);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUser(int id)
    {
        var userFromDb = await _context.Users.FindAsync(id);

        if (userFromDb != null)
        {
            var UserDto = new UserDto
            {
                id = userFromDb.userId,
                username = userFromDb.username,
                role = userFromDb.role,
                profileImage = userFromDb.profileImagePath
            };

            return Ok(UserDto);
        }
        else
        {
            return NotFound();
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] User userUpdate)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.username = userUpdate.username;

        if (!string.IsNullOrEmpty(userUpdate.password))
        {
            var passwordHasher = new PasswordHasher<User>();
            user.password = passwordHasher.HashPassword(user, userUpdate.password);
        }

        user.role = userUpdate.role;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return Ok("User updated successfully.");
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok("User deleted successfully.");
    }

    [Authorize(Roles = "Admin")]
    // If Admin Create user
    [HttpPost("register-admin")]
    public async Task<IActionResult> RegisterAdmin([FromForm] User user, IFormFile? profileImage)
    {
        if (await _context.Users.AnyAsync(u => u.username == user.username))
            return BadRequest("Username already exists.");

        user.role = "Admin"; // default role (alwaays user)

        // Handle profile image
        if (profileImage != null && profileImage.Length > 0)
        {
            var uploadDir = Path.Combine("wwwroot", "uploads", "users");
            if (!Directory.Exists(uploadDir))
            {
                Directory.CreateDirectory(uploadDir);
            }

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(profileImage.FileName)}";
            var filePath = Path.Combine(uploadDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await profileImage.CopyToAsync(stream);
            }

            user.profileImagePath = $"uploads/users/{fileName}";
        }

        // Hash password
            var passwordHasher = new PasswordHasher<User>();
            if (!string.IsNullOrWhiteSpace(user.password))
            {
                user.password = passwordHasher.HashPassword(user, user.password);
            }
            else
            {
                return BadRequest("Password cannot be null or empty.");
            }

           await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }

    
}

