import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Roles } from '../_enums/roles';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass']
})
export class NavComponent {

  roles = [Roles.Manager];
  name: string;
  isManager: boolean;

  constructor(private accountService: AccountService) {
    accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.name = user.knownAs;
      this.isManager = user.roles.includes(Roles.Manager);
    });
  }

  loggout() {
    this.accountService.logout();    
  }

}
