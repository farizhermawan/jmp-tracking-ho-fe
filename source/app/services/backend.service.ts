import Constant from "../classes/constant";

export default class BackendService {
  static API_URL = Constant.APP_URL + "/api";

  constructor(private http) {
  }

  // Dashboard and Other Common Service
  getDashboard(successCallback) {
    this.http.get(BackendService.API_URL + '/dashboard/info').then(successCallback);
  }

  getRitasi(param, successCallback) {
    this.http.get(BackendService.API_URL + '/dashboard/ritasi?date=' + param).then(successCallback);
  }

  getMonitor(params, successCallback) {
    this.http.post(BackendService.API_URL + '/monitor', params).then(successCallback);
  }

  // Master Data Vehicle
  getVehicles(successCallback) {
    this.http.get(BackendService.API_URL + '/vehicle').then(successCallback);
  }

  saveVehicle(data, successCallback, errCallback) {
    this.http.post(BackendService.API_URL + '/vehicle/' + (data.id == null ? 'add' : 'update'), data).then(successCallback, errCallback);
  }

  toggleVehicle(data, successCallback) {
    this.http.post(BackendService.API_URL + '/vehicle/toggle', data).then(successCallback);
  }

  removeVehicle(data, successCallback) {
    this.http.post(BackendService.API_URL + '/vehicle/remove', data).then(successCallback);
  }

  // Master Data Driver
  getDrivers(successCallback) {
    this.http.get(BackendService.API_URL + '/driver').then(successCallback);
  }

  saveDriver(data, successCallback, errCallback) {
    this.http.post(BackendService.API_URL + '/driver/' + (data.id == null ? 'add' : 'update'), data).then(successCallback, errCallback);
  }

  toggleDriver(data, successCallback) {
    this.http.post(BackendService.API_URL + '/driver/toggle', data).then(successCallback);
  }

  removeDriver(data, successCallback) {
    this.http.post(BackendService.API_URL + '/driver/remove', data).then(successCallback);
  }

  // Master Data Kenek
  getKeneks(successCallback) {
    this.http.get(BackendService.API_URL + '/kenek').then(successCallback);
  }

  saveKenek(data, successCallback, errCallback) {
    this.http.post(BackendService.API_URL + '/kenek/' + (data.id == null ? 'add' : 'update'), data).then(successCallback, errCallback);
  }

  toggleKenek(data, successCallback) {
    this.http.post(BackendService.API_URL + '/kenek/toggle', data).then(successCallback);
  }

  removeKenek(data, successCallback) {
    this.http.post(BackendService.API_URL + '/kenek/remove', data).then(successCallback);
  }

  // Master Data User
  getUsers(successCallback) {
    this.http.get(BackendService.API_URL + '/user').then(successCallback);
  }

  saveUser(data, successCallback, errCallback) {
    this.http.post(BackendService.API_URL + '/user/' + (data.id == null ? 'add' : 'update'), data).then(successCallback, errCallback);
  }

  toggleUser(data, successCallback) {
    this.http.post(BackendService.API_URL + '/user/toggle', data).then(successCallback);
  }

  removeUser(data, successCallback) {
    this.http.post(BackendService.API_URL + '/user/remove', data).then(successCallback);
  }

  // Master Data Route
  getRoutes(successCallback) {
    this.http.get(BackendService.API_URL + '/route').then(successCallback);
  }

  saveRoute(data, successCallback, errCallback) {
    this.http.post(BackendService.API_URL + '/route/' + (data.id == null ? 'add' : 'update'), data).then(successCallback, errCallback);
  }

  toggleRoute(data, successCallback) {
    this.http.post(BackendService.API_URL + '/route/toggle', data).then(successCallback);
  }

  removeRoute(data, successCallback) {
    this.http.post(BackendService.API_URL + '/route/remove', data).then(successCallback);
  }

  // Master Data Customer
  getCustomers(successCallback) {
    this.http.get(BackendService.API_URL + '/customer').then(successCallback);
  }

  saveCustomer(data, successCallback, errCallback) {
    this.http.post(BackendService.API_URL + '/customer/' + (data.id == null ? 'add' : 'update'), data).then(successCallback, errCallback);
  }

  toggleCustomer(data, successCallback) {
    this.http.post(BackendService.API_URL + '/customer/toggle', data).then(successCallback);
  }

  removeCustomer(data, successCallback) {
    this.http.post(BackendService.API_URL + '/customer/remove', data).then(successCallback);
  }

  // Other
  getEntities(successCallback) {
    this.http.get(BackendService.API_URL + '/entity').then(successCallback);
  }

  getUndirectList(successCallback) {
    this.http.get(BackendService.API_URL + '/undirect-list').then(successCallback);
  }

