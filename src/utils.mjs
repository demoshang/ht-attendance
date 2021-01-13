// 获取一个月的开始和结束
function getMonthRange(monthStr) {
  const start = new Date(`${monthStr.slice(0, 4)}/${monthStr.slice(4)}/01`);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

  return [start, end];
}

// 日期格式化
function formatDate(fmt, date = new Date()) {
  let o = {
    "([yY]+)": date.getFullYear(),
    "(M+)": date.getMonth() + 1, // 月份
    "([dD]+)": date.getDate(), // 日
    "([hH]+)": date.getHours(), // 小时
    "(m+)": date.getMinutes(), // 分
    "(s+)": date.getSeconds(), // 秒
    "([qQ]+)": Math.floor((date.getMonth() + 3) / 3), // 季度
    "(S+)": date.getMilliseconds(), // 毫秒
  };
  Object.keys(o).forEach((key) => {
    if (new RegExp(key).test(fmt)) {
      let match = RegExp.$1;
      if (/y/i.test(match) || match.length > 1) {
        fmt = fmt.replace(match, `00${o[key]}`.substr(-match.length));
      } else {
        fmt = fmt.replace(match, `00${o[key]}`.substr(-`${o[key]}`.length));
      }
    }
  });
  return fmt;
}

function toNu(v, fractionDigits = 2) {
  return parseFloat(v.toFixed(fractionDigits));
}

export { toNu, formatDate, getMonthRange };
