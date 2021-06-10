using System;

namespace API.DTOs
{
    public class RentDto
    {
        public int Id { get; set; }
        public int RentedById { get; set; }
        public string RentedBy { get; set; }
		public DateTime DateRented { get; set; }
    }
}