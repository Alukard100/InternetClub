import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userTime',
  pure: true
})
export class UserTimePipe implements PipeTransform {

  transform(
    availableSeconds: number | null | undefined,
    isActive: boolean,
    expiresAt?: string | Date | null,
    serverTime?: number | Date,
    ignoreInactiveGrey: boolean = false
  ): { text: string; color: string } {

    let seconds = 0;

    if (isActive && expiresAt) {

      const now = serverTime
        ? new Date(serverTime).getTime()
        : Date.now();

      seconds = Math.floor(
        (new Date(expiresAt).getTime() - now) / 1000
      );

    } else {
      seconds = availableSeconds ?? 0;
    }

    if (seconds <= 0) {
      return { text: '00:00', color: 'grey' };
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const text = `${this.pad(hours)}:${this.pad(minutes)}`;

    if (!isActive && !ignoreInactiveGrey) {
      return { text, color: 'grey' };
    }

    if (seconds < 3600) {
      return { text, color: 'red' };
    }

    return { text, color: 'green' };

  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

}
