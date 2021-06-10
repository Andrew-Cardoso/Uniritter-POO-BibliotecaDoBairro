using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IUnitOfWork
    {        
		IBookRepository BookRepository { get; }
		IUserRepository UserRepository { get; }
		Task<bool> Complete();
		void Update<T>(T item);
    }
}