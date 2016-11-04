import 'assets/style/nprogress.css';
import $ from 'jquery';
import _ from 'lodash';
import Helper from 'helper';
import JssdkHelper from 'jssdk-helper';
import fastclick from 'fastclick';
import 'whatwg-fetch';
import NProgress from 'nprogress';

/* 根据域名设置系统语言 */
const location = window.location;
const hostArr = location.host.split('.');
const hostName = hostArr.length === 4 ? location.host : hostArr[0];
const hostDomain = location.host.slice(hostName.length + 1);

/* 系统常量 */
const API_PATH = '/res/';
const LANG_TYPE = hostName.slice(0, 2) === 'tw' ? 'zh-tw' : 'zh-cn';
const CHANNEL_CODE = {
  channel_code: window.uhb_config.channel_code
};
const CHANNEL_NAME = {
  channel_name: window.uhb_config.channel_name
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

export {LANG_TYPE, CSRF_TOKEN, CHANNEL_CODE, CHANNEL_NAME, AREA_CODE, USER_AUTH};

// 记录语言cookie
Helper.setCookie('h5_uhb_language', LANG_TYPE, 365, {
  domain: hostDomain,
  path: '/'
});

// 自动处理REM单位
Helper.autoRootEM(375);

NProgress.configure({
  showSpinner: false,
  trickleRate: 0.1,
  trickleSpeed: 300,
  easing: 'ease'
});

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
let FetchCount = 0;
const Http = {
  count: 0,
  fetch: (uri, ...params) => {
    if (FetchCount++ === 0) NProgress.start();
    return fetch(API_PATH + uri, _.assign({body: formDataSource(...params)}, fetchSettings));
  },
  resolve: (response, resolve) => {
    if (--FetchCount === 0) NProgress.done();
    if (response.ok) {
      response.json().then(result => resolve(false, result));
    } else {
      resolve(true, response.statusText);
    };
  }
};

import shareLogo from 'assets/images/share_logo.jpg';
const WechatAPI = new JssdkHelper(API_PATH + 'api/wechat_config', _.assign({
  body: formDataSource({
    url: encodeURIComponent(location.href.split('#')[0])
  })
}, fetchSettings), {
  title: '游惠宝',
  desc: '游惠宝，分享世界美一刻！',
  link: location.href,
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

const HASH_CLICK = {};
const URL_RULES = [
  [/#!index/, '#/index'],
  [/#!search/, '#/search'],
  [/#!search\?key=/, '#/search/'],
  [/#!article\?tid=/, '#/news/'],
  [/#!coupon/, '#/coupon'],
  [/#!store\?id=/, '#/shop/'],
  [/#!ucenter/, '#/ucenter'],
  [/#!passport\/login/, '#/passport/signin'],
  [/#!passport\/register/, '#/passport/signup'],
  [/#!passport\/forget/, '#/passport/forget'],
  [/#!passport\/agreement/, '#/passport/privacy']
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

  for (let rule of URL_RULES) {
    let ruleStr = rule[0].source.replace(/\\/, '');
    if (hrefAttr.slice(0, ruleStr.length) === ruleStr) {
      location.href = hrefAttr.replace(rule[0], rule[1]);
      return;
    };
  };

  location.href = this.getAttribute('href').replace(/#!/, '/?channel=' + CHANNEL_CODE.channel_code + '&area=' + AREA_CODE.area_code + '#!');
});

fastclick.attach(document.body);

export {Http, WechatAPI, HASH_CLICK};
