using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class BooksController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly IMapper _mapper;

        public BooksController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<BookDto>>> GetBooks([FromQuery] BookParams bookParams)
        {
            var books = await _unitOfWork.BookRepository.GetBooksAsync(bookParams, User.GetUserId());

			Response.AddPaginationHeader(books.CurrentPage, books.PageSize, books.TotalCount, books.TotalPages);

			return Ok(books);
        }

        [HttpGet("rented")]
        public async Task<ActionResult<ICollection<BookDto>>> GetBooksRented()
        {
			return Ok(await _unitOfWork.BookRepository.GetBooksAsync(User.GetUserId()));
        }

        [HttpGet("{id}", Name = "GetBook")]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            var book = await _unitOfWork.BookRepository.GetBookAsync(id);
            return Ok(book);
        }

        [HttpPost]
        public async Task<ActionResult> DonateBook(DonateBookDto donateBookDto)
        {
            var bookBd =
                await _unitOfWork
                    .BookRepository
                    .GetSimpleBookAsync(donateBookDto);

            var book =
                bookBd == null ? UpsertBook(donateBookDto) : UpsertBook(bookBd);

            if (!(await _unitOfWork.Complete()))
                return BadRequest("Ocorreu um erro.");

            var bookDto =
                await _unitOfWork.BookRepository.GetBookAsync(book.Id);
            return CreatedAtRoute("GetBook", new { id = bookDto.Id }, bookDto);
        }

        [HttpPost("rent/{id}")]
        public async Task<ActionResult> RentBook(int id)
        {
            var book = await _unitOfWork.BookRepository.GetBookAsync(id);
            if (book == null) return NotFound("Livro não encontrado.");

            if (!book.Available)
                return BadRequest("Este livro não está mais disponível.");

            _unitOfWork.BookRepository.RentBook(book.Id, User.GetUserId());

            if (await _unitOfWork.Complete())
                return Ok(await _unitOfWork.BookRepository.GetBookAsync(id));

            return BadRequest("Ocorreu um erro.");
        }

        [HttpPost("return/{id}")]
        public async Task<ActionResult> ReturnBook(int id)
        {
            var rent = await _unitOfWork.BookRepository.GetRentAsync(id);

            if (rent == null) return NotFound("Ocorreu um erro.");

            if (rent.UserId != User.GetUserId())
                return Unauthorized("Não foi você que alugou esse livro.");

            if (rent.DateReturned != null)
                return BadRequest("Você já devolveu esse livro.");

            rent.DateReturned = DateTime.UtcNow;

            _unitOfWork.Update (rent);

            if (await _unitOfWork.Complete())
                return Ok(await _unitOfWork
                    .BookRepository
                    .GetBookAsync(rent.BookId));

            return BadRequest("Ocorreu um erro.");
        }

        [Authorize(Policy = "RequireManagerRole")]
        [HttpDelete("{id}")]
        public async Task<ActionResult>
        DeleteBook(int id, [FromQuery] int? rentId)
        {
            var book = await _unitOfWork.BookRepository.GetSimpleBookAsync(id);

            if (book == null)
                return NotFound("Parece que este livro já foi deletado.");

            if (book.Stock == 1)
            {
                _unitOfWork.BookRepository.Remove(book);
            }
            else if (rentId.HasValue)
            {
                var rent = book.RentedBy.FirstOrDefault(x => x.Id == rentId);
                if (rent == null)
                    return BadRequest("O aluguel não foi encontrado ou o livro já foi devolvido.");

                book.Stock--;
                book.RentedBy.Remove(rent);
                _unitOfWork.Update(book);
            }
            else if (book.Stock == book.RentedBy.Count)
            {
                return BadRequest("Todos os livros estão alugados, escolha um aluguel específico para excluir.");
            } 
			else
			{
				book.Stock--;
                _unitOfWork.Update(book);
			}

            if (await _unitOfWork.Complete())
                return Ok(await _unitOfWork.BookRepository.GetBookAsync(id));
            return BadRequest("Ocorreu um erro.");
        }

        private Book UpsertBook(DonateBookDto donateBook)
        {
            var book = _mapper.Map<Book>(donateBook);
            _unitOfWork.BookRepository.Add (book);
            return book;
        }

        private Book UpsertBook(Book book)
        {
            book.Stock++;
            _unitOfWork.Update (book);
            return book;
        }
    }
}
