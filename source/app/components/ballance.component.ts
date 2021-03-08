import DefaultPage from "../classes/default-page";
import Constant from "../classes/constant";

export default class BallanceComponent extends DefaultPage {

  constructor(private $filter, private $rootScope, private backendService, SweetAlert) {
    super(
      {entity: []},
      {entity: null, amount: 0},
      {},
      {SweetAlert: SweetAlert}
    );
  }

  static Factory() {
    return {
      controller: BallanceComponent,
      templateUrl: 'views/components/ballance.html'
    };
  }

  $onInit() {
    let _this = this;
    this.loadEntities();
    this.reset();
  }

  submitAddSaldo() {
    var _this = this;
    if (!this.validateAddSaldo()) return;
    this.confirmSave(function () {
      _this.loading = true;
      _this.backendService.addBallance(_this.param, function (resp) {
        _this.successMsg("Sukses!", "Saldo " + _this.param.entity.name + " saat ini " + _this.$filter('currency')(resp.data.ballance));
        _this.loadEntities();
        _this.reset();
      }, function () {
        _this.errorMsg("Error!", "Isi saldo " + _this.param.entity.name + " gagal.");
        _this.loading = false;
      });
    });
  }

  private loadEntities() {
    let _this = this;
    this.backendService.getEntities(function (resp) {
      _this.list.entity = resp.data.data;
      _this.param.entity = _this.list.entity[0];
      angular.forEach(_this.list.entity, function (value, key) {
        _this.backendService.getBallance(value.id, function (resp) {
          _this.list.entity[key]['ballance'] = resp.data.ballance;
        });
      });
    });
  }

  private validateAddSaldo() {
    this.resetError();
    if (this.param.entity == null) this.addError('entity', "Dompet tujuan harus diisi");
    if (this.param.amount == 0) this.addError('amount', "Jumlah saldo tidak boleh kosong");
    return !this.isError();
  }
}

BallanceComponent.$inject = ['$filter', '$rootScope', 'backendService', 'SweetAlert'];
