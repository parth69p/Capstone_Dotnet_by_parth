//Created this for user registration
using System.ComponentModel.DataAnnotations;

public class UserDto
{
    public int id { get; set; }
    public string? username { get; set; }
    public string? role { get; set; }

    public string? profileImagePath { get; set; }
}