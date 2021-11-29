import 'solid-js/web';
import { TagRecord } from '../../tag-record';

const MakeUpLeave = ({ leaveList }: { leaveList: TagRecord[] }) => {
  return (
    <div className="row">
      {leaveList.map(({ dateStr }) => {
        return <span>{dateStr}</span>;
      })}
    </div>
  );
};

export default MakeUpLeave;
