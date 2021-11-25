import 'solid-js/web';
import { TagRecord } from '../../tag-record';
import RecordTable, { Column } from '../RecordTable';

const Collapse = ({
  title,
  dateStr,
  rows,
  columns,
}: {
  title: string;
  dateStr: string;
  rows: TagRecord[];
  columns: Column[];
}) => {
  return (
    <div className="row">
      <div className="col-3">{title}</div>
      <div className="col">
        {rows?.length ? '' : dateStr}
        <div
          style={{
            padding: 0,
            display: rows?.length ? 'inline-block' : 'none',
          }}
          className="btn btn-link text-danger"
          data-bs-toggle="collapse"
          data-bs-target="#absenteeismCollapse"
          aria-expanded="false"
          aria-controls="absenteeismCollapse"
        >
          {dateStr?.split(',')?.map((v) => {
            return <>{v}&nbsp;&nbsp;</>;
          })}
        </div>
        <div className="collapse" id="absenteeismCollapse">
          <RecordTable
            {...{
              rows,
              columns,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Collapse;
