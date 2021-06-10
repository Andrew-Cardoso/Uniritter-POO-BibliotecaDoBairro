using System;
using System.ComponentModel.DataAnnotations;
using API.Validations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Por favor, digite seu email.")]
        [EmailAddress(ErrorMessage = "Por favor, digite um email válido.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Por favor, digite uma senha.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Por favor, digite seu nome.")]
        public string KnownAs { get; set; }

        [ValidDateOfBirth]
        public DateTime? DateOfBirth { get; set; }
    }
}