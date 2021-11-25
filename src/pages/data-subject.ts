import { Subject } from 'rxjs';

const subject = new Subject<{
  type: 'personalLeave' | 'tagCheckIn' | 'close' | 'init';
  value?: any;
}>();

export { subject };
