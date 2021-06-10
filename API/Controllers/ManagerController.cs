using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using FluentEmail.Core;
using FluentEmail.Smtp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
	[Authorize(Policy = "RequireManagerRole")]
	public class ManagerController : BaseApiController
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly IUnitOfWork _unitOfWork;

		public ManagerController(UserManager<AppUser> userManager, IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
			_userManager = userManager;
		}
        [HttpGet]
		public async Task<ActionResult> GetUnapprovedUsers()
		{
			return Ok(await _unitOfWork.UserRepository.GetUnapprovedUsersAsync());
		}

        [HttpPut("{id}")]
        public async Task<ActionResult> ApproveUser(int id)
        {
			var user = await _userManager.Users.SingleOrDefaultAsync(x => x.Id == id);
            if (user == null) return NotFound("Usuário não encontrado");

			user.Active = true;

			var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded) return BadRequest("Ocorreu um erro.");

			// await SendEmail(user);
			
			return Ok();
		}

		[HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
			var user = await _userManager.Users.SingleOrDefaultAsync(x => x.Id == id);
            if (user == null) return NotFound("Usuário não encontrado");

			var result = await _userManager.DeleteAsync(user);

			if (result.Succeeded) return NoContent();

			return BadRequest("Ocorreu um erro.");

		}

		private async Task SendEmail(AppUser user) 
		{
			var sender = new SmtpSender(() => new SmtpClient(host: "smtp.gmail.com", port: 587)
			{
				EnableSsl = true,
				Credentials = new NetworkCredential("Email Da Aplicação", "Senha da aplicação")
			});

			Email.DefaultSender = sender;

			var email = await Email.From(emailAddress: "Email Da Aplicação")
			.To(emailAddress: user.Email, name: user.KnownAs)
			.Subject(subject: "Biblioteca do Bairro")
			.Body(body: "O seu cadastro na Biblioteca do Bairro foi aprovado.")
			.SendAsync();
		}
	}
}