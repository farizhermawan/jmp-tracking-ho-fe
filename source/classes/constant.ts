export default class Constant {

  static BASE_DOMAIN = location.hostname == 'localhost'
    ? "localhost"
    : ".jmp-logistic.co.id";

  static FRONTEND_URL = location.hostname == 'localhost'
    ? "http://localhost:3000"
    : location.protocol + "//" + location.hostname;


  static APP_URL = location.hostname == 'localhost'
    ? "http://localhost:8000"
    : location.protocol + "//" + location.hostname + "/service";

  static APP_ENTITY = "01";
}