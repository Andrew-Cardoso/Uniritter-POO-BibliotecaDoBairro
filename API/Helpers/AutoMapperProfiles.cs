using AutoMapper;
using API.Entities;
using API.Extensions;
using API.DTOs;
using System.Linq;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
			CreateMap<RegisterDto, AppUser>()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Username.ToLower()))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Username.ToLower()));

            CreateMap<AppUser, UnapprovedUserDto>();

			CreateMap<DonateBookDto, Book>()
				.ForMember(dest => dest.Stock, opt => opt.MapFrom(x => 1))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title.ToLower()))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Author.ToLower()));

			CreateMap<UserBook, RentDto>()
                .ForMember(dest => dest.RentedBy, opt => opt.MapFrom(src => src.User.KnownAs))
                .ForMember(dest => dest.RentedById, opt => opt.MapFrom(src => src.User.Id));

			CreateMap<Book, BookDto>()
                .ForMember(dest => dest.Rents, opt => opt.MapFrom(src => src.RentedBy.Where(x => x.DateReturned == null)))
			    .ForMember(dest => dest.Available, opt => opt.MapFrom(src => src.RentedBy == null && src.Stock > 0 || src.Stock > src.RentedBy.Where(x => x.DateReturned == null).Count()));

		}
    }
}
