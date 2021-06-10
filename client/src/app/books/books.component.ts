import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { BookService } from '../_services/book.service'
import { AccountService } from '../_services/account.service'
import { take } from 'rxjs/operators'
import { Roles } from '../_enums/roles'
import { BehaviorSubject } from 'rxjs';
import { Pagination } from '../_models/pagination';
import { BookParams } from '../_models/book-params';
import { User } from '../_models/user';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent implements OnInit {

  readonly books$ = this.bookService.books$

  readonly pagination$ = new BehaviorSubject<Pagination>(null);
  readonly bookParams$ = new BehaviorSubject<BookParams>(null);


  authorizedRoles = [Roles.Manager]
  user: User;

  constructor(accountService: AccountService, private bookService: BookService) {
    accountService.currentUser$.pipe(take(1)).subscribe((user) => (this.user = user));
    this.bookParams$.next(bookService.bookParams);
  }

  ngOnInit() {
    this.loadBooks();
  }

  async loadBooks() {
    this.bookService.setBookParams(this.bookParams$.value);
    const pagination = await this.bookService.loadBooks(this.bookParams$.value);
    this.pagination$.next(pagination);
    console.log(this.pagination$.value);
  }

  resetFilters() {
    this.bookParams$.next(this.bookService.resetBookParams());
    this.loadBooks();
  }

  pageChanged(event: unknown) {
    this.bookParams$.value.pageNumber = event['page'] ?? 1;
    this.bookService.setBookParams(this.bookParams$.value);
    this.loadBooks();
  }
}
