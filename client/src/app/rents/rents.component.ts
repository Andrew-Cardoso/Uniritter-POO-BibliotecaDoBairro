import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Rent } from '../_models/rent';

@Component({
  selector: 'app-rents',
  templateUrl: './rents.component.html',
  styleUrls: ['./rents.component.sass']
})
export class RentsComponent {

  @Input() rents: Rent[];

  constructor() { }

}
