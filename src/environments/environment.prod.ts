export const environment = {
  production: true,
  configFile: 'assets/settingfolder/setting.json',
  apiUrl:'https://shaarolami-query.customs.mof.gov.il/',
  ReCaptcha: {
    jsUrl: 'https://www.google.com/recaptcha/api.js?render=explicit', // default
    siteKey: '6LcsWN4UAAAAAHsiBVkGFzwYBBOY7NPjsXP2SLAG'
  },
  baseUrls: {
    govscript: 'https://www.gov.il/',
    shaarolami: 'https://shaarolami-query.customs.mof.gov.il'
  }
}