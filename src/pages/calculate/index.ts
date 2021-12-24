import { BREAK_HOUR, WORK_HOUR } from '@/utils/constants';
import {
  format2hourMinute,
  formatDate,
  MILLISECONDS_HOURS,
  MILLISECONDS_MINUTES,
} from '@/utils/date';
import { toNu } from '@/utils/helper';
import { TagRecord } from '../tag-record';

interface CalculateResult {
  dayAttendances: TagRecord[];
  todayRecord: TagRecord | undefined;
  todayStr: string | undefined;
  absenteeismList: TagRecord[];
  absenteeismDate: string[];
  absenteeismStr: string;

  overtimeList: TagRecord[];
  addHours: number;
  addMinutes: number;
  overtimeStr: string;
  needHours: number;
  needMinutes: number;

  needStr: string;
  realHours: number;
  realMinutes: number;
  realStr: string;
  restMinutes: number;
  restStr: string;
}

// 计算工时, 按照每日 h 小时计算(即包含休息时间)
function calculate(
  dayAttendances: TagRecord[],
  workHour = WORK_HOUR,
  breakHour = BREAK_HOUR,
): CalculateResult {
  const h = workHour + breakHour;

  // 应该需要工作
  let needMillSeconds = 0;
  // 实际工作
  let realMillSeconds = 0;
  // 加班工作
  let addMillSeconds = 0;

  // 缺勤列表
  let absenteeismList: TagRecord[] = [];
  // 缺勤日期列表
  let absenteeismDate: string[] = [];
  // 加班列表
  let overtimeList: TagRecord[] = [];
  // 今日打卡数据
  let todayRecord;

  const TODAY = formatDate('YYYY-MM-DD');

  if (dayAttendances[dayAttendances.length - 1]?.dateStr === TODAY) {
    todayRecord = dayAttendances.pop();
  }

  dayAttendances.forEach((item) => {
    const {
      isWorkday,
      isPersonalLeave,
      isTagStartCheckIn,
      isTagEndCheckIn,
      isAbsenteeism,
      isOverTime,
      dateStr,
      workMillSeconds,
    } = item;

    if (isWorkday) {
      // 应当需要工作
      needMillSeconds += h * MILLISECONDS_HOURS;

      // 请假了
      if (isPersonalLeave) {
        realMillSeconds += h * MILLISECONDS_HOURS;
      }

      // 缺勤, 但是手动修改了时间
      else if (isAbsenteeism && (isTagStartCheckIn || isTagEndCheckIn)) {
        realMillSeconds += workMillSeconds;
      }

      // 缺勤, 工作时间小于1小时都算缺勤
      else if (isAbsenteeism) {
        absenteeismDate.push(dateStr);
        absenteeismList.push(item);
      } else {
        // 实际工作
        realMillSeconds += workMillSeconds;
      }
    }
    // 加班
    else if (isOverTime) {
      addMillSeconds += workMillSeconds;
      overtimeList.push(item);
    }
  });

  const addHours = toNu(addMillSeconds / MILLISECONDS_HOURS);
  const needHours = toNu(needMillSeconds / MILLISECONDS_HOURS);
  const realHours = toNu(realMillSeconds / MILLISECONDS_HOURS);

  const addMinutes = toNu(addMillSeconds / MILLISECONDS_MINUTES);
  const needMinutes = toNu(needMillSeconds / MILLISECONDS_MINUTES);
  const realMinutes = toNu(realMillSeconds / MILLISECONDS_MINUTES);

  const restMinutes = toNu((realMillSeconds - needMillSeconds) / MILLISECONDS_MINUTES);

  const restHours = toNu(restMinutes / 60);

  let todayStr;
  // 如果今日在查询返回结果内, 同时显示今日打卡状态
  if (todayRecord) {
    const todayRecordTime = [todayRecord?.startStr, todayRecord?.endStr]
      .filter((v) => {
        return v;
      })
      .join('~~~~');

    todayStr = todayRecord.isWorkday
      ? todayRecordTime
        ? todayRecordTime
        : '未查询到打卡记录'
      : '非工作日';
  }

  const raw = {
    dayAttendances,

    // 今日打卡
    todayRecord,
    todayStr,

    // 缺勤
    absenteeismList,
    absenteeismDate,
    absenteeismStr: absenteeismDate.length ? absenteeismDate.join(', ') : '无',

    // 加班
    overtimeList,
    addHours,
    addMinutes,
    overtimeStr: overtimeList
      .map(({ dateStr, workMillSeconds }) => {
        const { hour, minute } = format2hourMinute(workMillSeconds);
        return `${dateStr} (${hour}小时${minute}分钟)`;
      })
      .join(','),

    // 应该工作
    needHours,
    needMinutes,
    needStr: `${needMinutes}分钟 ~= ${needHours}小时 ~= ${toNu(
      needHours / h,
    )}天 (${workHour}工作小时 + ${breakHour} 休息小时)`,

    // 实际工作
    realHours,
    realMinutes,
    realStr: `${realMinutes}分钟 ~= ${realHours}小时 ~= ${toNu(realHours / h)}天`,

    restMinutes,
    restStr: `${restMinutes}分钟 ~= ${restHours} 小时 `,
  };

  return raw;
}

export { calculate, CalculateResult };
