import Constant from "../classes/constant";

export default class DataService {
  static API_URL = Constant.APP_URL;

  constructor(private http) {
  }

  get(path) {
    return this.http.get(DataService.API_URL + path);
  }

  post(path, payload) {
    return this.http.post(DataService.API_URL + path, payload);
  }

  put(path, payload) {
    return this.http.put(DataService.API_URL + path, payload);
  }

  delete(path) {
    return this.http.delete(DataService.API_URL + path);
  }
}

DataService.$inject = ['$http'];
