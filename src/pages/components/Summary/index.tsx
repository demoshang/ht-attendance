/* eslint-disable react/style-prop-object */
import 'solid-js/web';
import { subject } from 'src/pages/data-subject';
import { CalculateResult } from '../../calculate';
import { AbsenteeismColumns, AllColumns, OvertimeColumns } from '../../constants';
import Collapse from '../Collapse';
import RecordTable from '../RecordTable';

const Summary = ({ raw }: { raw: CalculateResult | undefined | null }) => {
  if (!raw) {
    return null;
  }

  const {
    restStr,
    realStr,
    needStr,
    todayStr,

    absenteeismList,
    absenteeismStr,

    overtimeList,
    overtimeStr,

    dayAttendances,
  } = raw;

  return (
    <div style="position: fixed; top:0; right: 0; bottom: 0; left: 0; overflow: scroll;    background-color: white; z-index: 999999; padding: 0 100px;">
      <div style="display: flex;justify-content: flex-end; position: fixed; top: 10px; right: 60px;">
        <button
          className="btn btn-secondary"
          onClick={() => {
            subject.next({ type: 'close' });
          }}
        >
          关闭
        </button>
      </div>
      <div
        className="row"
        style={{
          'margin-bottom': '10px',
          'margin-top': '20px',

          display: 'flex',
          'align-items': 'center',
        }}
      >
        <div className="col-3">
          月盈亏 <span style={{ fontSize: '14px' }}>( =实际工作 - 应该工作 )</span>
        </div>
        <div className="col text-primary" style={{ 'font-size': '30px' }}>
          {restStr}
        </div>
      </div>

      <div className="row">
        <div className="col-3">实际工作</div>
        <div className="col">{realStr}</div>
      </div>

      <div className="row">
        <div className="col-3">应该工作</div>
        <div className="col">{needStr}</div>
      </div>

      <div className="row">
        <div className="col-3">今日打卡</div>
        <div className="col">{todayStr}</div>
      </div>

      <Collapse
        {...{
          title: '缺勤',
          dateStr: absenteeismStr,
          rows: absenteeismList,
          columns: AbsenteeismColumns,
        }}
      />

      <Collapse
        {...{
          title: '加班',
          dateStr: overtimeStr,
          rows: overtimeList,
          columns: OvertimeColumns,
        }}
      />

      <RecordTable
        {...{
          rows: dayAttendances,
          columns: [...AllColumns],
        }}
      />
    </div>
  );
};

export default Summary;
