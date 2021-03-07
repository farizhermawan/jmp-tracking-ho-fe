const {version} = require('../../../package.json');

export default class Constant {
  static APP_VERSION  = version;
  static IS_LOCAL     = location.hostname == 'localhost';
  static BASE_DOMAIN  = Constant.IS_LOCAL ? "localhost" : ".jmp-logistic.co.id";
  static PROTOCOL     = Constant.IS_LOCAL ? "http:" : location.protocol;
  static API_HOST     = Constant.IS_LOCAL ? "localhost" : "api-" + location.hostname;
  static API_SUFFIX   = Constant.IS_LOCAL ? ":8000" : "";
  static UI_HOST      = Constant.IS_LOCAL ? "localhost" : location.hostname;
  static UI_SUFFIX    = Constant.IS_LOCAL ? ":3000" : "";
  static FRONTEND_URL = Constant.PROTOCOL + "//" + Constant.UI_HOST + Constant.UI_SUFFIX;
  static APP_URL      = Constant.PROTOCOL + "//" + Constant.API_HOST + Constant.API_SUFFIX;
  static APP_ENTITY   = "01";
  static BANK_ENTITY  = "02";
}
