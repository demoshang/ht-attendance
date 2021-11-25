import { MILLISECONDS_HOURS } from '@/utils/date';
import { BaseRecord } from '../../attendance/transform-record';
import { subject } from '../../data-subject';

const STORAGE_LEAVE_KEY = 'PERSONAL_LEAVE';

interface Record extends BaseRecord {
  isPersonalLeave: boolean;

  isAbsenteeism: boolean;
  isOverTime: boolean;
}

function getStorageLeaveList(): string[] {
  const str = localStorage.getItem(STORAGE_LEAVE_KEY);

  if (!str) {
    return [];
  }

  try {
    return JSON.parse(str);
  } catch (e) {
    return [];
  }
}

function setStorageLeaveList(list: string[]) {
  localStorage.setItem(STORAGE_LEAVE_KEY, JSON.stringify(list));

  subject.next({ type: 'personalLeave', value: list });
}

function updateLeaveList(dateStr: string) {
  const list = getStorageLeaveList();

  const index = list.indexOf(dateStr);

  if (index === -1) {
    setStorageLeaveList([dateStr, ...list]);
  } else {
    setStorageLeaveList([...list.slice(0, index), ...list.slice(index + 1)]);
  }
}

function checkIsLeave(list: string[], dateStr: string) {
  return list.includes(dateStr);
}

export { getStorageLeaveList, updateLeaveList, checkIsLeave };
