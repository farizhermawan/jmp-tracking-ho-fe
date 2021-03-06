import DefaultPage from "../classes/default-page";

export default class MasterKenekComponent extends DefaultPage {
  private view;
  private dataSorted;

  constructor(private backendService, private $filter, SweetAlert) {
    super(
      {},
      {id: null, name: null},
      {},
      {SweetAlert: SweetAlert}
    );
  }

  static Factory() {
    return {
      controller: MasterKenekComponent,
      templateUrl: 'views/components/master.kenek.html'
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
      _this.backendService.saveKenek(_this.param, function () {
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
    _this.backendService.toggleKenek(item, function () {
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
      _this.backendService.removeKenek(item, function () {
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
    _this.dataSorted = _this.sortData(_this.$filter, 'name');
  }

  private loadData() {
    let _this = this;
    this.loading = true;
    this.backendService.getKeneks(function (resp) {
      _this.data = resp.data.data;
      _this.dataSorted = _this.sortData(_this.$filter, 'name');
      _this.loading = false;
    })
  }

  private validateForm() {
    this.resetError();
    if (this.param.name == null || this.param.name == "") this.addError('name', 'Nama kenek tidak boleh kosong');
    return !this.isError();
  }
}

MasterKenekComponent.$inject = ['backendService', '$filter', 'SweetAlert'];
