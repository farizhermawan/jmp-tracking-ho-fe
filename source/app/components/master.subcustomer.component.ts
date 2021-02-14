import DefaultPage from "../classes/default-page";

export default class MasterSubCustomerComponent extends DefaultPage {
  private view;
  private dataSorted;

  constructor(private dataService, private $filter, SweetAlert) {
    super(
      {},
      {id: null, name: null, additional_data: null},
      {},
      {SweetAlert: SweetAlert}
    );
  }

  static Factory() {
    return {
      controller: MasterSubCustomerComponent,
      templateUrl: 'views/components/master.subcustomer.html'
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

    _this.loading = true;

    if (_this.param.id === null) {
      _this.dataService.post('/v1/sub-customers', _this.param).then(function () {
        _this.changeView('read');
        _this.loadData();
      }, function () {
        _this.errorMsg("Error", "Gagal menyimpan data");
      });
    } else {
      this.confirmSave(function (resp) {
        _this.dataService.put('/v1/sub-customers/' + _this.param.id, _this.param).then(function () {
          _this.changeView('read');
          _this.loadData();
        }, function () {
          _this.errorMsg("Error", "Gagal menyimpan data");
        });
      });
    }
  }

  toggleRecord(item) {
    let _this = this;
    _this.loading = true;
    _this.dataService.put('/v1/sub-customers/' + item.id, {'flag_active': !item.flag_active}).then(function () {
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
      _this.dataService.delete('/v1/sub-customers/' + item.id).then(function () {
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

  exportExcel() {
    var _this = this;
    this.loading = true;
    this.dataService.post("/v1/sub-customers/export", this.param).then(function (resp) {
      _this.onExport(resp);
    });
  }

  private loadData() {
    let _this = this;
    this.loading = true;
    this.dataService.get("/v1/sub-customers").then(function (resp) {
      _this.data = resp.data.data;
      _this.dataSorted = _this.sortData(_this.$filter, 'name');
      _this.loading = false;
    })
  }

  private validateForm() {
    this.resetError();
    if (this.param.name == null || this.param.name == "") this.addError('name', 'Nama sub kustomer tidak boleh kosong');
    return !this.isError();
  }
}

MasterSubCustomerComponent.$inject = ['dataService', '$filter', 'SweetAlert'];
