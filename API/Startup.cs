using API.Extensions;
using API.Middleware;
using API.SignalR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API
{
	public class Startup
    {
        private readonly IConfiguration _config;
		public Startup(IConfiguration config)
		{
			_config = config;
		}
        public void ConfigureServices(IServiceCollection services)
		{			
			services.AddApplicationServices(_config);
			services.AddIdentityServices(_config);
			services.AddControllers();
			services.AddCors();	
		}

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{

			app.UseMiddleware<ExceptionMiddleware>();

			// app.UseHttpsRedirection();

			app.UseRouting();
			app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:4200"));

			app.UseAuthentication();
			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
				endpoints.MapHub<BooksHub>("hubs/books");
			});
		}
    }
}
