import { Book } from "../_models/book";

export type BookDonate = Pick<Book, 'title' | 'author' | 'year'>;

export type BookDonateNew = Pick<Book, 'title' | 'author' | 'year' | 'image'>;