import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.sass']
})
export class AccountComponent implements OnInit {

  page: 'Registrar' | 'Login' = 'Login';

  constructor() { }

  ngOnInit(): void {
  }

}
