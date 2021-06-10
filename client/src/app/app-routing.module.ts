import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { BooksComponent } from './books/books.component';
import { DonateComponent } from './donate/donate.component';
import { HomeComponent } from './home/home.component';
import { PendingUsersComponent } from './pending-users/pending-users.component';
import { AuthGuard } from './_guards/auth.guard';
import { LoginGuard } from './_guards/login.guard';
import { ManagerGuard } from './_guards/manager.guard';

const routes: Routes = [
  { path: 'login', component: AccountComponent, runGuardsAndResolvers: 'always', canActivate: [LoginGuard] },
  {
    path: 'home', component: HomeComponent, runGuardsAndResolvers: 'always', canActivate: [AuthGuard], children: [
      { path: '', component: BooksComponent },
      { path: 'donate', component: DonateComponent },
      { path: 'users', component: PendingUsersComponent, runGuardsAndResolvers: 'always', canActivate: [ManagerGuard] },
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
