import DefaultPage from "../classes/default-page";

export default class MasterRouteComponent extends DefaultPage {
  private view;
  private dataSorted;

  constructor(private backendService, private $filter, SweetAlert) {
    super(
      {},
      {id: null, name: null, additional_data: null},
      {},
      {SweetAlert: SweetAlert}
    );
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
      _this.backendService.saveRoute(_this.param, function () {
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
    _this.backendService.toggleRoute(item, function () {
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
      _this.backendService.removeRoute(item, function () {
        _this.reset();
        _this.loadData();
        _this.changeView('read');
      });
    });
  }

  changeView(view) {
    this.view = view;
  }

  exportExcel() {
    let _this = this;
    this.loading = true;
    this.backendService.exportRoute(function (resp) {
      _this.onExport(resp);
    });
  }

  sort() {
    super.sort();
    let _this = this;
    _this.dataSorted = _this.sortData(_this.$filter, 'name');
  }

  private loadData() {
    let _this = this;
    this.loading = true;
    this.backendService.getRoutes(function (resp) {
      _this.data = resp.data.data;
      _this.dataSorted = _this.sortData(_this.$filter, 'name');
      _this.loading = false;
    })
  }

  private validateForm() {
    this.resetError();
    if (this.param.name == null || this.param.name == "") this.addError('name', 'Rute tidak boleh kosong');
    if (this.param.additional_data.cost == null) this.addError('cost', 'Uang jalan tidak boleh kosong');
    if (this.param.additional_data.commission == null) this.addError('commission', 'Komisi tidak boleh kosong');
    return !this.isError();
  }

  static Factory() {
    return {
      controller: MasterRouteComponent,
      templateUrl: 'views/components/master.route.html'
    };
  }
}

MasterRouteComponent.$inject = ['backendService', '$filter', 'SweetAlert'];
