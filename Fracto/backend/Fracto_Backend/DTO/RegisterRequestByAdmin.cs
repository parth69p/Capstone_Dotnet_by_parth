// here  admin can set role while registering a user
using System.ComponentModel.DataAnnotations;
public class RegisterRequestByAdmin
{
    [Required(ErrorMessage = "Username is required.")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters.")]
    public string username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
    public string password { get; set; } = string.Empty;

    [StringLength(20, ErrorMessage = "Role cannot exceed 20 characters.")]
    public string role { get; set; } = "Admin"; // Default role is "Admin"

}