using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class DonateBookDto
    {
        [Required]
        public string Title { get; set; }
        
        [Required]
        public string Author { get; set; }
        
        [Required]
        public int? Year { get; set; }
		public string Image { get; set; } = "../../../assets/images/blank book.jpg";

	}
}