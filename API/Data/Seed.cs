using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedBooksAndManager(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, DataContext context)
        {
            if (await roleManager.Roles.AnyAsync()) return;

			var role = new AppRole { Name = "Manager" };

			await roleManager.CreateAsync(role);

			var user = new AppUser { UserName = "sindico", Email = "emaildosindico@bairro.com.br", Created = DateTime.UtcNow, KnownAs = "O Sindico", DateOfBirth = new DateTime(1972, 7, 27), Active = true };
            
            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Manager");

			var books = new List<Book>
			{
                new Book{ Author = "Aldous Huxley", Year = 1940, Title = "Admirável Mundo Novo", Stock = 1, Image = "../../../assets/images/admiravel mundo novo.jpg" },
                new Book{ Author = "George Orwell", Year = 1945, Title = "Revolução dos Bichos", Stock = 1, Image = "../../../assets/images/revolução dos bichos.jpg" },
                new Book{ Author = "Aldous Huxley", Year = 1954, Title = "The Doors of Perception", Stock = 1, Image = "../../../assets/images/the doors of perception.jpg" }
			};

            foreach (var book in books) context.Books.Add(book);

			if (!(await context.SaveChangesAsync() > 0)) throw new Exception("Ocorreu um erro ao inserir os livros iniciais.");
		}
    }
}
