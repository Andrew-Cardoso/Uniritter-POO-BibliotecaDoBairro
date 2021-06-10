using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.DTOs;
using Microsoft.AspNetCore.Authorization;
using System;

namespace API.Controllers
{
	public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper mapper)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
        }
        
        [HttpPost("register")]
        public async Task<ActionResult<string>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Este usuário já existe.");            
            var user = _mapper.Map<AppUser>(registerDto);
            
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            return result.Succeeded ? Ok() : BadRequest(result.Errors);
		}

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());
            if (user == null) return Unauthorized("Este usuário não existe.");

			var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
			if (!result.Succeeded) return Unauthorized("Não foi possivel fazer o login.");

            if (!user.Active) return Unauthorized("Aguardando aprovação do síndico.");

			return await CreateUserDto(user);
        }

        [HttpGet("user-exists/{username}")]
		public async Task<ActionResult<bool>> TaskUserExists(string username)
		{
		    return Ok(await UserExists(username));
		}

		private async Task<UserDto> CreateUserDto(AppUser user)
        {
			return new UserDto
			{
				Token = await _tokenService.CreateToken(user),
				KnownAs = user.KnownAs
			};
		}

		private async Task<bool> UserExists(string username)
		{
		    return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
		}

	}
}
