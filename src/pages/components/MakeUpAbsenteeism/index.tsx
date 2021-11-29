import { formatDate } from '@/utils/date';
import 'solid-js/web';
import { TagRecord } from '../../tag-record';

const MakeUpAbsenteeism = ({ needBKList }: { needBKList: TagRecord[] }) => {
  return (
    <div className="row">
      {needBKList.map(({ dateStr, isTagStartCheckIn, start, isTagEndCheckIn, end }) => {
        let list = [];

        if (!start || start.getHours() > 10) {
          list.push(`${dateStr} 早上`);
        } else if (isTagStartCheckIn) {
          list.push(formatDate('YYYY-MM-DD HH:mm:ss', start));
        }

        if (!end || end.getHours() < 10) {
          list.push(`${dateStr} 晚上`);
        } else if (isTagEndCheckIn) {
          list.push(formatDate('YYYY-MM-DD HH:mm:ss', end));
        }

        return <div>{list.join('~~')}</div>;
      })}
    </div>
  );
};

export { MakeUpAbsenteeism };
