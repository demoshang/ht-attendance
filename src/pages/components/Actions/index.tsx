import { formatDate } from '@/utils/date';
import { createSignal } from 'solid-js';
import 'solid-js/web';
import { updateTagCheckIn } from 'src/pages/tag-record/check-in';
import { TagRecord } from '../../tag-record';
import { updateLeaveList } from '../../tag-record/personal-leave';
import TimePicker from '../TimePicker';

enum ActionState {
  timePicker = 'timePicker',
  action = 'action',
  personalLeave = 'personalLeave',
}

interface Props {
  row: TagRecord;
  type: 'start' | 'end';
  value: string;
}

function fixTimeLen(v?: number, len = 2, fillString = '0') {
  if (v === undefined || v === null) {
    return undefined;
  }
  return `${v}`.padStart(len, fillString);
}

function getDefaultActionState({
  row: { isWorkday, isTagStartCheckIn, isTagEndCheckIn, start, end },
  type,
}: Props) {
  if (!isWorkday) {
    return { value: undefined, state: ActionState.action };
  }

  if (type === 'start') {
    return {
      value: [
        fixTimeLen(start?.getHours()),
        fixTimeLen(start?.getMinutes()),
        start && formatDate('hh:mm', start),
      ],
      state: isTagStartCheckIn ? ActionState.timePicker : ActionState.action,
    };
  }

  if (type === 'end') {
    return {
      value: [
        fixTimeLen(end?.getHours()),
        fixTimeLen(end?.getMinutes()),
        end && formatDate('hh:mm', end),
      ],
      state: isTagEndCheckIn ? ActionState.timePicker : ActionState.action,
    };
  }
}

const Actions = (props: Props) => {
  const [getState, setState] = createSignal(
    props.row.isPersonalLeave ? ActionState.personalLeave : ActionState.action,
  );

  const onClose = () => {
    setState(ActionState.action);
  };

  const onConfirm = (v: string) => {
    const r = { date: props.row.dateStr, type: props.type, value: v };
    updateTagCheckIn(r);

    setState(ActionState.action);
  };

  const onClear = () => {
    updateTagCheckIn({ date: props.row.dateStr, type: props.type, value: undefined });
  };

  return (
    <div>
      {getState() === ActionState.personalLeave ? (
        <button
          type="button"
          className="btn btn-sm btn-warning"
          onClick={() => {
            updateLeaveList(props.row.dateStr);
          }}
        >
          取消标记请假
        </button>
      ) : null}

      {getState() === ActionState.timePicker ? (
        <TimePicker
          {...{ value: getDefaultActionState(props)?.value, onClose, onConfirm, onClear }}
        />
      ) : null}

      {getState() === ActionState.action ? (
        <div
          style={{
            display: 'flex',
            'align-items': 'center',
          }}
        >
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => {
              setState(ActionState.timePicker);
            }}
          >
            标记时间
          </button>

          {props.row.isWorkday && !props.row.isTagStartCheckIn && !props.row.isTagEndCheckIn ? (
            <button
              type="button"
              className="btn btn-sm btn-warning"
              onClick={() => {
                updateLeaveList(props.row.dateStr);
              }}
            >
              {props.row.isPersonalLeave ? '取消标记请假' : '标记为请假'}
            </button>
          ) : null}

          {props.row.isWorkday && (props.row.isTagStartCheckIn || props.row.isTagEndCheckIn) ? (
            <button
              type="button"
              className="btn btn-sm btn-warning"
              onClick={() => {
                onClear();
              }}
            >
              清除标记打卡
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Actions;
