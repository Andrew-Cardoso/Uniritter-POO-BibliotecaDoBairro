import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;
  constructor(private spinnerService: NgxSpinnerService) {}

  busy() {
    this.busyRequestCount++;
    this.spinnerService.show(undefined, {
      type: 'square-jelly-box',
      bdColor: '#0004',
      color: '#1f9bcf'
    });
  }
  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount < 1) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
