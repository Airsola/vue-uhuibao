import Helper from 'helper';
import {Http, translate} from 'methods';
import message from '../../plugins/message/index';

const language = translate({
  'zh-cn': {
    noTypePhoneNumber: '嘿，要先输入手机号码！',
    phoneNumberError: '亲，手机号码写错了，改一改！',
    noTypePassword: '嘿，你还没有输入密码！',
    passwordLengthError: '密码的长度为6-16位字符！',
    noTypeConfirmPassword: '请再次输入确认密码！',
    passwordDiff: '两次密码不一样啊！',
    noTypeVerifyCode: '请输入短信验证码！',
    verifyCodeError: '验证码为四位数字'
  },
  'zh-tw': {
    noTypePhoneNumber: '嘿，要先輸入手機號碼！',
    phoneNumberError: '親，手機號碼寫錯了，改一改！',
    noTypePassword: '嘿，你還沒有輸入密碼！ ',
    passwordLengthError: '密碼的長度為6-16位字符！',
    noTypeConfirmPassword: '請再次輸入確認密碼！',
    passwordDiff: '兩次密碼不一樣啊！',
    noTypeVerifyCode: '請輸入短信驗證碼！',
    verifyCodeError: '驗證碼為四位數字'
  }
});
const TWPhoneRegex = new RegExp('^09(\\d{8})$');
const isTWPhone = (string) => {
  return TWPhoneRegex.test(string);
};

const isTelphone = (telphone) => Helper.is('cell', telphone) || isTWPhone(telphone);

const checkTelphone = (telphone) => {
  if (!telphone) {
    message(language.noTypePhoneNumber);
    return false;
  } else if (!isTelphone(telphone)) {
    message(language.phoneNumberError);
    return false;
  } else {
    return true;
  }
};

const checkPassword = (password) => {
  if (!password) {
    message(language.noTypePassword);
    return false;
  } else if (password.length < 6 || password.length > 16) {
    message(language.passwordLengthError);
    return false;
  } else {
    return true;
  }
};

const checkRepassword = (password, repassword) => {
  if (!checkPassword(password)) return false;
  if (!repassword) {
    message(language.noTypeConfirmPassword);
    return false;
  } else if (password !== repassword) {
    message(language.passwordDiff);
    return false;
  } else {
    return true;
  }
};

const checkVerifycode = (verifycode) => {
  if (!verifycode) {
    message(language.noTypeVerifyCode);
    return false;
  } else if (verifycode.length !== 4) {
    message(language.verifyCodeError);
    return false;
  } else {
    return true;
  }
};

export {isTelphone, checkTelphone, checkPassword, checkRepassword, checkVerifycode};

const sginInAction = (mobile, password, callback) => {
  Http.fetch('api/check_login', {mobile, password}).then(response => callback(response));
};

const sendMsgAction = (mobile, type, callback) => {
  Http.fetch('api/send_code', {mobile, type}).then(response => callback(response));
};

const checkCodeAction = (mobile, code, type, callback) => {
  Http.fetch('api/check_code', {mobile, code, type}).then(response => callback(response));
};

const resetPasswordAction = (password, callback) => {
  Http.fetch('api/reset_pwd', {password}).then(response => callback(response));
};

const setPasswordAction = (password, callback) => {
  Http.fetch('api/register', {password}).then(response => callback(response));
};

export {sginInAction, sendMsgAction, checkCodeAction, setPasswordAction, resetPasswordAction};

const Language = {
  verifycode: {
    'zh-cn': {
      typeVerifyCode: '请输入验证码',
      getVerifyCode: '获取验证码',
      verifyCodeSending: '验证信息发送中…',
      waitSendVerifyCodeAgain: '秒后重新获取',
      codeVerifying: '验证中…',
      verifyCodeSendSuccess: '验证信息已经发送至该手机号码'
    },
    'zh-tw': {
      typeVerifyCode: '請輸入驗證碼',
      getVerifyCode: '獲取驗證碼',
      verifyCodeSending: '驗證信息發送中…',
      waitSendVerifyCodeAgain: '秒後重新獲取',
      codeVerifying: '驗證中…',
      verifyCodeSendSuccess: '驗證信息已經發送至該手機號碼'
    }
  },
  signin: {
    'zh-cn': {
      typePhoneNumber: '请输入手机号',
      typePassword: '请输入密码',
      forgotPassword: '忘记登录密码',
      signIn: '登录',
      signIng: '登录中…',
      signUp: '注册',
      signInEorror: '您输入的账号或密码不正确！'
    },
    'zh-tw': {
      typePhoneNumber: '請輸入手機號',
      typePassword: '請輸入密碼',
      forgotPassword: '忘記登錄密碼',
      signIn: '登錄',
      signIng: '登錄中…',
      signUp: '註冊',
      signInEorror: '您輸入的賬號或密碼不正確！'
    }
  },
  signup: {
    'zh-cn': {
      typePhoneNumber: '请输入手机号',
      signIn: '登录',
      nextStep: '立即注册'
    },
    'zh-tw': {
      typePhoneNumber: '請輸入手機號',
      signIn: '登錄',
      nextStep: '立即註冊'
    }
  },
  signupNext: {
    'zh-cn': {
      typePassword: '请输入密码',
      typePasswordAgain: '请再次输入密码',
      setPasspord: '设置密码',
      signUpSuccess: ['注册成功，', '秒后返回登录！'],
      passwordSaveIng: '密码设置中…',
      noAgreePrivacy: '要先同意用户注册协议的！'
    },
    'zh-tw': {
      typePassword: '請輸入密碼',
      typePasswordAgain: '請再次輸入密碼',
      setPasspord: '設置密碼',
      signUpSuccess: ['註冊成功，', '秒後返回登錄！'],
      passwordSaveIng: '密碼設置中…',
      noAgreePrivacy: '要先同意用戶註冊協議的！'
    }
  },
  forgot: {
    'zh-cn': {
      typePhoneNumber: '请输入手机号',
      signIn: '登录',
      nextStep: '下一步'
    },
    'zh-tw': {
      typePhoneNumber: '請輸入手機號',
      signIn: '登錄',
      nextStep: '下一步'
    }
  },
  forgotNext: {
    'zh-cn': {
      typePassword: '请输入密码',
      typePasswordAgain: '请再次输入密码',
      resetPassword: '重置密码',
      resetSuccess: ['密码重置成功，', '秒后返回登录！'],
      passwordSaveIng: '密码重置中…'
    },
    'zh-tw': {
      typePassword: '請輸入密碼',
      typePasswordAgain: '請再次輸入密碼',
      resetPassword: '重置密碼',
      resetSuccess: ['密碼重置成功，', '秒後返回登錄！'],
      passwordSaveIng: '密碼重置中…'
    }
  }
};

export {Language};
