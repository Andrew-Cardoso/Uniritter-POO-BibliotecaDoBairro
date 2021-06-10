using System.Threading.Tasks;
using AutoMapper;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UnitOfWork : IUnitOfWork
	{
		private readonly DataContext _context;
		private readonly IMapper _mapper;
		public UnitOfWork(DataContext context, IMapper mapper)
		{
			_mapper = mapper;
			_context = context;
		}

		public IBookRepository BookRepository => new BookRepository(_context, _mapper);
		public IUserRepository UserRepository => new UserRepository(_context, _mapper);

		public async Task<bool> Complete()
		{
			return await _context.SaveChangesAsync() > 0;
		}

		public void Update<T>(T item)
		{
			_context.Entry(item).State = EntityState.Modified;
		}
	}
}