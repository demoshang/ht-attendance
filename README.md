# [亨通打卡统计](https://demoshang.github.io/ht-attendance/)

## 使用

[参照文档](https://demoshang.github.io/ht-attendance/)

## 开发

```bash
git clone
npm i
npm run build
# 复制 dist/index.js 到 chrome console 执行
```

## 说明

1. 忘记打卡和请假在打卡机上表现均为无打卡记录, 所以无法区分是 忘记还是请假, 导致最终时间 `月盈亏` 不正确

   > 比如, 每天工作 `8` 小时, 每天休息 `2` 小时  
   > 如果 请 假 1 天, 那月盈亏应该为 `-8` 小时  
   > 如果是忘记打卡,那月盈亏应该为 `-10` 小时  
   > 本程序直接 按照 -10 小时计算, 如果请假了,  
   > 请自行在月盈亏 _加上_ `请假天数 * 2小时`

2. 本程序`节假日`按照国家公布的`法定假日`来计算是否放假, 集团/公司有自己的假期`未适配`, 同时每年需要更新 `holidays.mjs` 文件来更新法定假日

3. 仅支持按月统计时长, 输入格式为 `YYYYMM`