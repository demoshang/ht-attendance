import { format2hourMinute, formatDate } from '@/utils/date';
import 'solid-js/web';
import Actions from './components/Actions';
import { Column } from './components/RecordTable';

const BaseColumns: Column[] = [
  {
    title: '星期',
    dataIndex: 'dateStr',
    render: (v) => {
      return '日一二三四五六'.charAt(new Date(v).getDay());
    },
  },
  {
    title: '是否为工作日',
    dataIndex: 'isWorkday',
    render: (v) => {
      return v ? '是' : '否';
    },
  },
  {
    title: '工作时长(小时)',
    dataIndex: 'workMillSeconds',
    render: (v) => {
      if (v === 0) {
        return '';
      }

      const { hour, minute } = format2hourMinute(v);
      return `${hour}小时${minute}分钟`;
    },
  },
  {
    title: '打卡开始',
    dataIndex: 'startStr',
    render: (v, row) => {
      const isAction = row.isPersonalLeave || row.isTagStartCheckIn || row.isAbsenteeism;

      return (
        <div
          style={{
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'space-between',
          }}
        >
          {!row.isTagStartCheckIn ? (
            v?.substring(11)
          ) : (
            <span
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="标记的打卡时间, 需要手动申请补卡哦"
              style={{ cursor: 'pointer' }}
            >
              <span
                style={{
                  color: 'red',
                }}
              >
                {v?.substring(11)}
              </span>
            </span>
          )}

          {isAction ? (
            <div>
              <Actions row={row} value={v} type="start" />
            </div>
          ) : null}
        </div>
      );
    },
  },
  {
    title: '打卡结束',
    dataIndex: 'endStr',
    style: {
      width: '250px',
    },
    render: (v, row) => {
      const isAction = row.isPersonalLeave || row.isTagEndCheckIn || row.isAbsenteeism;

      return (
        <div
          style={{
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'space-between',
          }}
        >
          {!row.isTagEndCheckIn ? (
            v?.substring(11)
          ) : (
            <span
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="标记的打卡时间, 需要手动申请补卡哦"
              style={{ cursor: 'pointer' }}
            >
              <span
                style={{
                  color: 'red',
                }}
              >
                {v?.substring(11)}
              </span>
            </span>
          )}

          {isAction ? (
            <div>
              <Actions row={row} value={v} type="end" />
            </div>
          ) : null}
        </div>
      );
    },
  },
  {
    title: '打卡记录',
    dataIndex: 'attendance',
    style: {
      width: '150px',
    },
    render: (v: Date[]) => {
      if (!v.length) {
        return '';
      }

      return (
        <details>
          <summary>详情</summary>
          {v
            .map((time) => {
              return new Date(time);
            })
            .map((date) => {
              return formatDate('hh:mm:ss', date);
            })
            .map((v) => {
              return (
                <>
                  {v} <br />
                </>
              );
            })}
        </details>
      );
    },
  },
];

const AbsenteeismColumns = [{ title: '缺勤详细', dataIndex: 'dateStr' }, ...BaseColumns];
const OvertimeColumns = [{ title: '加班详细', dataIndex: 'dateStr' }, ...BaseColumns];
const AllColumns = [{ title: '日期', dataIndex: 'dateStr' }, ...BaseColumns];

export { BaseColumns, AbsenteeismColumns, OvertimeColumns, AllColumns };
