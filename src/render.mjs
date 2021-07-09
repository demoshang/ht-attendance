function formatDate(fmt, date = new Date()) {
  let o = {
    "([yY]+)": date.getFullYear(),
    "(M+)": date.getMonth() + 1, // 月份
    "([dD]+)": date.getDate(), // 日
    "([hH]+)": date.getHours(), // 小时
    "(m+)": date.getMinutes(), // 分
    "(s+)": date.getSeconds(), // 秒
    "([qQ]+)": Math.floor((date.getMonth() + 3) / 3), // 季度
    "(S+)": date.getMilliseconds(), // 毫秒
  };
  Object.keys(o).forEach((key) => {
    if (new RegExp(key).test(fmt)) {
      // eslint-disable-next-line no-param-reassign
      fmt = fmt.replace(RegExp.$1, `00${o[key]}`.substr(-RegExp.$1.length));
    }
  });
  return fmt;
}

function table(arr, columns, rowAddFn, classPrefix = "ht-attendance") {
  const keys = columns.map(({ dataIndex }) => {
    return dataIndex;
  });

  return `
<table class="table table-bordered align-middle">
  <thead>
    <tr>
        ${columns
          .map(({ title }) => {
            return `<th scope="col">${title}</th>`;
          })
          .join("\n")}
    </tr>
  </thead>
  <tbody>

    ${arr
      .map((o, index) => {
        let str = "";
        if (rowAddFn) {
          str = rowAddFn(o, index, arr);
        }

        return `
      <tr ${str}>
        ${columns
          .map(({ dataIndex, render, width }) => {
            let style = "";
            if (width) {
              style = `style="width: ${width}px"`;
            }

            if (render) {
              return `<td ${style}>${render(o[dataIndex], o, arr, index)}</td>`;
            }

            return `<td ${style}>${o[dataIndex]}</td>`;
          })
          .join("\n")}
        `;
      })
      .join("</tr>\n")}
  </tbody>
</table>
        `;
}

function append(ele) {
  const heads = document.getElementsByTagName("head");
  if (heads.length) {
    heads[0].appendChild(ele);
  } else {
    document.documentElement.appendChild(ele);
  }
}

function addCss(url, { id } = {}) {
  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("href", url);
  append(link);
}

function addScript(url) {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", url);
  append(script);
}

function wrap2document(html, { id, className, tag = "div" } = {}) {
  let ele;
  let isCreate = false;
  if (id) {
    ele = document.querySelector(`#${id}`);
  }

  if (!ele) {
    ele = document.createElement(tag);
    isCreate = true;
  }

  if (className) {
    ele.classList.remove(className);
    ele.classList.add(className);
  }
  if (id) {
    ele.id = id;
  }
  ele.innerHTML = `
  <div style="display: flex;justify-content: flex-end;"><Button class="btn" onClick="document.body.removeChild(document.querySelector('#${id}'))"> 关闭 </Button></div>
  ${html}
  `;

  ele.style = `position: fixed; top:0; right: 0; bottom: 0; left: 0; overflow: scroll;    background-color: white; z-index: 999999; padding: 0 100px;`;

  if (isCreate) {
    document.body.appendChild(ele);
  }
}

function render(result, insert) {
  const cssId = "ht-attendance-bootstrap";

  if (!document.querySelector(`#${cssId}`)) {
    addCss(
      "https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.0.2/css/bootstrap.min.css",
      { id: cssId }
    );
  }

  const html = table(
    result.reverse(),
    [
      { title: "日期", dataIndex: "dateStr" },
      {
        title: "星期",
        dataIndex: "dateStr",
        render: (v) => {
          return "日一二三四五六".charAt(new Date(v).getDay());
        },
      },
      {
        title: "是否为工作日",
        dataIndex: "isWorkday",
        render: (v) => {
          return v ? "是" : "否";
        },
      },
      {
        title: "工作时长(小时)",
        dataIndex: "workMillSeconds",
        render: (v) => {
          if (v === 0) {
            return "";
          }

          const [h1, h2] = (v / (1 * 60 * 60 * 1000)).toFixed(2).split(".");

          return `${h1}小时${((parseInt(h2) * 60) / 100).toFixed(0)}分钟`;
        },
      },
      {
        title: "打卡开始",
        dataIndex: "startStr",
        render: (v) => {
          return v.substring(11);
        },
      },
      {
        title: "打卡结束",
        dataIndex: "endStr",
        render: (v) => {
          return v.substring(11);
        },
      },
      {
        title: "打卡记录",
        dataIndex: "attendance",
        width: 150,
        render: (v) => {
          if (!v.length) {
            return "";
          }

          return `
  <details>
  <summary>详情</summary>
  ${v
    .map((time) => {
      return new Date(time);
    })
    .map((date) => {
      return formatDate("hh:mm:ss", date);
    })
    .join("<br>")}
  </details>
        `;
        },
      },
    ],
    (item) => {
      if (item.workMillSeconds === 0 && item.isWorkday) {
        return `style="background: #EA868F"`;
      } else if (item.workMillSeconds === 0 && !item.isWorkday) {
        return `style="background: #F8F9FA"`;
      } else if (item.workMillSeconds < 10 * 60 * 60 * 1000) {
        return `style="background: #FFF3CD"`;
      }
    }
  );
  wrap2document(insert + "<br>" + html, { id: "ht-attendance" });
}

export { render };
