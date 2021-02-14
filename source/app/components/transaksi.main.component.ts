import DefaultPage from "../classes/default-page";
import Constant from "../classes/constant";

export default class TransaksiMainComponent extends DefaultPage {

  private step_one = false;
  private step_two = false;
  private use_solar = false;
  private total_cost_entries = 0;

  constructor(private $state, private $interval, private backendService, private dataService, SweetAlert) {
    super(
      {vehicle: [], driver: [], kenek: [], route: [], customer: [], defaultAddons: [], container_size: [], sub_customer: [], depo_mt: []},
      {
        container_no: null,
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

    this.dataService.get("/v1/sub-customers").then(function (resp) {
      _this.list.sub_customer = resp.data.data;
    });

    this.dataService.get("/v1/depo-mt").then(function (resp) {
      _this.list.depo_mt = resp.data.data;
    })

    this.reset();

    if (this.$state.params.id != null) {
      this.param.id = atob(atob(atob(this.$state.params.id)));
      this.loading = true;
      let checkReadiness = this.$interval(() => {
        if (this.list.vehicle.length > 0 && this.list.driver.length > 0 && this.list.kenek.length > 0 && this.list.route.length > 0 && this.list.customer.length > 0) {
          this.$interval.cancel(checkReadiness);
          this.backendService.getJot(this.param, (resp) => {
            if (resp.data.message == "success") {
              this.data = resp.data.data;
              this.param.driver = this.list.driver.find(x => x.name === this.data.driver_name);
              this.param.kenek = this.list.kenek.find(x => x.name === this.data.kenek_name);
              this.param.police_number = this.list.vehicle.find(x => x.police_number === this.data.police_number);
              this.param.container_size = this.list.container_size.find(x => x === this.data.container_size);
              this.param.customer = this.list.customer.find(x => x.name === this.data.customer_name);
              this.param.route = this.list.route.find(x => x.name === this.data.route);
              this.onRouteChange();
              this.data.cost_entries.forEach(x => {
                if (x.item !== 'Uang Jalan' && x.item !== 'Tambahan Biaya Solar') {
                  this.param.addons.push(x);
                }
              });
            } else {
              this.errorMsg(resp.data.message, "");
              this.$state.go('listTransaksi');
            }
            this.loading = false;
          });
        }
      }, 500);
    }
  }

  onRouteChange() {
    this.param.cost = this.param.route.additional_data.cost;
    this.param.commission = this.param.route.additional_data.commission;
    this.param.commission2 = this.param.route.additional_data.commission2;
    this.isUseSolar();
  }

  back() {
    if (this.step_two) {
      this.step_two = false;
    } else if (this.step_one) {
      this.resetAddons();
      this.step_one = false;
    } else {
      this.$state.go("viewTransaksi", {
        id: btoa(btoa(btoa(this.data.id)))
      });
    }
  }

  submitStepOne() {
    if (!this.validateStepOne()) return;
    this.step_one = true;
  }

  submitStepTwo() {
    if (!this.validateStepTwo()) return;
    this.step_two = true;
    this.loading = true;

    this.backendService.getBallance(Constant.APP_ENTITY,  (resp) => {
      this.total_cost_entries = this.calculateCost();
      this.setBallance(resp.data.ballance, this.total_cost_entries - (this.param.id ? this.data.total_cost : 0));
      this.loading = false;
    });
  }

  submitLastStep() {
    this.confirmSave(() => {
      this.loading = true;
      if (this.param.id) {
        this.backendService.reviseJotTransaction(this.param, (resp) => {
          this.loading = false;
          this.back();
          this.back();
          this.$state.go("viewTransaksi", {
            id: btoa(btoa(btoa(resp.data.data.id)))
          });
          this.successMsg("Sukses!", "Revisi Transaksi berhasil disimpan.");
        }, () => {
          this.loading = false;
          this.errorMsg("Error!", "Transaksi gagal disimpan.");
        });
      } else {
        this.backendService.saveJotTransaction(this.param, (resp) => {
          this.loading = false;
          this.back();
          this.back();
          this.$state.go("dashboard");
          this.successMsg("Sukses!", "Transaksi berhasil disimpan.");
        }, () => {
          this.loading = false;
          this.errorMsg("Error!", "Transaksi gagal disimpan.");
        });
      }
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
    total = total + this.param.cost;
    for (let i = 0; i < this.param.addons.length; i++) {
      if (this.param.addons[i].item != "" && this.param.addons[i].value != 0) {
        total = total + this.param.addons[i].value;
      }
    }
    return total;
  }

  private isUseSolar() {
    this.use_solar = false;
    if (this.param.police_number.additional_data !== null) {
      if (!(typeof this.param.police_number.additional_data['use_solar'] === 'undefined')) {
        this.use_solar = this.param.police_number.additional_data['use_solar'];
      }
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

TransaksiMainComponent.$inject = ['$state', '$interval', 'backendService', 'dataService', 'SweetAlert'];
