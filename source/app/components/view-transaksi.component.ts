import DefaultPage from "../classes/default-page";
import Constant from "../classes/constant";

export default class ViewTransaksiComponent extends DefaultPage {

  private showUpdateCostForm;
  private showUpdateKenekForm;
  private showUpdateSubCustomerForm;
  private showUpdateDepoMTForm;
  private showUpdateContainerForm;
  private showUpdateItruckForm;
  private step_one = false;
  private current_total_cost = 0;
  private new_total_cost = 0;
  private emptyKenek = "";

  constructor(private backendService, private dataService, SweetAlert, private $sce, private $state, private $timeout, private $rootScope) {
    super(
      {kenek: [], subcustomer: [], depo_mt: []},
      {id: null, container: null, addons: []},
      {},
      {SweetAlert: SweetAlert}
    );
  }

  static Factory() {
    return {
      controller: ViewTransaksiComponent,
      templateUrl: 'views/components/view-transaksi.html'
    };
  }

  $onInit() {
    let _this = this;
    if (this.$state.params.id != null) {
      this.param = {id: atob(atob(atob(this.$state.params.id)))};
      this.loadJot();
    } else _this.$state.go('listTransaksi');

    this.emptyKenek = this.$sce.trustAsHtml("<i>Tanpa Kenek</i>");
    this.defaultIfEmpty = this.$sce.trustAsHtml("<i>Belum diisi</i>");
    this.showUpdateCostForm = false;
    this.showUpdateKenekForm = false;
    this.showUpdateSubCustomerForm = false;
    this.showUpdateDepoMTForm = false;
    this.showUpdateContainerForm = false;
    this.showUpdateItruckForm = false;

    this.backendService.getKeneks(function (resp) {
      _this.list.kenek = resp.data.data;
      _this.list.kenek.unshift({
        additional_data: null,
        flag_active: true,
        id: 0,
        name: "Tanpa Kenek"
      });
    });

    this.dataService.get('/v1/sub-customers').then(function (resp) {
      _this.list.subcustomer = resp.data.data;
      _this.list.subcustomer.unshift({
        additional_data: null,
        flag_active: true,
        id: 0,
        name: "Tanpa Sub Kustomer"
      });
    });

    this.dataService.get('/v1/depo-mt').then(function (resp) {
      _this.list.depo_mt = resp.data.data;
      _this.list.depo_mt.unshift({
        additional_data: null,
        flag_active: true,
        id: 0,
        name: "Tanpa Depo MT"
      });
    });
  }

  updateCost() {
    this.resetAddons();
    this.showUpdateCostForm = true;
  }

  updateContainer() {
    if (this.showUpdateContainerForm == false) {
      this.param.container_no = this.data.container_no;
      this.resetError();
      this.showUpdateContainerForm = true;
    }
    else {
      let param = {key: this.data.id, field: 'container_no', value: this.param.container_no};
      if (param.value == null || param.value == "") this.addError('container_no', "Tidak boleh kosong!");
      else {
        this.data.container_no = this.param.container_no;
        this.backendService.updateJotTransaction(param, (resp) => {
          if (resp.data.message != "success") this.addError('container_no', resp.data.message);
          else {
            this.loadJot();
            this.showUpdateContainerForm = false;
          }
        });
      }
    }
  }

  updateItruck() {
    if (this.showUpdateItruckForm == false) {
      this.param.itruck = this.data.itruck;
      this.resetError();
      this.showUpdateItruckForm = true;
    }
    else {
      let param = {key: this.data.id, field: 'itruck', value: this.param.itruck};
      if (param.value == null || param.value == "") this.addError('itruck', "Tidak boleh kosong!");
      else {
        this.data.itruck = this.param.itruck;
        this.backendService.updateJotTransaction(param, (resp) => {
          if (resp.data.message != "success") this.addError('itruck', resp.data.message);
          else {
            this.loadJot();
            this.showUpdateItruckForm = false;
          }
        });
      }
    }
  }

  updateKenek() {
    let _this = this;
    if (this.showUpdateKenekForm == false) this.showUpdateKenekForm = true;
    else {
      this.backendService.updateJotTransaction({
        key: _this.param.id,
        field: "kenek",
        value: _this.param.kenek != null && _this.param.kenek.id != 0 ? _this.param.kenek.name : null,
      }, function () {
        _this.loadJot();
        _this.showUpdateKenekForm = false;
      });
    }
  }

