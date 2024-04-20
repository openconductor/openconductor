import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function dayNow(date: Date) {
  if (date < new Date()) {
    return dayjs(date).fromNow();
  } else {
    return dayjs(date).toNow();
  }
}
