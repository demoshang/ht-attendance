import { checkLibLoad } from './lib';
import { addStyle } from './style';
import { checkUrl } from './url';

if (NODE_ENV === 'production') {
  if (!checkUrl()) {
    throw new Error('不支持当前网站');
  }

  checkLibLoad();
  addStyle();
}

checkLibLoad();
addStyle();
