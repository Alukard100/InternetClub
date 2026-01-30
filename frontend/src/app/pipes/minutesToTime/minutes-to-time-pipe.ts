import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToTime',
})
export class MinutesToTimePipe implements PipeTransform {

  transform(totalMinutes: number | null | undefined, isActive: boolean): { text: string, color: string } {
    if (totalMinutes == null) {
      return { text: '00:00', color: 'grey' };
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const text = `${this.pad(hours)}:${this.pad(minutes)}`;

    if (!isActive) {
      return {text, color: 'grey'};
    }

    if (totalMinutes < 60) {
      return { text, color: 'red' };
    }

    return { text, color: 'green' };

  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

}
