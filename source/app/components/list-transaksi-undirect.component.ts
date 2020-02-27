import DefaultPage from "../classes/default-page";

export default class ListTransaksiUndirectComponent extends DefaultPage {

  constructor(private backendService, SweetAlert, private $sce, private $state, private $timeout, private $rootScope) {
    super(
      {
        driver: [],
        vehicle: [],
        category: []
      },
      {
        filter: null,
        category: null,
        dateStart: null,
        dateEnd: null
      },
      {
        count: null,
        totalCost: null,
        records: null,
        filteredRecords: null,
      },
      {SweetAlert: SweetAlert}
    );
  }

  static Factory() {
    return {
      controller: ListTransaksiUndirectComponent,
      templateUrl: 'views/components/list-transaksi-undirect.html'
    };
  }

  $onInit() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);

    let _this = this;

    this.param.dateStart = firstDay;
    this.param.dateEnd = lastDay;

    this.backendService.getDrivers(function (resp) {
      _this.list.driver = resp.data.data;
    });
    this.backendService.getVehicles(function (resp) {
      _this.list.vehicle = resp.data.data;
    });

    this.list.category = ['Semua', 'Tambal Ban', 'Perbaikan', 'Pembelian', 'Inap', 'Lain-lain'];
    this.param.category = this.list.category[0];
    this.defaultIfEmpty = this.$sce.trustAsHtml("<i>Belum diisi</i>");

    this.submitFilter();
  }

  submitFilter() {
    var _this = this;
    this.backendService.getVehicleCost(this.param, function (resp) {
      _this.data.records = resp.data.data;
      _this.param.filter = {driver: null, vehicle: null};
      _this.filterRecord();
    })
  }

  deleteItem(item) {
    var _this = this;
    this.confirmRemove(function () {
      _this.backendService.removeVehicleCost(item, function (resp) {
        _this.submitFilter();
      });
    })
  }

  filterRecord() {
    var _this = this;
    _this.data.totalCost = 0;
    _this.data.filteredRecords = [];
    angular.forEach(_this.data.records, function (value, key) {
      let include = true;
      if (_this.param.filter.driver != null) {
        include = _this.data.records[key]['additional_data']['driver'] === _this.param.filter.driver.name;
      }
      if (_this.param.filter.vehicle != null) {
        include = _this.data.records[key]['additional_data']['police_number'] === _this.param.filter.vehicle.police_number;
      }
      if (include) {
        _this.data.totalCost += _this.data.records[key]['total_cost'];
        var data = angular.copy(_this.data.records[key]);
        var datetime = data['created_at'].split(" ");
        data['created_at'] = {date: datetime[0], time: datetime[1]};
        _this.data.filteredRecords.push(data);
      }
    });
  }

  exportExcel() {
    var _this = this;
    this.loading = true;
    this.backendService.exportVehicleCost(this.param, function (resp) {
      _this.onExport(resp);
    });
  }
}

ListTransaksiUndirectComponent.$inject = ['backendService', 'SweetAlert', '$sce', '$state', '$timeout', '$rootScope'];
