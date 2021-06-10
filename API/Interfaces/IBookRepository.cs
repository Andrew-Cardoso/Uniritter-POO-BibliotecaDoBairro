using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
	public interface IBookRepository
	{
		void Add(Book book);
		void RentBook(int bookId, int userId);
		Task<UserBook> GetRentAsync(int id);
		Task<BookDto> GetBookAsync(int id);
		Task<Book> GetSimpleBookAsync(DonateBookDto bookDto);
		Task<Book> GetSimpleBookAsync(int id);
		Task<ICollection<BookDto>> GetBooksAsync(int userId);
		Task<PagedList<BookDto>> GetBooksAsync(BookParams bookParams, int userId);
		void Remove(Book book);
	}
}