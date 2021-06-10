using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
	public static class ApplicationServiceExtensions
	{
		public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
		{
			services.AddDbContext<DataContext>(options =>
			{
				options.UseSqlite(config.GetConnectionString("DefaultConnection"));
			});
			services.AddScoped<ITokenService, TokenService>();
			services.AddScoped<IUnitOfWork, UnitOfWork>();
			services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
			services.AddSignalR();

			return services;
		}
	}
}