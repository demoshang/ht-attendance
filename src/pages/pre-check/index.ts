import { checkLibLoad } from './lib';
import { addStyle } from './style';
import { checkUrl } from './url';

checkLibLoad();
addStyle();

if (NODE_ENV === 'production') {
  checkUrl();
}
