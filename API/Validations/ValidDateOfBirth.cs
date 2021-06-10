using System;
using System.ComponentModel.DataAnnotations;

namespace API.Validations
{
	public class ValidDateOfBirth : ValidationAttribute
	{
		public ValidDateOfBirth() { }
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value == null) return new ValidationResult("Por favor, digite sua data de nascimento.");

            var dateOfBirth = (DateTime)value;
			return dateOfBirth < DateTime.UtcNow && dateOfBirth > DateTime.UtcNow.AddYears(-120)
                ? ValidationResult.Success
                : new ValidationResult("Data de nascimento inválida.");
		}
	}
}