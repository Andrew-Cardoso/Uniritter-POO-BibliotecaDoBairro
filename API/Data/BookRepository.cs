using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
	public class BookRepository : IBookRepository
	{
		private readonly DataContext _context;
		private readonly IMapper _mapper;
		public BookRepository(DataContext context, IMapper mapper)
		{
			_mapper = mapper;
			_context = context;
		}
		public void Add(Book book)
		{
			_context.Books.Add(book);
		}

		public void RentBook(int bookId, int userId)
		{
			var rent = new UserBook
			{
				BookId = bookId,
				UserId = userId
			};
			_context.UsersBooks.Add(rent);
		}

		public async Task<ICollection<BookDto>> GetBooksAsync(int userId)
		{
			var books = await _context.Books
				.ProjectTo<BookDto>(_mapper.ConfigurationProvider)
				.Where(x => x.Rents.Any(y => y.RentedById == userId))
				.ToListAsync();
			return books;
		}

		public async Task<PagedList<BookDto>> GetBooksAsync(BookParams bookParams, int userId)
		{
			var query = _context.Books.ProjectTo<BookDto>(_mapper.ConfigurationProvider).AsQueryable();

			if (bookParams.RentedByMe) query = query.Where(x => x.Rents.Any(y => y.RentedById == userId));

			if (bookParams.Id.HasValue) {
				query = query.Where(x => x.Id == bookParams.Id);
			} else if (!string.IsNullOrWhiteSpace(bookParams.SearchString)) {
				var str = bookParams.SearchString;
				query = query.Where(x => x.Author.ToLower().Contains(str.ToLower()) || x.Title.ToLower().Contains(str.ToLower()));
			}

			return await PagedList<BookDto>.CreateAsync(query.AsNoTracking(), bookParams.PageNumber, bookParams.PageSize);
		}

		public async Task<BookDto> GetBookAsync(int id)
		{
			return await _context.Books.ProjectTo<BookDto>(_mapper.ConfigurationProvider).SingleOrDefaultAsync(x => x.Id == id);
		}

		public async Task<UserBook> GetRentAsync(int id)
		{
			return await _context.UsersBooks.FindAsync(id);
		}

		public async Task<Book> GetSimpleBookAsync(DonateBookDto bookDto)
		{
			return await _context.Books.SingleOrDefaultAsync(x =>
				x.Author.ToLower() == bookDto.Author.ToLower()
				&& x.Title.ToLower() == bookDto.Title.ToLower()
				&& x.Year == bookDto.Year
			);
		}

		public async Task<Book> GetSimpleBookAsync(int id)
		{
			return await _context.Books
				.Include(x => x.RentedBy
					.Where(y => y.DateReturned == null))
				.SingleOrDefaultAsync(x => x.Id == id);
		}

		public void Remove(Book book)
		{
			_context.Books.Remove(book);
		}
	}
}