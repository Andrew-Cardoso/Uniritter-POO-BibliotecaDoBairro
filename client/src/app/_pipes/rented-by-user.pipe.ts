import { Pipe, PipeTransform } from '@angular/core';
import { Rent } from '../_models/rent';

@Pipe({
  name: 'rentedByUser'
})
export class RentedByUserPipe implements PipeTransform {

  transform(rents: Rent[], userId: number): boolean {
    return rents.some(({ rentedById }) => rentedById === userId);
  }

}
