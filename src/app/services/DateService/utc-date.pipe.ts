import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcDate'
})
export class UtcDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) { }

  transform(value: string | Date): string {
    const date = new Date(value);
    const pad = (n: number) => n < 10 ? '0' + n : n;

    // Adding 5 hours and 30 minutes
    date.setHours(date.getUTCHours() + 5);
    date.setMinutes(date.getUTCMinutes() + 30);

    // const day = pad(date.getUTCDate());
    // const month = pad(date.getUTCMonth() + 1);
    // const year = date.getUTCFullYear();
    // let hours = date.getUTCHours();
    // const minutes = pad(date.getUTCMinutes());
    // const ampm = hours >= 12 ? 'PM' : 'AM';

    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'
    // const strHours = pad(hours);

    const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy hh:mm a');
    return formattedDate ? formattedDate : '';

    // return `${day}/${month}/${year} ${strHours}:${minutes} ${ampm}`;
  }

}
