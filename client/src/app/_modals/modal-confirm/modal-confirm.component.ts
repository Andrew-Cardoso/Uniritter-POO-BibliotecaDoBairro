import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.sass']
})
export class ModalConfirmComponent extends SimpleModalComponent<ModalConfirmInput, boolean> implements ModalConfirmInput {
  
  message: string;
  title: string;
  btnConfirmText: string;
  faIcon: string;
  iconColor = "#1f1f1f";

  constructor() { super(); }
  
  confirm() {
    this.result = true;
    this.close();
  }  
}

export type ModalConfirmInput = { message?: string; title?: string; btnConfirmText?: string; faIcon?: string; iconColor?: string; };
