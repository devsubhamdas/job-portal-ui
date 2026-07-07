import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    return this.timeAgo(value);
  }

  private timeAgo(date: Date | string): string {
    const inputDate = typeof date === 'string' ? new Date(date) : date;
    const seconds = Math.floor((Date.now() - inputDate.getTime()) / 1000);

    const intervals: [string, number][] = [
      ['year', 31536000],
      ['month', 2592000],
      ['week', 604800],
      ['day', 86400],
      ['hour', 3600],
      ['minute', 60],
      ['second', 1],
    ];

    for (const [unit, secondsInUnit] of intervals) {
      const count = Math.floor(seconds / secondsInUnit);
      if (count >= 1) {
        return `${count} ${unit}${count !== 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  }
}
