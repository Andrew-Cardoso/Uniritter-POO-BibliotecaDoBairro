using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Books")]
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public int Year { get; set; }
        public string Image { get; set; }
        public int Stock { get; set; }
        public ICollection<UserBook> RentedBy { get; set; }
    }
}