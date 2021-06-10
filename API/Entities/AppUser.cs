using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public string KnownAs { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public bool Active { get; set; }
        public ICollection<AppUserRole> UserRoles { get; set; }
        public ICollection<UserBook> RentedBooks { get; set; }
    }
}
