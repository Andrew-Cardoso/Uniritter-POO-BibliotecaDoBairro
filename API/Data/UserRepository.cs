using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
	public class UserRepository : IUserRepository
	{
		private readonly IMapper _mapper;
		private readonly DataContext _context;
		public UserRepository(DataContext context, IMapper mapper)
		{
			_context = context;
			_mapper = mapper;
		}

		public async Task<ICollection<UnapprovedUserDto>> GetUnapprovedUsersAsync()
		{
			return await _context.Users
                .ProjectTo<UnapprovedUserDto>(_mapper.ConfigurationProvider)
                .Where(x => !x.Active).ToListAsync();
		}
	}
}