import '@/pre-check';
import { combineLatest, from } from 'rxjs';
import { render } from 'solid-js/web';
import { getDayAttendances } from './attendance/month-record';
import { getUserInfo } from './attendance/user-info';
import { calculate } from './calculate';
import Summary from './components/Summary';
import { subject } from './data-subject';
import { loadTip } from './pre-check/tooltip';
import { transformRecord } from './tag-record';

function getContainer() {
  const ele = document.querySelector<HTMLDivElement>('#ht-attendance-container');

  if (ele) {
    return ele;
  }

  const container = document.createElement('div');
  container.id = 'ht-attendance-container';
  container.setAttribute(
    'style',
    'position: fixed; top:0; right: 0; bottom: 0; left: 0; overflow: scroll;    background-color: white; z-index: 999998; padding: 0 100px;',
  );

  document.body.appendChild(container);

  return container;
}

function rmContainer() {
  const ele = document.querySelector<HTMLDivElement>('#ht-attendance-container');

  if (ele) {
    document.body.removeChild(ele);
  }
}

function getRoot() {
  const container = getContainer();

  const root = document.createElement('div');
  root.id = 'ht-attendance-root';

  const old = document.querySelector<HTMLDivElement>('#ht-attendance-root');

  container.appendChild(root);

  if (old) {
    container.removeChild(old);
  }

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
    rmContainer();
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
