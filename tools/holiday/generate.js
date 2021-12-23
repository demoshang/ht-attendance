// https://www.tianapi.com/apiview/139#apicode

const http = require('http');
const fs = require('fs');
const path = require('path');

async function getApiMonth(month) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'api.tianapi.com',
      port: null,
      path: `/jiejiari/index?key=59ce509019d1999958a86edf2056f5e5&date=2022-${month}&type=2`,
      headers: {
        'Content-Length': '0',
      },
    };

    const req = http.request(options, function (res) {
      const chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        const body = Buffer.concat(chunks);
        resolve(body.toString());
      });

      res.on('error', reject);
    });

    req.end();
  });
}

function parse(str) {
  const { newslist: list } = JSON.parse(str);

  return list
    .map(({ date, daycode, wage }) => {
      const when = new Date(date);

      const m = `${when.getMonth() + 1}`.padStart(2, '0');
      const month = `${when.getFullYear()}${m}`;
      const d = when.getDate();

      // 0表示工作日、为1节假日、为2双休日、3为调休日（上班）
      if (daycode === 1) {
        return {
          month,
          d,
          value: wage === 3 ? 2 : 1,
        };
      } else if (daycode === 2) {
        return {
          month,
          d,
          value: 1,
        };
      }

      return undefined;
    })
    .filter((v) => {
      return !!v;
    });
}

(async () => {
  const monthList = new Array(12).fill(null).map((_, index) => {
    return index + 1;
  });

  const list = await Promise.all(
    monthList.map((month) => {
      return getApiMonth(month).then((str) => {
        return parse(str);
      });
    }),
  );

  const result = list.flat().reduce((r, { month, d, value }) => {
    r[month] = r[month] ?? {};
    r[month][d] = value;

    return r;
  }, {});

  console.log('==================', result);

  fs.writeFileSync(path.resolve(__dirname, 'r.json'), JSON.stringify(result, null, 2));
})();