  updateSubCustomer() {
    let _this = this;
    if (this.showUpdateSubCustomerForm == false) this.showUpdateSubCustomerForm = true;
    else {
      this.backendService.updateJotTransaction({
        key: _this.param.id,
        field: "subcustomer_name",
        value: _this.param.subcustomer != null && _this.param.subcustomer.id != 0 ? _this.param.subcustomer.name : null,
      }, function () {
        _this.loadJot();
        _this.showUpdateSubCustomerForm = false;
      });
    }
  }

  updateDepoMT() {
    let _this = this;
    if (this.showUpdateDepoMTForm == false) this.showUpdateDepoMTForm = true;
    else {
      this.backendService.updateJotTransaction({
        key: _this.param.id,
        field: "depo_mt",
        value: _this.param.depo_mt != null && _this.param.depo_mt.id != 0 ? _this.param.depo_mt.name : null,
      }, function () {
        _this.loadJot();
        _this.showUpdateDepoMTForm = false;
      });
    }
  }

  deleteItem() {
    var _this = this;
    this.confirmRemove(function () {
      _this.backendService.removeJotTransaction(_this.data, function (resp) {
        _this.$state.go('listTransaksi');
      });
    })
  }

  reviseItem() {
    this.confirmMessage("Revisi Data", "Data yang lama akan dihapus dan tidak bisa dikembalikan!", () => {
      this.$state.go("revisiTransaksi", {
        id: btoa(btoa(btoa(this.data.id)))
      });
    });
  }

  submitStepOne() {
    let _this = this;
    this.loading = true;
    this.step_one = true;
    this.backendService.getBallance(Constant.APP_ENTITY, function (resp) {
      _this.new_total_cost = _this.calculateAddons();
      _this.setBallance(resp.data.ballance, _this.new_total_cost - _this.current_total_cost);
      _this.loading = false;
    });
  }

  submitLastStep() {
    let _this = this;
    _this.confirmSave(function () {
      _this.loading = true;
      _this.backendService.adjustJotTransaction(_this.param, function () {
        _this.loadJot();
        _this.back();
        _this.back();
        _this.successMsg("Sukses!", "Adjustmen transaksi dengan nomor Container " + _this.param.container + " berhasil disimpan.");
        _this.loading = false;
      }, function () {
        _this.loading = false;
        _this.errorMsg("Error!", "Adjustmen transaksi dengan nomor Container " + _this.param.container + " gagal disimpan.");
      });
    });
  }

  back() {
    if (this.showUpdateCostForm) {
      if (this.step_one == true) this.step_one = false;
      else this.showUpdateCostForm = false;
    } else this.$state.go('listTransaksi');
  }

  addons() {
    this.param.addons.push({item: "", value: 0});
  }

  canEdit() {
    if (this.$rootScope.user.role == 'Owner' || this.$rootScope.user.role == 'admin') return true;
    return !this.isClosed();
  }

  isClosed() {
    return !(this.data.additional_data == null || typeof this.data.additional_data['closed_at'] === 'undefined');
  }

  isComplete() {
    return this.data.container_no != null;
  }

  closeRecord() {
    var _this = this;
    if (!this.isComplete()) return;
    _this.confirmMessage("Close Transaksi", "Data yang sudah diclose tidak bisa diedit kembali!", function () {
      _this.backendService.updateJotTransaction({key: _this.data.id, field: 'close', value: true}, function (resp) {
        _this.loadJot();
      });
    })
  }

  private resetAddons() {
    this.param.addons = angular.copy(this.data.cost_entries);
  }

  private loadJot() {
    let _this = this;
    this.backendService.getJot(this.param, function (resp) {
      if (resp.data.message == "success") {
        _this.data = resp.data.data;
        _this.param.id = _this.data.id;
        _this.param.container = _this.data.container;
        _this.current_total_cost = _this.calculateCurrentCost();
      } else {
        _this.errorMsg(resp.data.message, "");
        _this.$state.go('listTransaksi');
      }
    })
  }

  private calculateCurrentCost(): number {
    let total = 0;
    for (let i = 0; i < this.data.cost_entries.length; i++) {
      total = total + this.data.cost_entries[i].value;
    }
    return total;
  }

  private calculateAddons(): number {
    let total = 0;
    for (let i = 0; i < this.param.addons.length; i++) {
      total = total + this.param.addons[i].value;
    }
    return total;
  }
}

ViewTransaksiComponent.$inject = ['backendService', 'dataService', 'SweetAlert', '$sce', '$state', '$timeout', '$rootScope'];
