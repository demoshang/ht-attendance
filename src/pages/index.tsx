import './pre-check';

import { combineLatest, from } from 'rxjs';
import { render } from 'solid-js/web';
import { subject } from 'src/pages/data-subject';
import { getDayAttendances } from './attendance/month-record';
import { getUserInfo } from './attendance/user-info';
import { calculate } from './calculate';
import Summary from './components/Summary';
import { loadTip } from './pre-check/tooltip';
import { transformRecord } from './tag-record';

function getRoot() {
  let root = document.querySelector('#ht-attendance-root');

  if (root) {
    document.body.removeChild(root);
  }

  root = document.createElement('div');
  root.id = 'ht-attendance-root';
  document.body.appendChild(root);

  return root;
}

async function getBaseRecords() {
  const { userNo, monthStr } = getUserInfo();
  const baseRecords = await getDayAttendances(userNo, monthStr);

  return baseRecords;
}

combineLatest([from(getBaseRecords()), subject]).subscribe(([br, v]) => {
  console.log('============rerender by======', v);

  if (v?.type === 'close') {
    getRoot();
    return;
  }

  const records = transformRecord(br);
  // 计算本月打卡
  const raw = calculate(records);
  console.log('=======raw data===========', raw);

  render(() => <Summary raw={raw} />, getRoot());

  setTimeout(() => {
    loadTip();
  }, 500);
});

subject.next({ type: 'init' });
