import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],

})
export class LoginComponent {
  @Output() signIn = new EventEmitter();

  username: string;
  password: string;

  constructor(private accountService: AccountService, private router: Router) { }

  async login() {
    await this.accountService.login(this.username, this.password).toPromise();
    this.router.navigateByUrl('/home');
  }
  
}
