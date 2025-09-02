using System.ComponentModel.DataAnnotations;
// this class is basically used for abstraction
public class LoginRequest
{
    [Required, StringLength(50)]
    public string? username { get; set; }

    [Required]
    public string? password { get; set; }
}
