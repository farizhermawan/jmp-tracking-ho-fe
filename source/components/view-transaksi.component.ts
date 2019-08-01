import DefaultPage from "../classes/default-page";
import Constant from "../classes/constant";

export default class ViewTransaksiComponent extends DefaultPage {

  private showUpdateCostForm;
  private step_one = false;
  private current_total_cost = 0;
  private new_total_cost = 0;

  constructor(private backendService, SweetAlert, private $sce, private $state, private $timeout, private $rootScope) {
    super(
      {},
      {id: null, container: null, addons: []},
      {},
      {SweetAlert: SweetAlert}
    );
  }

  $onInit() {
    let _this = this;
    if (this.$state.params.id != null) {
      this.param = {id: atob(atob(atob(this.$state.params.id)))};
      this.loadJot();
    }
    else _this.$state.go('listTransaksi');

    this.defaultIfEmpty = this.$sce.trustAsHtml("<i>Belum diisi</i>");
    this.showUpdateCostForm = false;
  }

  updateCost() {
    this.resetAddons();
    this.showUpdateCostForm = true;
  }

  deleteItem() {
    var _this = this;
    this.confirmRemove(function () {
      _this.backendService.removeJotTransaction(_this.data, function (resp) {
        _this.$state.go('listTransaksi');
      });
    })
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
    }
    else this.$state.go('listTransaksi');
  }

  addons() {
    this.param.addons.push({item: "", value:0});
  }

  canEdit() {
    return true;
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
      }
      else {
        _this.errorMsg(resp.data.message, "");
        _this.$state.go('listTransaksi');
      }
    })
  }

  private calculateCurrentCost():number {
    let total = 0;
    for(let i=0; i<this.data.cost_entries.length; i++) {
      total = total + this.data.cost_entries[i].value;
    }
    return total;
  }

  private calculateAddons():number {
    let total = 0;
    for(let i=0; i<this.param.addons.length; i++) {
      total = total + this.param.addons[i].value;
    }
    return total;
  }

  static Factory() {
    return {
      controller: ViewTransaksiComponent,
      templateUrl: 'views/components/view-transaksi.html'
    };
  }
}

ViewTransaksiComponent.$inject = ['backendService', 'SweetAlert', '$sce', '$state', '$timeout', '$rootScope'];