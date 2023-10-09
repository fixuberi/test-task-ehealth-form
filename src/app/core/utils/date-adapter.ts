import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {

  override parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('.') > -1)) {
      const str = value.split('.');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    }
    return new Date(value);
  }

  override format(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return this._to2digit(day) + '.' + this._to2digit(month) + '.' + year;
  }

  override getFirstDayOfWeek(): number {
    return 1;
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }
}
