import DefaultPage from "../classes/default-page";

export default class ListBiayaKendaraanComponent extends DefaultPage {
  private groups;

  constructor(private backendService, SweetAlert, private $sce, private $state, private $timeout, private $rootScope) {
    super(
      {
        driver: [],
        vehicle: [],
      },
      {
        filter: null,
        category: null,
        subcategory: "Semua",
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
      controller: ListBiayaKendaraanComponent,
      templateUrl: 'views/components/list-transaksi-undirect-v2.html'
    };
  }

  $onInit() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);

    this.param.dateStart = firstDay;
    this.param.dateEnd = lastDay;

    this.backendService.getDrivers((resp) => {
      this.list.driver = resp.data.data;
    });
    this.backendService.getVehicles((resp) => {
      this.list.vehicle = resp.data.data;
    });

    this.defaultIfEmpty = this.$sce.trustAsHtml("<i>Belum diisi</i>");

    this.groups = [
      {title: 'Pribadi', count: 0},
      {title: 'Kendaraan', count: 0},
      {title: 'Rumah Tangga', count: 0},
      {title: 'Lain-lain', count: 0}
    ];

    this.param.category = this.groups[0].title;

    this.submitFilter();
  }

  selectCategory(item) {
    this.param.category = item.title;
    this.filterRecord();
  }

  submitFilter() {
    this.backendService.getUndirectCost(this.param, (resp) => {
      this.groups = [
        {title: 'Pribadi', count: 0},
        {title: 'Kendaraan', count: 0},
        {title: 'Rumah Tangga', count: 0},
        {title: 'Lain-lain', count: 0}
      ];
      this.data.records = resp.data.data;
      angular.forEach(this.data.records, (item, key) => {
        angular.forEach(this.groups, (subitem, subkey) => {
          if (subitem.title == key) subitem.count = item.length;
        });
      });
      this.param.filter = {driver: null, vehicle: null};
      this.filterRecord();
    })
  }

  deleteItem(item) {
    var _this = this;
    this.confirmRemove(function () {
      _this.backendService.removeUndirectCost(item, function (resp) {
        _this.submitFilter();
      });
    })
  }

  filterRecord() {
    this.data.totalCost = 0;
    this.data.filteredRecords = [];
    angular.forEach(this.data.records[this.param.category], (item, key) => {
      console.log(item, key);
      let include = true;
      if (this.param.filter.driver != null) {
        include = item['additional_data']['driver'] === this.param.filter.driver.name;
      }
      if (this.param.filter.vehicle != null) {
        include = item['additional_data']['police_number'] === this.param.filter.vehicle.police_number;
      }
      if (include) {
        this.data.totalCost += item['total_cost'];
        var data = angular.copy(item);
        var datetime = data['created_at'].split(" ");
        data['created_at'] = {date: datetime[0], time: datetime[1]};
        this.data.filteredRecords.push(data);
      }
    });
  }

  exportExcel() {
    var _this = this;
    this.loading = true;
    this.backendService.exportUndirectCost(this.param, function (resp) {
      _this.onExport(resp);
    });
  }
}

ListBiayaKendaraanComponent.$inject = ['backendService', 'SweetAlert', '$sce', '$state', '$timeout', '$rootScope'];
