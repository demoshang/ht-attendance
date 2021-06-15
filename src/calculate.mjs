import { formatDate, toNu } from "./utils";

// 计算工时, 按照每日 h 小时计算(即包含休息时间)
function calculate(dayAttendances, workHour = 8, breakHour = 2) {
  const h = workHour + breakHour;

  // 应该需要工作
  let needMillSeconds = 0;
  // 实际工作
  let realMillSeconds = 0;
  // 加班工作
  let addMillSeconds = 0;

  // 缺勤列表
  let absenteeismList = [];
  // 缺勤日期列表
  let absenteeismDate = [];
  // 加班列表
  let overtimeList = [];
  // 今日打卡数据
  let todayRecord = undefined;

  const MILL_SECONDS_HOURS = 60 * 60 * 1000;
  const MILL_SECONDS_MINUTES = 60 * 1000;
  const TODAY = formatDate("YYYY-MM-DD");

  if (dayAttendances[dayAttendances.length - 1]?.dateStr === TODAY) {
    todayRecord = dayAttendances.pop();
  }

  dayAttendances.forEach((item) => {
    const { isWorkday, dateStr, workMillSeconds } = item;

    if (isWorkday) {
      // 应当需要工作
      needMillSeconds += h * MILL_SECONDS_HOURS;

      // 实际工作
      realMillSeconds += workMillSeconds;

      // 缺勤
      if (workMillSeconds === 0) {
        absenteeismDate.push(dateStr);
        absenteeismList.push(item);
      }
    } else {
      // 加班
      addMillSeconds += workMillSeconds;

      if (workMillSeconds > 0) {
        overtimeList.push(item);
      }
    }
  });

  addHours = toNu(addMillSeconds / MILL_SECONDS_HOURS);
  needHours = toNu(needMillSeconds / MILL_SECONDS_HOURS);
  realHours = toNu(realMillSeconds / MILL_SECONDS_HOURS);

  addMinutes = toNu(addMillSeconds / MILL_SECONDS_MINUTES);
  needMinutes = toNu(needMillSeconds / MILL_SECONDS_MINUTES);
  realMinutes = toNu(realMillSeconds / MILL_SECONDS_MINUTES);

  const restMinutes = toNu(
    (realMillSeconds + addMillSeconds - needMillSeconds) / MILL_SECONDS_MINUTES
  );

  const raw = {
    todayRecord,
    dayAttendances,

    absenteeismList,
    absenteeismDate,
    overtimeList,
    addHours,
    needHours,
    realHours,

    addMinutes,
    needMinutes,
    realMinutes,
    restMinutes,
  };

  const restHours = toNu(restMinutes / 60);

  const formatted = {
    今日打卡: "",
    缺勤: absenteeismDate.length ? absenteeismDate.join(", ") : "无",
    加班: `${addMinutes}分钟 ~= ${addHours}小时 ~= ${toNu(addHours / h)}天`,
    应工作: `${needMinutes}分钟 ~= ${needHours}小时 ~= ${toNu(
      needHours / h
    )}天 (${workHour}工作小时 + ${breakHour} 休息小时)`,
    实际: `${realMinutes}分钟 ~= ${realHours}小时 ~= ${toNu(realHours / h)}天`,
    月盈亏: `${restMinutes}分钟 ~= ${restHours} 小时 `,
  };

  // 如果今日在查询返回结果内, 同时显示今日打卡状态
  if (todayRecord) {
    const todayRecordTime = [todayRecord?.startStr, todayRecord?.endStr]
      .filter((v) => {
        return v;
      })
      .join("~~~~");

    formatted["今日打卡"] = todayRecord.isWorkday
      ? todayRecordTime
        ? todayRecordTime
        : "未查询到打卡记录"
      : "非工作日";
  } else {
    delete formatted["今日打卡"];
  }

  return {
    raw,
    formatted,
  };
}

export { calculate };
