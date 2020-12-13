import DefaultPage from "../classes/default-page";
import Constant from "../classes/constant";

export default class TransaksiUndirectV2Component extends DefaultPage {

  private confirmStep = false;
  private requiredField = [];

  constructor(private backendService, private $state, SweetAlert) {
    super(
      {category: [], subcategory: [], driver: [], vehicle: []},
      {driver: null, police_number: null, category: null, subcategory: null, note: null, cost: 0, additional_data: null},
      {},
      {SweetAlert: SweetAlert}
    );
  }

  static Factory() {
    return {
      controller: TransaksiUndirectV2Component,
      templateUrl: 'views/components/transaksi-undirect-v2.html'
    };
  }

  $onInit() {
    let _this = this;
    this.backendService.getDrivers(function (resp) {
      _this.list.driver = resp.data.data;
    });
    this.backendService.getVehicles(function (resp) {
      _this.list.vehicle = resp.data.data;
    });
    this.list.category = ['Pribadi', 'Kendaraan', 'Rumah Tangga', 'Lain-lain'];
    this.list.subcategory = [];
  }

  onCategoryChange() {
    if (this.param.category != null) {
      this.list.subcategory = [];
      this.requiredField = [];

      this.param.driver = null;
      this.param.police_number = null;
      this.param.subcategory = null;

      if (this.param.category == 'Pribadi') this.requiredField = ['driver'];
      else if (this.param.category == 'Kendaraan') {
        this.list.subcategory = ['Tambal Ban', 'Perbaikan', 'Pembelian', 'Inap', 'Lain-lain'];
        this.requiredField = ['driver', 'police_number', 'subcategory'];
      }
    }
  }

  next() {
    if (!this.validate()) return;
    this.confirmStep = true;
    this.loading = true;

    this.backendService.getBallance(Constant.APP_ENTITY,  (resp) => {
      this.setBallance(resp.data.ballance, this.param.cost);
      this.loading = false;
    });
  }

  prev() {
    this.confirmStep = false;
  }

  submit() {
    this.confirmSave(() => {
      this.backendService.saveUndirectCost(this.param, () => {
        this.$state.go("listBiayaTidakLangsung");
      });
    });
  }

  validate() {
    this.resetError();
    if (this.param.category == null) this.addError('category', 'Kategori biaya harus dipilih');
    if (this.requiredField.indexOf('driver') != -1 && this.param.driver == null) this.addError('driver', 'Nama supir belum dipilih');
    if (this.requiredField.indexOf('police_number') != -1 && this.param.police_number == null) this.addError('police_number', 'Nomor polisi belum dipilih');
    if (this.requiredField.indexOf('subcategory') != -1 && this.param.subcategory == null) this.addError('subcategory', 'Kategori biaya kendaraan belum dipilih');
    if (this.param.note == null || this.param.note == "") this.addError('note', 'Keterangan harus diisi');
    if (this.param.cost == 0) this.addError('cost', 'Total biaya tidak boleh kosong');
    return !this.isError();
  }
}

TransaksiUndirectV2Component.$inject = ['backendService', '$state', 'SweetAlert'];
