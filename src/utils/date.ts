const MILLISECONDS_HOURS = 60 * 60 * 1000;
const MILLISECONDS_MINUTES = 60 * 1000;

function checkIsValidMonth(month?: string | null) {
  if (!month) {
    return false;
  }

  return /\d{6,6}/.test(month);
}

// 获取一个月的开始和结束
function getMonthRange(monthStr: string) {
  if (!checkIsValidMonth(monthStr)) {
    throw new Error(`输入月份${monthStr}不正确`);
  }

  const start = new Date(`${monthStr.slice(0, 4)}/${monthStr.slice(4)}/01`);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

  return [start, end];
}

// 日期格式化
function formatDate(fmt: string, date = new Date()) {
  let o = {
    '([yY]+)': date.getFullYear(),
    '(M+)': date.getMonth() + 1, // 月份
    '([dD]+)': date.getDate(), // 日
    '([hH]+)': date.getHours(), // 小时
    '(m+)': date.getMinutes(), // 分
    '(s+)': date.getSeconds(), // 秒
    '([qQ]+)': Math.floor((date.getMonth() + 3) / 3), // 季度
    '(S+)': date.getMilliseconds(), // 毫秒
  };
  Object.keys(o).forEach((key) => {
    if (new RegExp(key).test(fmt)) {
      /* eslint-disable no-param-reassign */
      const v = o[key as '(s+)'];

      let match = RegExp.$1;
      if (/y/i.test(match) || match.length > 1) {
        fmt = fmt.replace(match, `00${v}`.substr(-match.length));
      } else {
        fmt = fmt.replace(match, `00${v}`.substr(-`${v}`.length));
      }

      /* eslint-enable no-param-reassign */
    }
  });
  return fmt;
}

function startOfHour(when: Date, hour: number) {
  const date = new Date(when);

  date.setHours(hour);
  date.setMinutes(0);
  date.setMinutes(0);
  date.setMilliseconds(0);

  return date;
}

export {
  checkIsValidMonth,
  getMonthRange,
  formatDate,
  startOfHour,
  MILLISECONDS_HOURS,
  MILLISECONDS_MINUTES,
};
