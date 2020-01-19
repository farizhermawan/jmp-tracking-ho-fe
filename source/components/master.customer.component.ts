import DefaultPage from "../classes/default-page";

export default class MasterCustomerComponent extends DefaultPage {
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
      _this.backendService.saveCustomer(_this.param, function () {
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
    _this.backendService.toggleCustomer(item, function () {
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
      _this.backendService.removeCustomer(item, function () {
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
    this.sortData();
  }

  sortData() {
    let _this = this;
    if (this.sortState == 0) this.dataSorted = this.data;
    else this.dataSorted = this.$filter('orderBy')(this.data, this.sortState == 1 ? '+name' : '-name');
  }

  private loadData() {
    let _this = this;
    this.loading = true;
    this.backendService.getCustomers(function (resp) {
      _this.data = resp.data.data;
      _this.sortData();
      _this.loading = false;
    })
  }

  private validateForm() {
    this.resetError();
    if (this.param.name == null || this.param.name == "") this.addError('name', 'Nama kustomer tidak boleh kosong');
    return !this.isError();
  }

  static Factory() {
    return {
      controller: MasterCustomerComponent,
      templateUrl: 'views/components/master.customer.html'
    };
  }
}

MasterCustomerComponent.$inject = ['backendService', '$filter', 'SweetAlert'];
