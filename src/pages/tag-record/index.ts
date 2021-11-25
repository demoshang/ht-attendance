import { formatDate, MILLISECONDS_HOURS, startOfHour } from '@/utils/date';
import { BaseRecord } from '../attendance/transform-record';
import { getStorageTagCheckIn } from './check-in';
import { checkIsLeave, getStorageLeaveList } from './personal-leave';

interface TagRecord extends BaseRecord {
  isTagStartCheckIn: boolean;
  isTagEndCheckIn: boolean;

  isPersonalLeave: boolean;

  isAbsenteeism: boolean;
  isOverTime: boolean;

  // 修改部分数据时, 对原有数据的备份
  bak?: Partial<Omit<TagRecord, 'bak'>>;
}

function toDate(date: string, hoursMinutes?: string) {
  if (!hoursMinutes) {
    return undefined;
  }

  return new Date(`${date} ${hoursMinutes}:00`);
}

function getTagWorkMilliseconds({
  start,
  end,
  tagStart,
  tagEnd,
}: {
  start?: Date;
  end?: Date;
  tagStart?: Date;
  tagEnd?: Date;
}) {
  let e = tagEnd ?? end;
  let s = tagStart ?? start;

  if (!e || !s) {
    return undefined;
  }

  if (e.getTime() < s.getTime()) {
    return undefined;
  }

  return e.getTime() - s.getTime();
}

function transformRecord(list: BaseRecord[]): TagRecord[] {
  const storageLeaveList = getStorageLeaveList();
  const obj = getStorageTagCheckIn();

  // 添加请假数据
  return list.map((item) => {
    let { dateStr, workMillSeconds, isWorkday, start, end, startStr, endStr, ...rest } = item;

    const tagStart = toDate(dateStr, obj[dateStr]?.start);
    const tagEnd = toDate(dateStr, obj[dateStr]?.end);
    const tagWorkMilliseconds = getTagWorkMilliseconds({ start, end, tagStart, tagEnd });

    const isTagStartCheckIn = !!tagStart;
    const isTagEndCheckIn = !!tagEnd;

    const isPersonalLeave = checkIsLeave(storageLeaveList, dateStr);

    let bak: Partial<Omit<TagRecord, 'bak'>> = {};

    if (isPersonalLeave) {
      bak.start = start;
      bak.end = end;

      bak.workMillSeconds = workMillSeconds;

      start = startOfHour(new Date(dateStr), 8);
      end = startOfHour(new Date(dateStr), 18);
      workMillSeconds = 10 * MILLISECONDS_HOURS;
    } else {
      if (tagStart) {
        bak.start = start;
        start = tagStart;
      }

      if (tagEnd) {
        bak.end = end;
        end = tagEnd;
      }

      if (tagStart || tagEnd) {
        bak.workMillSeconds = workMillSeconds;
        workMillSeconds = tagWorkMilliseconds ?? 0;
      }
    }

    startStr = start ? formatDate('YYYY-MM-DD HH:mm:ss', start) : '';
    endStr = end ? formatDate('YYYY-MM-DD HH:mm:ss', end) : '';

    return {
      isPersonalLeave,
      isTagStartCheckIn,
      isTagEndCheckIn,

      // 缺勤, 工作时间小于1小时都算缺勤
      isAbsenteeism: isWorkday && workMillSeconds <= MILLISECONDS_HOURS,
      isOverTime: !isWorkday && workMillSeconds > 0,

      dateStr,
      workMillSeconds,
      isWorkday,
      start,
      end,
      startStr,
      endStr,

      ...rest,
    };
  });
}

export { TagRecord, transformRecord };
