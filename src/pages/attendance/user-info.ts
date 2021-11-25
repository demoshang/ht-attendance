import { checkIsValidMonth, formatDate } from '@/utils/date';

function getUserInfo() {
  // 如果存在mock数据, 直接返回
  if (typeof HT_ATTENDANCE_MOCK_DATA !== 'undefined') {
    return {
      userNo: '0',
      monthStr: '202111',
    };
  }

  const monthStr = prompt(
    '请输入计算月份, 如 202101, 确定后请等待3秒左右',
    formatDate('YYYYMM', new Date()),
  );

  if (!monthStr || !checkIsValidMonth(monthStr)) {
    alert(`输入月份${monthStr}不正确`);
    throw new Error(`${monthStr}`);
  }

  const userNo = document
    .querySelector<HTMLSpanElement>('.wea-watremark-mark')
    ?.innerText?.match(/\d{10,10}/)?.[0];

  if (!userNo) {
    alert(`无法获取 userNo, 请反馈`);
    throw new Error(`userNo`);
  }

  return { monthStr, userNo };
}

export { getUserInfo };
