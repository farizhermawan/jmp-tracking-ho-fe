import DefaultPage from "../classes/default-page";

export default class TransaksiUndirectComponent extends DefaultPage {

  constructor(private backendService, private $state, SweetAlert) {
    super(
      {category: [], driver: [], vehicle: []},
      {driver: null, police_number: null, category: null, note: null, cost: 0, additional_data: null},
      {},
      {SweetAlert: SweetAlert}
    );
  }

  $onInit() {
    let _this = this;
    this.backendService.getDrivers(function (resp) {
      _this.list.driver = resp.data.data;
    });
    this.backendService.getVehicles(function (resp) {
      _this.list.vehicle = resp.data.data;
    });
    this.list.category = ['Tambal Ban', 'Perbaikan', 'Pembelian', 'Inap', 'Lain-lain'];
  }

  submit() {
    let _this = this;
    if (!this.validate()) return;
    this.loading = true;
    this.confirmSave(function () {
      _this.backendService.saveVehicleCost(_this.param, function () {
        _this.successMsg("Sukses!", "Transaksi biaya atas kendaraan berhasil disimpan.");
        _this.reset();
        _this.$state.go("dashboard");
      }, function () {
        _this.errorMsg("Error!", "Transaksi biaya atas kendaraan gagal disimpan.");
      });
    });
  }

  validate() {
    this.resetError();
    if (this.param.driver == null) this.addError('driver', 'Nama supir belum dipilih');
    if (this.param.police_number == null) this.addError('police_number', 'Nomor polisi belum dipilih');
    if (this.param.category == null) this.addError('category', 'Kategori biaya harus dipilih');
    if (this.param.note == null || this.param.note == "") this.addError('note', 'Keterangan harus diisi');
    if (this.param.cost == 0) this.addError('cost', 'Total biaya tidak boleh kosong');
    return !this.isError();
  }

  static Factory() {
    return {
      controller: TransaksiUndirectComponent,
      templateUrl: 'views/components/transaksi.undirect.html'
    };
  }
}

TransaksiUndirectComponent.$inject = ['backendService', '$state', 'SweetAlert'];