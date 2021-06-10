import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SimpleModalModule } from 'ngx-simple-modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { HasRoleDirective } from './_directives/has-role.directive';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { PendingUsersComponent } from './pending-users/pending-users.component';
import { BooksComponent } from './books/books.component';
import { StatusBadgeComponent } from './status-badge/status-badge.component';
import { RentsComponent } from './rents/rents.component';
import { TimeAgoPipe } from './_pipes/time-ago.pipe';
import { ModalRentsComponent } from './_modals/modal-rents/modal-rents.component';
import { RentedByUserPipe } from './_pipes/rented-by-user.pipe';
import { BookCardComponent } from './books/book-card/book-card.component';
import { ModalConfirmComponent } from './_modals/modal-confirm/modal-confirm.component';
import { DonateComponent } from './donate/donate.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AccountComponent,
    HomeComponent,
    NavComponent,
    HasRoleDirective,
    PendingUsersComponent,
    BooksComponent,
    StatusBadgeComponent,
    RentsComponent,
    TimeAgoPipe,
    ModalRentsComponent,
    RentedByUserPipe,
    BookCardComponent,
    ModalConfirmComponent,
    DonateComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    NgxSpinnerModule,
    SimpleModalModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
