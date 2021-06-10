using System;

namespace API.DTOs
{
	public class UnapprovedUserDto
	{
		public int Id { get; set; }
		public string KnownAs { get; set; }
		public DateTime DateOfBirth { get; set; }
        public bool Active { get; set; }
        public DateTime Created { get; set; }
	}
}