import { OnInit, Component, OnDestroy } from '@angular/core';
import { take } from 'rxjs/operators';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { BookService } from '../_services/book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit, OnDestroy {

  user: User;
  constructor(accountService: AccountService, private bookService: BookService) {
    accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }
  
  ngOnInit(): void {
    this.bookService.createHubConnection(this.user);
  }

  ngOnDestroy(): void {
    this.bookService.stopHubConnection();
  }

}
