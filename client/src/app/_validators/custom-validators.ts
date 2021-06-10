import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AccountService } from '../_services/account.service';

export class CustomValidators {
  static usernameExistsAsync(accountService: AccountService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> =>
      accountService.usernameExists(control?.value).pipe(
        take(1),
        map((result: boolean) => (!result ? null : { alreadyTaken: true }))
      );
  }
}
