using System.Collections.Generic;

namespace API.DTOs
{
    public class BookDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public int Year { get; set; }
        public string Image { get; set; }
        public int Stock { get; set; }
        public bool Available { get; set; }
        public ICollection<RentDto> Rents { get; set; }
    }
}