import { Rent } from "./rent";

export interface Book {
	id: number;
	title: string;
	author: string;
	image: string;
	year: number;
	stock: number;
	available: boolean;
	rents: Rent[];
}