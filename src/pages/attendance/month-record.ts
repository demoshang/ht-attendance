import { formatDate, getMonthRange } from '@/utils/date';
import { getMonthDayList } from '../holidays';
import { getSignRecord } from './sign-record';
import { monthAddAttendances } from './transform-record';

// 获取某个月的每日打卡状态
async function getDayAttendances(userNo: string, monthStr: string) {
  const [start, end] = getMonthRange(monthStr);
  const records = await getSignRecord(
    userNo,
    formatDate('YYYY-MM-DD', start),
    formatDate('YYYY-MM-DD', end),
  );

  const dayAttendances = monthAddAttendances(getMonthDayList(monthStr), records);

  return dayAttendances;
}

export { getDayAttendances };
