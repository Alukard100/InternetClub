import { UserTimePipe } from './user-time-pipe';

describe('UserTimePipe', () => {
  it('create an instance', () => {
    const pipe = new UserTimePipe();
    expect(pipe).toBeTruthy();
  });
});
