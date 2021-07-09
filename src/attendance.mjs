import { getMonthDayList } from "./holidays.mjs";
import { formatDate, getMonthRange } from "./utils.mjs";

// 获取签到记录, 同源限制
async function getSignRecord(userNo, from, to) {
  const url = `https://oa.hengtonggroup.com.cn/kaizen/jsp/KaoQinResultData.jsp?r=0.03938942323541239&userNo=${userNo}&fromDate=${from}&toDate=${to}&_search=false&nd=1606438066840&rows=-1&page=1&sidx=ID&sord=asc`;

  const res = await fetch(url);
  const json = await res.json();
  return json.data;
}

// 将打卡记录中多余的数据去除, 拼接成每日第一次打卡和最后一次打卡
function transform(item) {
  const { attendance } = item;

  let arr = [...attendance];

  item.start = arr.shift();
  item.startStr = item.start
    ? formatDate("YYYY-MM-DD HH:mm:ss", item.start)
    : "";
  item.end = arr.pop();
  item.endStr = item.end ? formatDate("YYYY-MM-DD HH:mm:ss", item.end) : "";

  if (!item.start || !item.end) {
    item.workMillSeconds = 0;
    return;
  }

  item.workMillSeconds = item.end.getTime() - item.start.getTime();
}

// 将打卡记录合并到每日记录上
function monthAddAttendances(dayList, records) {
  const obj = records
    .map(({ AttendanceDateTime }) => {
      return new Date(AttendanceDateTime);
    })
    .reduce((r, when) => {
      const dateStr = formatDate("YYYY-MM-DD", when);
      r[dateStr] = r[dateStr] ?? [];
      r[dateStr].push(when);

      return r;
    }, {});

  const list = [...dayList].map(({ isWorkday, date, dateStr }) => {
    return {
      isWorkday,
      date,
      dateStr,
      attendance: (obj[dateStr] ?? []).sort((v1, v2) => {
        return new Date(v1) < new Date(v2) ? -1 : 1;
      }),
    };
  });

  list.forEach((item) => {
    transform(item);
  });

  // 筛选小于今天的
  const now = new Date();
  return list.filter(({ date }) => {
    return (
      date < new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    );
  });
}

// 获取某个月的每日打卡状态
async function getDayAttendances(userNo, monthStr) {
  const [start, end] = getMonthRange(monthStr);
  const records = await getSignRecord(
    userNo,
    formatDate("YYYY-MM-DD", start),
    formatDate("YYYY-MM-DD", end)
  );

  const dayAttendances = monthAddAttendances(
    getMonthDayList(monthStr),
    records
  );

  return dayAttendances;
}

export { getDayAttendances };
