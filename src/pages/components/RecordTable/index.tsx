import { BREAK_HOUR, WORK_HOUR } from '@/utils/constants';
import { MILLISECONDS_HOURS } from '@/utils/date';
import type { JSX } from 'solid-js/jsx-runtime';
import 'solid-js/web';
import { TagRecord } from '../../tag-record';

interface Column {
  title: string;
  dataIndex: string;
  render?: (value: any, row: TagRecord, index: number) => string | JSX.Element;
  style?: { [K: string]: string };
}

function getLineBackgroundStyle(row: TagRecord) {
  if (row.isPersonalLeave) {
    return {
      background: '#c29ffa',
    };
  } else if (row.workMillSeconds > 0 && !row.isWorkday) {
    return {
      background: '#20c997',
    };
  } else if (row.workMillSeconds < MILLISECONDS_HOURS && row.isWorkday) {
    return {
      background: '#EA868F',
    };
  } else if (row.workMillSeconds < MILLISECONDS_HOURS && !row.isWorkday) {
    return {
      background: '#F8F9FA',
    };
  } else if (row.workMillSeconds < (WORK_HOUR + BREAK_HOUR) * MILLISECONDS_HOURS) {
    return {
      background: '#FFF3CD',
    };
  }

  return {};
}

const RecordTable = ({ columns, rows }: { columns: Column[]; rows: TagRecord[] }) => {
  return (
    <table className="table table-bordered align-middle">
      <thead>
        <tr>
          {columns.map(({ title }) => {
            return <th scope="col">{title}</th>;
          })}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, index) => {
          const style = getLineBackgroundStyle(row);

          return (
            <tr style={style}>
              {columns.map(({ dataIndex, render, style }) => {
                const value = (row as any)[dataIndex];
                if (render) {
                  return <td style={style}>{render(value, row, index)}</td>;
                }

                return <td style={style}>{value}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export { RecordTable, Column };
export default RecordTable;
