import type { JSX } from 'solid-js/jsx-runtime';
import 'solid-js/web';

const Collapse = ({ title, content }: { title: string; content?: string | JSX.Element }) => {
  const id = `collapse-${Math.random().toString(36).slice(2)}`;

  return (
    <div>
      <div
        style={{
          padding: 0,
        }}
        className="btn btn-link text-danger"
        data-bs-toggle="collapse"
        data-bs-target={`#${id}`}
        aria-expanded="false"
        aria-controls="absenteeismCollapse"
      >
        {title}
      </div>
      <div className="collapse row" id={id}>
        {content}
      </div>
    </div>
  );
};

export default Collapse;
