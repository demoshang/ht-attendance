import { subject } from '../../data-subject';

const STORAGE_KEY = 'TAG_CHECK_IN';

interface TagCheckIn {
  start?: string;
  end?: string;
}

// interface Record extends BaseRecord {
//   isPersonalLeave: boolean;

//   isAbsenteeism: boolean;
//   isOverTime: boolean;

//   isTagCheckIn: boolean;
// }

function getStorageTagCheckIn(): Record<string, TagCheckIn> {
  const str = localStorage.getItem(STORAGE_KEY);

  if (!str) {
    return {};
  }

  try {
    return JSON.parse(str);
  } catch (e) {
    return {};
  }
}

function setStorageTagCheckIn(obj: Record<string, TagCheckIn>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));

  subject.next({ type: 'tagCheckIn', value: obj });
}

function updateTagCheckIn({
  date,
  type,
  value,
}: {
  date: string;
  type: 'start' | 'end';
  value?: string;
}) {
  const obj = getStorageTagCheckIn();

  const item = obj[date] ?? {};

  item[type] = value;

  setStorageTagCheckIn({ ...obj, [date]: item });
}

function checkIsTagCheckIn(
  obj: Record<string, TagCheckIn>,
  dateStr: string,
  type: 'start' | 'end',
) {
  return !!obj[dateStr]?.[type];
}

export { updateTagCheckIn, checkIsTagCheckIn, getStorageTagCheckIn };
