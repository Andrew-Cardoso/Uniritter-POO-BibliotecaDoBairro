import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { NavigationExtras, Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { catchError } from 'rxjs/operators'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((e: HttpErrorResponse) => {
        if (e) {
          switch (e.status) {
            case 400:
              const errors = e.error.errors
              if (errors) {
                const modalStateErrors = []
                for (const key in errors)
                  errors[key] && modalStateErrors.push(errors[key])
                throw modalStateErrors.flat()
              } else if (typeof e.error === 'object') {
                this.toastr.error(e.statusText, `${e.status}`)
              } else {
                this.toastr.error(e.error, `${e.status}`)
              }
              break
            case 403:
              this.toastr.error('Você não tem permissão para fazer isso.', 'Não autorizado');
              break
            case 401:
              this.toastr.error(
                e.error?.title ?? e.error ?? 'Não autorizado.',
                'Não autorizado',
              )
              break
            case 404:
              this.toastr.error(e.error, 'Erro')
              break
            case 500:
              this.toastr.error(e.error)
              break
            default:
              this.toastr.error('Ocorreu um erro estranho.', '???')
              break
          }
        }
        return throwError(e)
      }),
    )
  }
}
