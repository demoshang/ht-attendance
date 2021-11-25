function checkUrl() {
  // 检查当前页面是否可以查询打卡记录
  const href = location.href;
  if (!href.includes('oa.hengtonggroup.com.cn')) {
    window.open('https://oa.hengtonggroup.com.cn/wui/main.jsp');
    return false;
  } else if (href.includes('/Login.jsp')) {
    alert('请先登录');
    return false;
  }

  return true;
}

export { checkUrl };