  // Finance Related
  getBallance(entity, successCallback) {
    this.http.get(BackendService.API_URL + '/ballance/' + entity).then(successCallback);
  }

  getFinance(data, successCallback) {
    this.http.post(BackendService.API_URL + '/finance', data).then(successCallback);
  }

  addBallance(data, successCallback, errCallback) {
    this.http.post(BackendService.API_URL + '/ballance/add', data).then(successCallback, errCallback);
  }

  // Transaction Related
  getTransaksi(data, successCallback) {
    this.http.post(BackendService.API_URL + '/transaksi', data).then(successCallback);
  }

  getVehicleCost(data, successCallback) {
    this.http.post(BackendService.API_URL + '/vehicle-cost', data).then(successCallback);
  }

  getUndirectCost(data, successCallback) {
    this.http.post(BackendService.API_URL + '/undirect-cost', data).then(successCallback);
  }

  getJot(data, successCallback) {
    this.http.post(BackendService.API_URL + '/jot/view', data).then(successCallback);
  }

  validateJot(data, successCallback) {
    this.http.post(BackendService.API_URL + '/jot/validation', data).then(successCallback);
  }

  saveJotTransaction(data, successCallback, errCallback) {
    this.http.post(BackendService.API_URL + '/jot/submit', data).then(successCallback, errCallback);
  }

  reviseJotTransaction(data, successCallback, errCallback) {
    this.http.post(BackendService.API_URL + '/jot/revise', data).then(successCallback, errCallback);
  }

  updateJotTransaction(data, successCallback, errCallback) {
    this.http.post(BackendService.API_URL + '/jot/update', data).then(successCallback, errCallback);
  }

  adjustJotTransaction(data, successCallback, errCallback) {
    this.http.post(BackendService.API_URL + '/jot/adjust', data).then(successCallback, errCallback);
  }

  saveVehicleCost(data, successCallback, errCallback) {
    this.http.post(BackendService.API_URL + '/vehicle-cost/submit', data).then(successCallback, errCallback);
  }

  saveUndirectCost(data, successCallback, errCallback) {
    this.http.post(BackendService.API_URL + '/undirect-cost/submit', data).then(successCallback, errCallback);
  }

  searchContainerIds(data, successCallback) {
    this.http.post(BackendService.API_URL + '/jot/search', data).then(successCallback);
  }

  removeJotTransaction(data, successCallback) {
    this.http.post(BackendService.API_URL + '/jot/remove', data).then(successCallback);
  }

  removeVehicleCost(data, successCallback) {
    this.http.post(BackendService.API_URL + '/vehicle-cost/remove', data).then(successCallback);
  }

  removeUndirectCost(data, successCallback) {
    this.http.post(BackendService.API_URL + '/undirect-cost/remove', data).then(successCallback);
  }

  // Auth Related
  callbackLogin(data, successCallback) {
    this.http.post(BackendService.API_URL + '/auth/callback', data).then(successCallback);
  }

  savedAuth(data, successCallback) {
    this.http.post(BackendService.API_URL + '/auth/saved', data).then(successCallback);
  }

  getProfile(successCallback) {
    this.http.get(BackendService.API_URL + '/auth/profile').then(successCallback);
  }

  // Export Related
  exportRoute(successCallback) {
    this.http.post(BackendService.API_URL + '/export/route').then(successCallback);
  }

  exportVehicle(successCallback) {
    this.http.post(BackendService.API_URL + '/export/vehicle').then(successCallback);
  }

  exportDriver(successCallback) {
    this.http.post(BackendService.API_URL + '/export/driver').then(successCallback);
  }

  exportEmployee(successCallback) {
    this.http.post(BackendService.API_URL + '/export/employee').then(successCallback);
  }

  exportUser(successCallback) {
    this.http.post(BackendService.API_URL + '/export/user').then(successCallback);
  }

  exportFinance(data, successCallback) {
    this.http.post(BackendService.API_URL + '/export/finance', data).then(successCallback);
  }

  exportTransaksi(data, successCallback) {
    this.http.post(BackendService.API_URL + '/export/transaksi', data).then(successCallback);
  }

  exportTransaksiDetail(data, successCallback) {
    this.http.post(BackendService.API_URL + '/export/transaksi-detail', data).then(successCallback);
  }

  exportVehicleCost(data, successCallback) {
    this.http.post(BackendService.API_URL + '/export/vehicle-cost', data).then(successCallback);
  }

  exportUndirectCost(data, successCallback) {
    this.http.post(BackendService.API_URL + '/export/undirect-cost', data).then(successCallback);
  }

  exportVehicleCostReport(data, successCallback) {
    this.http.post(BackendService.API_URL + '/export/vehicle-cost-report', data).then(successCallback);
  }

}

BackendService.$inject = ['$http'];
