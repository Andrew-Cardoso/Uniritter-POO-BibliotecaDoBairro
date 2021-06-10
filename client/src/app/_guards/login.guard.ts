import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { map, take } from 'rxjs/operators'
import { AccountService } from '../_services/account.service'

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}
  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      take(1),
      map((user) => {
        if (!user) return true
        this.router.navigateByUrl('/home')
      }),
    )
  }
}
