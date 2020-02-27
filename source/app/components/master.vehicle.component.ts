import DefaultPage from "../classes/default-page";

export default class MasterVehicleComponent extends DefaultPage {
  private view;
  private dataSorted;

  constructor(private backendService, private $filter, SweetAlert) {
    super(
      {vehicle_type: []},
      {id: null, police_number: null, additional_data: null},
      {},
      {SweetAlert: SweetAlert}
    );
  }

  static Factory() {
    return {
      controller: MasterVehicleComponent,
      templateUrl: 'views/components/master.vehicle.html'
    };
  }

  $onInit() {
    this.reset();
    this.changeView("read");
    this.loadData();
  }

  back() {
    this.reset();
    this.changeView('read');
  }

  submitForm() {
    let _this = this;
    if (!this.validateForm()) return;

    this.confirmSave(function (resp) {
      _this.loading = true;
      _this.backendService.saveVehicle(_this.param, function () {
        _this.reset();
        _this.loadData();
        _this.changeView('read');
      }, function () {
        _this.errorMsg("Error", "Gagal menyimpan data");
      });
    });
  }

  toggleRecord(item) {
    let _this = this;
    _this.loading = true;
    _this.backendService.toggleVehicle(item, function () {
      _this.loadData();
    }, function () {
      _this.errorMsg("Error", "Gagal menyimpan data");
    });
  }

  updateRecord(item) {
    this.changeView('create');
    this.selected = angular.copy(item);
    this.param = angular.copy(this.selected);
  }

  removeRecord(item) {
    let _this = this;
    this.confirmRemove(function () {
      _this.backendService.removeVehicle(item, function () {
        _this.reset();
        _this.loadData();
        _this.changeView('read');
      });
    });
  }

  changeView(view) {
    this.view = view;
  }

  sort() {
    super.sort();
    let _this = this;
    _this.dataSorted = _this.sortData(_this.$filter, 'police_number');
  }

  private loadData() {
    let _this = this;
    this.loading = true;
    this.backendService.getVehicles(function (resp) {
      _this.data = resp.data.data;
      _this.dataSorted = _this.sortData(_this.$filter, 'police_number');
      _this.loading = false;
    })
  }

  private validateForm() {
    this.resetError();
    if (this.param.police_number == null || this.param.police_number == "") this.addError('police_number', 'Nomor Polisi tidak boleh kosong');
    if (this.checkPoliceNumber()) this.addError('police_number', 'Nomor Polisi sudah terdaftar');
    return !this.isError();
  }

  private checkPoliceNumber() {
    let _this = this;
    let exist = false;
    angular.forEach(this.data, function (item, key) {
      if (_this.param.id == null && item.police_number == _this.param.police_number) exist = true;
      else if (_this.param.id != null && item.police_number == _this.param.police_number && item.police_number != _this.selected.police_number) exist = true;
    });
    return exist;
  }
}

MasterVehicleComponent.$inject = ['backendService', '$filter', 'SweetAlert'];
