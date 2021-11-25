import { formatDate } from '@/utils/date';

interface ServerRecord {
  isWorkday: boolean;
  date: Date;
  dateStr: string;
  attendance: Date[];
}

interface BaseRecord extends ServerRecord {
  start?: Date;
  startStr?: string;
  end?: Date;
  endStr?: string;
  workMillSeconds: number;
}

// 将打卡记录中多余的数据去除, 拼接成每日第一次打卡和最后一次打卡
function transform(item: ServerRecord) {
  const { attendance } = item;
  let arr = [...attendance];
  let result: BaseRecord = { ...item, workMillSeconds: 0 };

  result.start = arr.shift();
  result.startStr = result.start ? formatDate('YYYY-MM-DD HH:mm:ss', result.start) : '';
  result.end = arr.pop();
  result.endStr = result.end ? formatDate('YYYY-MM-DD HH:mm:ss', result.end) : '';

  // 打卡缺失 或者 早上晚于10点
  if (!result.start || !result.end || result.start.getHours() >= 10) {
    result.workMillSeconds = 0;
  } else {
    result.workMillSeconds = result.end.getTime() - result.start.getTime();
  }

  return result;
}

// 将打卡记录合并到每日记录上
function monthAddAttendances(
  dayList: {
    isWorkday: boolean;
    date: Date;
    dateStr: string;
  }[],
  records: {
    AttendanceDateTime: string;
    NAME: string;
    userNo: string;
  }[],
) {
  const obj = records
    .map(({ AttendanceDateTime }) => {
      return new Date(AttendanceDateTime);
    })
    .reduce((r, when) => {
      const dateStr = formatDate('YYYY-MM-DD', when);
      r[dateStr] = r[dateStr] ?? [];
      r[dateStr].push(when);

      return r;
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    }, {} as Record<string, Date[]>);

  const list = [...dayList]
    .map(({ isWorkday, date, dateStr }) => {
      return {
        isWorkday,
        date,
        dateStr,
        attendance: (obj[dateStr] ?? []).sort((v1, v2) => {
          return new Date(v1) < new Date(v2) ? -1 : 1;
        }),
      };
    })
    .map(transform);

  // 筛选小于今天的
  const now = new Date();
  return list.filter(({ date }) => {
    return date < new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  });
}

export { monthAddAttendances, BaseRecord };
