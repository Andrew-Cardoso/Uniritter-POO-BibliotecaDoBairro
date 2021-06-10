import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { UnapprovedUser } from '../_models/unapproved-user';
import { ManagerService } from '../_services/manager.service';

@Component({
  selector: 'app-pending-users',
  templateUrl: './pending-users.component.html',
  styleUrls: ['./pending-users.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendingUsersComponent implements OnInit {

  readonly users$ = new BehaviorSubject<UnapprovedUser[]>([]);

  constructor(private managerService: ManagerService, private toast: ToastrService) { }

  ngOnInit() {
    this.loadUsers();
  }

  async approveUser(user: UnapprovedUser) {
    await this.managerService.approveUser(user.id).toPromise();

    this.toast.success(`${user.knownAs} agora pode acessar a Biblioteca do Bairro e recebeu um email sendo informado.`, 'Aprovado');

    this.removeFromList(user);
  }

  async deleteUser(user: UnapprovedUser) {
    await this.managerService.deleteUser(user.id).toPromise();

    this.toast.info(`A solicitação de ${user.knownAs} foi excluída.`, 'Não aprovado');

    this.removeFromList(user);
  }

  async loadUsers() {
    this.users$.next(await this.managerService.getPendingUsers().toPromise());
  };

  private removeFromList(user: UnapprovedUser) {
    const users = this.users$.value;
    const index = users.indexOf(user);

    users.splice(index, 1);

    this.users$.next(users);
  }

}
