import { getDayAttendances } from "./attendance";
import { calculate } from "./calculate";
import { formatDate } from "./utils";

async function run() {
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
  defaultDate.setMonth(defaultDate.getMonth() - 1);
  const monthStr = prompt(
    "请输入计算月份, 如 202012, 确定后请等待3秒左右",
    formatDate("YYYYMM", defaultDate)
  );

  // 获取打卡记录
  const userNo = document.body.innerHTML.match(/loginid=(\d+)/)[1];
  const dayAttendances = await getDayAttendances(userNo, monthStr);

  // 计算本月打卡
  const { raw, formatted } = calculate(dayAttendances);
  console.log("==================", { raw, formatted });

  // 弹出框输出内容
  const result = Object.keys(formatted).reduce((r, key) => {
    r += `${key.padEnd(12)}${formatted[key]}\r`;

    return r;
  }, "");
  alert(result);
}

run();
