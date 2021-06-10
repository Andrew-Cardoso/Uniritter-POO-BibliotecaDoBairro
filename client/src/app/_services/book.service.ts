import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr'
import { BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { HubMethods } from '../_enums/hub-methods';
import { Book } from '../_models/book'
import { BookParams } from '../_models/book-params'
import { Notification } from '../_models/notification';
import { PaginatedResult, Pagination } from '../_models/pagination'
import { Rent } from '../_models/rent'
import { User } from '../_models/user';
import { BookDonate, BookDonateNew } from '../_types/book-donate'

@Injectable({
  providedIn: 'root',
})
export class BookService {

  private readonly url = environment.apiUrl + 'books/';
  private readonly hubUrl = environment.hubUrl;

  private hubConnection: HubConnection;


  private readonly _books$ = new BehaviorSubject<Book[]>([])

  readonly books$ = this._books$.asObservable()

  private _bookParams: BookParams

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this._bookParams = new BookParams();
  }

  get bookParams() {
    return this._bookParams
  }

  setBookParams(bookParams: BookParams) {
    this._bookParams = bookParams
  }

  resetBookParams() {
    this._bookParams = new BookParams()
    return this.bookParams;
  }

  createHubConnection(user: User) {

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'books', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));


    this.hubConnection.on("ReceiveNotification", (notification: Notification) =>
      this.toastr[notification.type](notification.message, notification.title));
  }

  stopHubConnection() {
    this.hubConnection && this.hubConnection.stop();
  }

  sendNotification(notification: Notification): Promise<void> {
    return this.hubConnection?.invoke?.(HubMethods.SendNotification, notification);
  }

  getBooksRentedByUser() {
    return this.http.get<Book[]>(this.url + 'rented');
  }

  async donateNewBook(book: BookDonateNew, {knownAs}: User) {
    return this._donateBook(book).toPromise().then(newBook => {
      this.sendNotification({
        type: 'success',
        title: 'Novo livro',
        message: `${knownAs} acabou de doar ${newBook.title}.`
      });
    });
  }

  async loadBooks(bookParams: BookParams): Promise<Pagination> {
    const { result, pagination } = await this._getBooks(this._getParams(bookParams)).toPromise();
    this._books$.next(result);
    return pagination;
  }

  async rentBook(id: number, {knownAs}: User) {
    const rentedBook = await this._rentBook(id).toPromise()

    this.toastr.info(`Você alugou ${rentedBook.title}.`)
    this._updateBook(rentedBook)

    this.sendNotification({
      type: 'info',
      title: 'Livro alugado',
      message: `${knownAs} alugou ${rentedBook.title}.`
    });
  }

  async returnBook(rents: Rent[], {id, knownAs}: User) {
    const rent = rents.find((rent) => rent.rentedById === id)
    if (!rent) return

    const returnedBook = await this._returnBook(rent.id).toPromise()

    this.toastr.info(`${returnedBook.title} devolvido.`)

    this._updateBook(returnedBook)

    this.sendNotification({
      type: 'info',
      title: 'Livro devolvido',
      message: `${knownAs} devolveu ${returnedBook.title}.`
    });
  }

  async donate({ author, title, year }: Book, {knownAs}: User) {
    const bookDonate: BookDonate = { author, title, year }
    const book = await this._donateBook(bookDonate).toPromise()

    this.toastr.info(`Uma nova cópia de ${book.title} foi recebida.`)

    this._updateBook(book)

    this.sendNotification({
      type: 'success',
      title: 'Livro doado',
      message: `${knownAs} doou uma cópia de ${book.title}`
    });
  }  

  async deleteBook(book: Book, rentId?: number) {
    const deletedBook = await this._deleteBook(book.id, rentId).toPromise()

    this.toastr.info(
      deletedBook
        ? `Uma cópia de ${deletedBook.title} foi excluída.`
        : `${book.title} foi excluído.`,
    )

    this._updateBook(deletedBook ?? book, !deletedBook)
  }

  private _getBooks(params: HttpParams) {
    const paginatedResult = new PaginatedResult<Book>()
    return this.http
      .get<Book[]>(this.url, { observe: 'response', params })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body
          const pagination = response.headers.get('Pagination')
          if (pagination) paginatedResult.pagination = JSON.parse(pagination)
          return paginatedResult
        }),
      )
  }

  private _rentBook(id: number) {
    return this.http.post<Book>(`${this.url}rent/${id}`, {})
  }

  private _returnBook(id: number) {
    return this.http.post<Book>(`${this.url}return/${id}`, {})
  }

  private _donateBook(book: BookDonate | BookDonateNew) {
    return this.http.post<Book>(this.url, book)
  }

  private _deleteBook(id: number, rentId?: number) {
    const rentParam = rentId ? `?rentId=${rentId}` : ''
    return this.http.delete<Book>(this.url + id + rentParam)
  }

  private _updateBook(book: Book, deleteBook = false) {
    const books = this._books$.value
    const index = books.findIndex(({ id }) => book.id === id)

    deleteBook ? books.splice(index, 1) : books.splice(index, 1, book)
    this._books$.next(books)
  }

  private _getParams(bookParams: BookParams) {
    let params = new HttpParams()

    if (bookParams?.pageNumber && bookParams?.pageSize) {
      params = params.append('pageNumber', `${bookParams.pageNumber}`)
      params = params.append('pageSize', `${bookParams.pageSize}`)
    }

    if (bookParams?.id) params = params.append('id', `${bookParams.id}`)
    if (bookParams?.searchString) params = params.append('searchString', bookParams.searchString)
    if (bookParams?.rentedByMe) params = params.append('rentedByMe', `${bookParams.rentedByMe}`)

    return params
  }
}
