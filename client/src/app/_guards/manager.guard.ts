import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Roles } from '../_enums/roles'
import { AccountService } from '../_services/account.service'

@Injectable({
  providedIn: 'root',
})
export class ManagerGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map((user) => {
        if (user.roles.includes(Roles.Manager)) return true;
        this.toastr.error(
          'Apenas o síndico pode acessar essa página.',
          'Não autorizado',
        );
        this.router.navigateByUrl('/home');
      }),
    )
  }
}
