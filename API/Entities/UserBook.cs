using System;

namespace API.Entities
{
    public class UserBook
    {
        public int Id { get; set; }
        public AppUser User { get; set; }
        public int UserId { get; set; }
        public Book Book { get; set; }
        public int BookId { get; set; }
		public DateTime DateRented { get; set; } = DateTime.UtcNow;
		public DateTime? DateReturned { get; set; }
    }
}