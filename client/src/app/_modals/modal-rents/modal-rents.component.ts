import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent, SimpleModalService } from 'ngx-simple-modal';
import { Roles } from 'src/app/_enums/roles';
import { Book } from 'src/app/_models/book';
import { Rent } from 'src/app/_models/rent';
import { BookService } from 'src/app/_services/book.service';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-modal-rents',
  templateUrl: './modal-rents.component.html',
  styleUrls: ['./modal-rents.component.sass']
})
export class ModalRentsComponent extends SimpleModalComponent<BookInput, void> implements BookInput {

  book: Book;

  authorizedRoles = [Roles.Manager];

  constructor(private modalService: SimpleModalService, private bookService: BookService) {
    super();
  }

  async deleteBook(rent: Rent) {
    const confirm = await this.modalService.addModal(ModalConfirmComponent, {
      btnConfirmText: `Excluir ${this.book.title}`,
      title: `Excluir ${this.book.title}`,
      faIcon: 'fas fa-book-dead',
      iconColor: '#d9534f',
      message: `
        Tem certeza que deseja excluir a cópia do livro
        <strong>${this.book.title}</strong> 
        que está com <strong>${rent.rentedBy}<strong>?`
    }).toPromise();

    if (!confirm) return;
    
    await this.bookService.deleteBook(this.book, rent.id);

    this.book.rents.splice(
      this.book.rents.indexOf(rent),
      1
    );

    this.book.rents.length === 0 && this.close();
  }
}

type BookInput = { book: Book };