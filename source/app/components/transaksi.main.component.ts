import DefaultPage from "../classes/default-page";
import Constant from "../classes/constant";

export default class TransaksiMainComponent extends DefaultPage {

  private step_one = false;
  private step_two = false;
  private use_solar = false;

  constructor(private $state, private backendService, SweetAlert) {
    super(
      {vehicle: [], driver: [], kenek: [], route: [], customer: [], defaultAddons: [], container_size: []},
      {
        police_number: null,
        driver: null,
        kenek: null,
        container_size: null,
        route: null,
        cost: 0,
        commission: 0,
        commission2: 0,
        solar_cost: 0,
        addons: []
      },
      {},
      {SweetAlert: SweetAlert}
    );
  }

  static Factory() {
    return {
      controller: TransaksiMainComponent,
      templateUrl: 'views/components/transaksi.main.html'
    };
  }

  $onInit() {
    let _this = this;
    this.list.defaultAddons = [];
    this.list.container_size = [
      "20",
      "40",
      "Cargo",
      "Combo"
    ];

    this.backendService.getVehicles(function (resp) {
      _this.list.vehicle = resp.data.data;
    });

    this.backendService.getDrivers(function (resp) {
      _this.list.driver = resp.data.data;
    });

    this.backendService.getKeneks(function (resp) {
      _this.list.kenek = resp.data.data;
    });

    this.backendService.getRoutes(function (resp) {
      _this.list.route = resp.data.data;
    });

    this.backendService.getCustomers(function (resp) {
      _this.list.customer = resp.data.data;
    });

    this.reset();
  }

  back() {
    if (this.step_two) {
      this.step_two = false;
    } else if (this.step_one) {
      this.resetAddons();
      this.step_one = false;
    }
  }

  submitStepOne() {
    if (!this.validateStepOne()) return;
    this.step_one = true;
  }

  submitStepTwo() {
    let _this = this;
    if (!this.validateStepTwo()) return;
    this.step_two = true;
    this.loading = true;

    this.backendService.getBallance(Constant.APP_ENTITY, function (resp) {
      _this.setBallance(resp.data.ballance, _this.calculateCost());
      _this.loading = false;
    });
  }

  submitLastStep() {
    let _this = this;
    _this.confirmSave(function () {
      _this.loading = true;
      _this.backendService.saveJotTransaction(_this.param, function (resp) {
        _this.loading = false;
        _this.back();
        _this.back();
        _this.$state.go("dashboard");
        _this.successMsg("Sukses!", "Transaksi berhasil disimpan.");
      }, function () {
        _this.loading = false;
        _this.errorMsg("Error!", "Transaksi gagal disimpan.");
      });
    })
  }

  addons() {
    if (this.param.cost == 0) {
      this.infoMsg('', 'Untuk menambahkan biaya lain-lain, nominal uang jalan harus diisi terlebih dahulu.');
      return;
    }
    this.param.addons.push({item: "", value: 0});
  }

  protected reset() {
    super.reset();
    this.resetAddons();
  }

  private calculateCost(): number {
    let total = 0;
    total = total + this.param.cost + this.param.solar_cost;
    for (let i = 0; i < this.param.addons.length; i++) {
      if (this.param.addons[i].item != "" && this.param.addons[i].value != 0) {
        total = total + this.param.addons[i].value;
      }
    }
    return total;
  }

  private isUseSolar() {
    this.use_solar = false;
    if (!(typeof this.param.police_number.additional_data['use_solar'] === 'undefined')) {
      this.use_solar = this.param.police_number.additional_data['use_solar'];
    }
    if (this.use_solar) {
      this.param.solar_cost = this.param.route.additional_data['solar_cost'];
    }
  }

  private validateStepOne(): boolean {
    this.resetError();
    if (this.param.police_number == null) this.addError('police_number', "Kamu belum memilih kendaraan");
    if (this.param.driver == null) this.addError('driver', "Kamu belum memilih supir");
    if (this.param.container_size == null) this.addError('container_size', "Kamu belum memilih ukuran kontainer");
    if (this.param.customer == null) this.addError('customer', "Kamu belum memilih kustomer");
    return !this.isError();
  }

  private validateStepTwo(): boolean {
    this.resetError();
    if (this.param.route == null) this.addError('route', "Rute belum diinput");
    if (this.param.cost == 0) this.addError('cost', "Nominal uang jalan belum diinput");
    return !this.isError();
  }

  private resetAddons() {
    this.param.addons = angular.copy(this.list.defaultAddons);
  }
}

TransaksiMainComponent.$inject = ['$state', 'backendService', 'SweetAlert'];
