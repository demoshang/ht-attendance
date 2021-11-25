// 获取签到记录, 同源限制
async function getSignRecord(userNo: string, from: string, to: string) {
  // 如果存在mock数据, 直接返回
  if (typeof HT_ATTENDANCE_MOCK_DATA !== 'undefined') {
    return HT_ATTENDANCE_MOCK_DATA;
  }

  const url = `https://oa.hengtonggroup.com.cn/kaizen/jsp/KaoQinResultData.jsp?r=0.03938942323541239&userNo=${userNo}&fromDate=${from}&toDate=${to}&_search=false&nd=${Date.now()}&rows=-1&page=1&sidx=ID&sord=asc`;

  const res = await fetch(url);
  const json = await res.json();
  return json.data;
}

export { getSignRecord };
