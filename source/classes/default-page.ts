import Constant from "./constant";

export default class DefaultPage {

  protected list;
  protected param;
  protected data;
  protected selected;
  protected loading;
  protected error;
  protected defaultIfEmpty;
  protected defaultLimit;
  protected sortState;

  private defaultParam;
  private alert;
  private current_ballance;
  private remaining_ballance;
  private total_cost;

  constructor(list, param, data, plugins) {
    this.list = list;
    this.param = param;
    this.defaultParam = angular.copy(param);
    this.data = data;
    this.selected = null;
    this.loading = false;
    this.error = {};
    this.defaultIfEmpty = "";

    this.alert = plugins['SweetAlert'];
    this.current_ballance = 0;
    this.remaining_ballance = 0;
    this.defaultLimit = 1000000;
    this.sortState = 0;
  }

  protected sort() {
    if (!this.isSorted()) this.sortState = 1;
    else if (this.sortState == 1) this.sortState = -1;
    else this.sortState = 0;
  }

  protected isSorted() {
    return this.sortState != 0;
  }

  protected getSortState() {
    if (!this.isSorted()) return 'sort text-gray';
    return this.sortState == 1 ? 'sort-asc' : 'sort-desc';
  }

  protected isBallanceEnough(){
    return this.remaining_ballance >= 0;
  }

  protected isBallanceZero(){
    return this.remaining_ballance == 0;
  }

  protected isBallanceNearlyLimit(){
    return this.isBallanceEnough() && this.isBallanceZero() == false && this.remaining_ballance <= this.defaultLimit;
  }

  protected setBallance(ballance, cost){
    this.current_ballance = ballance;
    this.total_cost = cost;
    this.remaining_ballance = this.current_ballance - this.total_cost;
  }

  protected setCost(cost){
    this.total_cost = cost;
    this.remaining_ballance = this.current_ballance - this.total_cost;
  }

  protected reset() {
    this.param = angular.copy(this.defaultParam);
    this.loading = false;
    this.resetError();
  }

  protected addError(id, message) {
    this.error[id] = message;
  }

  protected resetError() {
    this.error = {};
  }

  protected hasError(id) {
    return this.error.hasOwnProperty(id);
  }

  protected isError() {
    return !angular.equals(this.error, {});
  }

  protected confirmMessage(title, text, onConfirm, onCancel = this.doNothing) {
    this.alert.swal({
      title: title,
      text: text,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      closeOnConfirm: true
    }, function(isConfirm){
      if(isConfirm) onConfirm();
      else onCancel();
    });
  }

  protected confirmSave(onConfirm, onCancel = this.doNothing) {
    this.confirmMessage("Simpan Data", "Pastikan semua data yang kamu masukan sudah benar!", onConfirm, onCancel);
  }

  protected confirmRemove(onConfirm, onCancel = this.doNothing) {
    this.confirmMessage("Hapus Data", "Data yang sudah dihapus tidak bisa dikembalikan!", onConfirm, onCancel);
  }

  protected inputBox(title, text, onSubmit) {
    this.alert.swal({
      title: title,
      text: text,
      type: "input",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      closeOnConfirm: true
    }, function(input){
      onSubmit(input);
    });
  }

  protected successMsg(title, message) {
    this.alert.swal(title, message, "success");
  }

  protected errorMsg(title, message) {
    this.alert.swal(title, message, "error");
  }

  protected infoMsg(title, message) {
    this.alert.swal(title, message, "info");
  }

  protected onExport(resp) {
    this.loading = false;
    if (resp.data.message == "success") {
      location.href = Constant.APP_URL + "/download/" + resp.data.hash;
    }
    else {
      this.errorMsg("Error!", "Aplikasi gagal membuat laporan yang anda minta.");
    }
  }

  private doNothing() {}
}
