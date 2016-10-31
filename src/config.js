import $ from 'jquery';
import _ from 'lodash';
import Helper from 'helper';
import JssdkHelper from 'jssdk-helper';
import fastclick from 'fastclick';
import shareLogo from 'assets/images/share_logo.jpg';
import 'whatwg-fetch';

/* 根据域名设置系统语言 */
const hostArr = location.host.split('.');
const hostName = hostArr.length === 4 ? location.host : hostArr[0];
const hostDomain = location.host.slice(hostName.length + 1);

/* 系统常量 */
const HOME_URL = location.href.split('#')[0];
const API_PATH = '/res/';
const LANG_TYPE = hostName.slice(0, 2) === 'tw' ? 'zh-tw' : 'zh-cn';
const CHANNEL_CODE = {
  channel_code: window.uhb_config.channel_code
};
const AREA_CODE = {
  area_code: window.uhb_config.area_code
};
const USER_AUTH = {
  user_auth: window.uhb_config.auth.slice(15, 16) === 'y'
};
const CSRF_TOKEN = {};

// 根据CSRF Meta得到CSRF密钥
if (location.hostname !== 'localhost' && document.querySelector('meta[name="csrf-param"]') !== null) CSRF_TOKEN[document.querySelector('meta[name="csrf-param"]').content] = document.querySelector('meta[name="csrf-token"]').content;

const fetchSettings = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  credentials: 'include'
};
const formDataSource = (...params) => {
  const query = _.assign({}, CSRF_TOKEN, ...params);
  const data = [];

  for (let key in query) {
    if (query[key] !== undefined) data.push(key + '=' + query[key]);
  };

  return data.join('&');
};
const Http = {
  fetch: (uri, ...params) => {
    return fetch(API_PATH + uri, _.assign({body: formDataSource(...params)}, fetchSettings));
  }
};

export {Http, LANG_TYPE, CHANNEL_CODE, AREA_CODE, USER_AUTH};
export {$, _, Helper};

const WechatAPI = new JssdkHelper(API_PATH + 'api/wechat_config', _.assign({body: formDataSource({url: HOME_URL})}, fetchSettings), {
  title: '游惠宝',
  desc: '游惠宝，分享世界美一刻！',
  link: HOME_URL,
  imgUrl: shareLogo,
  callback: {
    success: function(a) {
      Http.fetch('api/sharelog', {
        share_title: WechatAPI.getState('title'),
        url: WechatAPI.getState('link'),
        share_way: 1
      }, CHANNEL_CODE);
    }
  }
}, {
  api: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'showOptionMenu', 'hideOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'scanQRCode'],
  showItem: ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:QZone', 'menuItem:favorite', 'menuItem:openWithSafari', 'menuItem:copyUrl']
});

export {WechatAPI};

// 自动处理REM单位
Helper.autoRootEM(375);

// 记录语言cookie
Helper.setCookie('h5_uhb_language', LANG_TYPE, 365, {
  domain: hostDomain,
  path: '/'
});

const HASH_CLICK = {};

const urlRules = [
  [/#!index/, '#/index'],
  [/#!search/, '#/search'],
  [/#!search\?key=/, '#/search/'],
  [/#!article\?tid=/, '#/news/'],
  [/#!coupon/, '#/coupon'],
  [/#!store\?id=/, '#/shop/']
];

// 临时性hash地址重定向
$(document.body).on('click', 'a[href^="#!"]', function(evt) {
  evt.preventDefault();

  if (!evt.target.dataset.hash) {
    for (let uuid in HASH_CLICK) {
      if (HASH_CLICK[uuid] === true) return;
    };
  };

  const hrefAttr = this.getAttribute('href');

  for (let rule of urlRules) {
    let ruleStr = rule[0].source.replace(/\\/, '');
    if (hrefAttr.slice(0, ruleStr.length) === ruleStr) {
      window.location.href = hrefAttr.replace(rule[0], rule[1]);
      return;
    };
  };

  window.location.href = this.getAttribute('href').replace(/#!/, '/?channel=' + CHANNEL_CODE.channel_code + '&area=' + AREA_CODE.area_code + '#!');
});

fastclick.attach(document.body);

export {HASH_CLICK};
