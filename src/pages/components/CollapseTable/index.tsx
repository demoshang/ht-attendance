import 'solid-js/web';
import { TagRecord } from '../../tag-record';
import RecordTable, { Column } from '../RecordTable';

const CollapseTable = ({
  key,
  title,
  dateStr,
  rows,
  columns,
}: {
  key: string;
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
          data-bs-target={`#${key}`}
          aria-expanded="false"
          aria-controls={key}
        >
          {dateStr?.split(',')?.map((v) => {
            return <>{v}&nbsp;&nbsp;</>;
          })}
        </div>
        <div className="collapse" id={key}>
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

export default CollapseTable;
