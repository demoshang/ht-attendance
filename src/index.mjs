import { getDayAttendances } from "./attendance.mjs";
import { calculate } from "./calculate.mjs";
import { formatDate } from "./utils.mjs";
import { render } from "./render.mjs";

async function init() {
  // 检查当前页面是否可以查询打卡记录
  const href = location.href;
  if (!href.includes("oa.hengtonggroup.com.cn")) {
    window.open("https://oa.hengtonggroup.com.cn/wui/main.jsp");
    return;
  } else if (href.includes("/Login.jsp")) {
    alert("请先登录");
    return;
  }

  // 输入查询月份
  let defaultDate = new Date();
  defaultDate.setMonth(defaultDate.getMonth());
  const monthStr = prompt(
    "请输入计算月份, 如 202101, 确定后请等待3秒左右",
    formatDate("YYYYMM", defaultDate)
  );

  if (!/\d{6,6}/.test(monthStr)) {
    alert(`输入月份${monthStr}不正确`);
    return;
  }

  // 获取打卡记录
  const userNo = document
    .querySelector(".wea-watremark-mark")
    .innerText.match(/\d{10,10}/)[0];

  const dayAttendances = await getDayAttendances(userNo, monthStr);

  return {
    dayAttendances,
    userNo,
    monthStr,
  };
}

async function mock() {}

async function run() {
  const { dayAttendances } = await init();

  const workHour = 8; // 每日工作时间
  const breakHour = 2; // 中午1.5 + 晚上 0.5

  // 计算本月打卡
  const { raw, formatted } = calculate(dayAttendances, workHour, breakHour);
  console.log("==================", { raw, formatted });

  // 弹出框输出内容
  const result = Object.keys(formatted).reduce((r, key) => {
    r += `${key.padEnd(6, "　")}${formatted[key]}\r<br>`;

    return r;
  }, "<br>");

  render(raw.dayAttendances, result);

  // alert(result);
}

run();
