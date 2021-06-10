import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { BookService } from '../_services/book.service';
import { BookDonateNew } from '../_types/book-donate';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.sass']
})
export class DonateComponent implements OnInit {

  books: BookDonateNew[] = [];

  bookForm: FormGroup;

  private user: User;

  constructor(accountService: AccountService, private bookService: BookService, private toastr: ToastrService, private formBuilder: FormBuilder) {
    accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.bookForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      year: ['', [Validators.required]],
      image: ['assets/images/blank book.jpg', [Validators.required]]
    });
  }

  addBook() {
    if (this.bookForm.invalid) return this.bookForm.markAllAsTouched();
    this.books.unshift(this.bookForm.value);
    this.resetForm();
  }

  removeBook(book: BookDonateNew) {
    this.books.splice(this.books.indexOf(book), 1);
  }

  resetForm() {    
    this.bookForm.setValue({
      title: '',
      author: '',
      year: '',
      image: 'assets/images/blank book.jpg'
    });
    this.bookForm.markAsUntouched();
  }

  async readImg(changeEvent: any) {
    const file = changeEvent.target.files[0];
    const imgSrc = await this.getImgBase64(file);
    this.bookForm.get('image').setValue(imgSrc);
  }

  async donate() {
    const promises = this.books.map(book => this.bookService.donateNewBook(book, this.user));
    await Promise.all(promises);
    this.toastr.success('Muito obrigado!', 'Livros doados');

    this.books = [];
    this.resetForm();
  }

  private getImgBase64(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result.toString());
      fileReader.onerror = () => {
        this.toastr.warning('Ocorreu um erro com a imagem.');
        return reject();
      }
      fileReader.readAsDataURL(file);
    });
  }

}
