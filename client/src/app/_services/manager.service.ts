import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UnapprovedUser } from '../_models/unapproved-user';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private readonly url = environment.apiUrl + 'manager/';

  constructor(private http: HttpClient) { }

  getPendingUsers() {
    return this.http.get<UnapprovedUser[]>(this.url);
  }

  approveUser(id: number) {
    return this.http.put(this.url + id, {});
  }

  deleteUser(id: number) {
    return this.http.delete(this.url + id);
  }
}
