import DefaultPage from "../classes/default-page";

export default class MasterUserComponent extends DefaultPage {
  private view;
  private dataSorted;

  constructor(private backendService, private $rootScope, private $filter, SweetAlert) {
    super(
      {role: null},
      {id: null, name: null, email: null, role: null},
      {},
      {SweetAlert: SweetAlert}
    );
  }

  static Factory() {
    return {
      controller: MasterUserComponent,
      templateUrl: 'views/components/master.user.html'
    };
  }

  $onInit() {
    this.reset();
    this.changeView("read");
    this.loadData();
    this.list.role = ['Owner', 'Supervisor', 'Operator'];
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
      _this.backendService.saveUser(_this.param, function () {
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
    _this.backendService.toggleUser(item, function () {
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
      _this.backendService.removeUser(item, function () {
        _this.reset();
        _this.loadData();
        _this.changeView('read');
      });
    });
  }

  changeView(view) {
    this.view = view;
  }

  isMe(item) {
    return this.$rootScope.user.email == item.email;
  }

  sort() {
    super.sort();
    let _this = this;
    _this.dataSorted = _this.sortData(_this.$filter, 'name');
  }

  private loadData() {
    let _this = this;
    this.loading = true;
    this.backendService.getUsers(function (resp) {
      _this.data = resp.data.data;
      _this.dataSorted = _this.sortData(_this.$filter, 'name');
      _this.loading = false;
    })
  }

  private validateForm() {
    this.resetError();
    if (this.param.name == null || this.param.name == "") this.addError('name', 'Nama supir tidak boleh kosong');
    if (this.param.email == null || this.param.email == "") this.addError('email', 'Email tidak boleh kosong');
    if (this.param.role == null || this.param.role == "") this.addError('role', 'Role belum dipilih');
    return !this.isError();
  }
}

MasterUserComponent.$inject = ['backendService', '$rootScope', '$filter', 'SweetAlert'];
