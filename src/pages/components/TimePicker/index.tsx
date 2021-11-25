import { createSignal } from 'solid-js';
import 'solid-js/web';

function initValue([h, m, full]: (string | undefined)[] = []) {
  return [h ?? '00', m ?? '00', full];
}

const TimePicker = (props: {
  value?: (string | undefined)[];
  onClose: () => void;
  onConfirm: (value: string) => void;
  onClear: () => void;
}) => {
  const [getValue, setValue] = createSignal<(string | undefined)[]>(initValue(props.value));

  const hourList = new Array(24).fill(0).map((_, index) => {
    const value = `${index}`.padStart(2, '0');

    return {
      value,
      label: value,
    };
  });

  const minuteList = new Array(60).fill(0).map((_, index) => {
    const value = `${index}`.padStart(2, '0');

    return {
      value,
      label: value,
    };
  });

  const handleValueChange = (index: number, e: Event) => {
    const target = e.target as HTMLSelectElement | null;

    const value = target?.value;

    console.log('==============handleValueChange====', { index, value, e });

    if (value === undefined || value === null) {
      return;
    }

    const arr = [...getValue()];
    arr[index] = value;

    if (arr[0] && arr[1]) {
      arr[2] = `${arr[0]}:${arr[1]}`;
    }

    console.log('===========handleValueChange result=======', arr);

    setValue(arr);
  };

  const handleConfirm = () => {
    const arr = [...getValue()];
    if (arr[2]) {
      props.onConfirm(arr[2]);
    }
  };

  const handleClear = () => {
    props.onClear();
  };

  return (
    <div>
      <div style={{ 'align-items': 'center', display: 'flex' }}>
        <select
          className="form-control"
          style={{
            width: '45px',
            'font-size': '16px',
          }}
          value={props.value?.[0]}
          onChange={[handleValueChange, 0]}
        >
          {hourList.map(({ label, value }) => {
            return <option value={value}>{label}</option>;
          })}
        </select>

        <span>&nbsp;:&nbsp;</span>

        <select
          className="form-control"
          style={{
            width: '45px',
            'font-size': '16px',
          }}
          value={props.value?.[1]}
          onChange={[handleValueChange, 1]}
        >
          {minuteList.map(({ label, value }) => {
            return <option value={value}>{label}</option>;
          })}
        </select>

        <button type="button" className="btn btn-sm btn-primary" onClick={handleConfirm}>
          确定
        </button>

        <button
          type="button"
          className="btn btn-sm"
          onClick={() => {
            props.onClose();
          }}
        >
          取消
        </button>

        <button type="button" className="btn btn-sm btn-primary" onClick={handleClear}>
          清除
        </button>
      </div>
    </div>
  );
};

export default TimePicker;
