/* eslint-disable react/style-prop-object */
import 'solid-js/web';
import { subject } from 'src/pages/data-subject';
import { CalculateResult } from '../../calculate';
import { AbsenteeismColumns, AllColumns, OvertimeColumns } from '../../constants';
import Collapse from '../Collapse';
import CollapseTable from '../CollapseTable';
import { MakeUpAbsenteeism } from '../MakeUpAbsenteeism';
import MakeUpLeave from '../MakeUpLeave';
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

  // 需要补卡
  const needBKList = dayAttendances.filter(
    ({ isPersonalLeave, isTagStartCheckIn, isTagEndCheckIn, isAbsenteeism, isWorkday }) => {
      // 请假
      if (isPersonalLeave) {
        return false;
      }

      // 手动标记需要补卡
      if (isTagStartCheckIn || isTagEndCheckIn) {
        return true;
      }

      // 未标记补卡, 但缺勤
      if (isWorkday && isAbsenteeism) {
        return true;
      }

      return false;
    },
  );

  // 需要请假
  const leaveList = dayAttendances.filter(({ isPersonalLeave }) => {
    return isPersonalLeave;
  });

  return (
    <div>
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

      <CollapseTable
        {...{
          key: 'absenteeism',
          title: '缺勤(未标记时间/请假)',
          dateStr: absenteeismStr,
          rows: absenteeismList,
          columns: AbsenteeismColumns,
        }}
      />

      <CollapseTable
        {...{
          key: 'overtime',
          title: '加班',
          dateStr: overtimeStr,
          rows: overtimeList,
          columns: OvertimeColumns,
        }}
      />

      {needBKList?.length ? (
        <div className="row">
          <div className="col-3">补卡</div>
          <div className="col">
            <Collapse
              title="请根据实际情况补卡"
              content={<MakeUpAbsenteeism needBKList={needBKList} />}
            />
          </div>
        </div>
      ) : null}

      {leaveList?.length ? (
        <div className="row">
          <div className="col-3">请假</div>
          <div className="col">
            <Collapse title="请根据实际情况请假" content={<MakeUpLeave leaveList={leaveList} />} />
          </div>
        </div>
      ) : null}

      <div
        style={{
          display: 'flex',
          width: '100%',
          'margin-top': '30px',
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
