import { Book } from './book'

export class BookParams {
  searchString: string;
  pageNumber = 1;
  pageSize = 50;
  rentedByMe = false;
  id?: number;


  constructor(book?: Book) {}
}
