import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SimpleModalService } from 'ngx-simple-modal';
import { Roles } from 'src/app/_enums/roles';
import { ModalConfirmComponent } from 'src/app/_modals/modal-confirm/modal-confirm.component';
import { ModalRentsComponent } from 'src/app/_modals/modal-rents/modal-rents.component';
import { Book } from 'src/app/_models/book';
import { Rent } from 'src/app/_models/rent';
import { User } from 'src/app/_models/user';
import { BookService } from 'src/app/_services/book.service';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookCardComponent {
  @Input() book: Book;
  @Input() roles: Roles[];
  @Input() user: User;

  constructor(private modalService: SimpleModalService, private bookService: BookService) { }

  async openRentsModal(book: Book) {
    if (book.rents?.length > 0) await this.modalService.addModal(ModalRentsComponent, { book }).toPromise();
  }

  async returnBook(rents: Rent[]) {
    await this.bookService.returnBook(rents, this.user);
  }

  async rentBook(bookId: number) {
    await this.bookService.rentBook(bookId, this.user);
  }

  async donate(book: Book) {
    await this.bookService.donate(book, this.user);
  }
  async deleteBook(book: Book) {
    const confirm = await this.modalService.addModal(ModalConfirmComponent, {
      btnConfirmText: `Excluir ${book.title}`,
      title: `Excluir ${book.title}`,
      faIcon: 'fas fa-book-dead',
      iconColor: '#d9534f',
      message: `
        <p>Esta ação excluirá uma cópia não alugada do livro <strong>${book.title}</strong>.</p>
        <p>Se o livro foi alugado e não devolvido você deve ir em "Ver Aluguéis" e excluir aquela cópia específica.</p>
      `
     }).toPromise();
    
    confirm && await this.bookService.deleteBook(book);
  }
}
