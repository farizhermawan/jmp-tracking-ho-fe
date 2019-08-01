import DefaultPage from "../classes/default-page";

export default class ListTransaksiComponent extends DefaultPage {

  constructor(private backendService, SweetAlert, private $sce, private $state, private $timeout, private $rootScope) {
    super(
      {},
      {
        dateStart: null,
        dateEnd: null
      },
      {
        totalCost: null,
        records: null
      },
      {SweetAlert: SweetAlert}
    );
  }

  $onInit() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);

    this.param.dateStart = firstDay;
    this.param.dateEnd = lastDay;

    this.defaultIfEmpty = this.$sce.trustAsHtml("<i>Belum diisi</i>");

    this.submitFilter();
  }

  submitFilter() {
    var _this = this;
    this.loading = true;
    this.backendService.getTransaksi(this.param, function (resp) {
      _this.data.count = resp.data.data;
      _this.data.records = null;
      _this.loading = false;
      _this.loadData();
    })
  }

  loadData() {
    var _this = this;
    this.backendService.getTransaksi(this.param, function (resp) {
      _this.data.records = resp.data.data;
      _this.data.totalCost = {
        main: 0,
        other: 0
      };
      _this.data.totalCommission = 0;

      angular.forEach(_this.data.records, function(value, key) {
        var datetime = _this.data.records[key]['created_at'].split(" ");
        _this.data.records[key]['cost'] = {
          main: 0,
          other: 0
        };
        angular.forEach(_this.data.records[key]['cost_entries'], function(item, subkey) {
          var cost = _this.data.records[key]['cost_entries'][subkey];
          if (cost.item == 'Uang Jalan') {
            _this.data.records[key]['cost']['main'] = cost.value;
            _this.data.totalCost.main = _this.data.totalCost.main + cost.value;
          }
          else {
            _this.data.records[key]['cost']['other'] = _this.data.records[key]['cost']['other'] + cost.value;
            _this.data.totalCost.other = _this.data.totalCost.other + cost.value;
          }
          _this.data.totalCommission = _this.data.totalCommission + _this.data.records[key]['commission'];
        });
        _this.data.records[key]['created_at'] = {date: datetime[0], time: datetime[1]};
        if (_this.data.records[key]['time_to_complete']) _this.data.records[key]['state'] = 'closed';
        else if (_this.data.records[key]['container'] && _this.data.records[key]['container_size']) _this.data.records[key]['state'] = 'ready_to_close';
        else _this.data.records[key]['state'] = 'open';
      });
    })
  }

  viewRecord(item) {
    this.$state.go("viewTransaksi", {
      id: btoa(btoa(btoa(item.id)))
    });
  }

  updateContainerSize(item) {
    var _this = this;
    this.inputBox("Tipe Kontainer", "Pastikan data yang kamu masukan sudah benar!", function (input) {
      if (input) {
        if (input != '20' && input != '40') {
          _this.$timeout(function () {
            _this.errorMsg("Error!", "Harap masukan angkat 20 atau 40 untuk tipe kontainer.");
          }, 100);
        } else {
          var param = {key: item.id, field: 'container_size', value: parseInt(input)};
          _this.backendService.updateJotTransaction(param, function (resp) {
            if (resp.data.message != "success") _this.errorMsg("Error!", resp.data.message);
            else _this.loadData();
          }, function () {
            _this.errorMsg("Error!", "Aplikasi gagal menyimpan data yang anda ubah.");
          });
        }
      }
    });
  }

  exportExcel() {
    var _this = this;
    this.loading = true;
    this.backendService.exportTransaksi(this.param, function (resp) {
      _this.onExport(resp);
    });
  }

  canEdit() {
    return true;
  }

  static Factory() {
    return {
      controller: ListTransaksiComponent,
      templateUrl: 'views/components/list-transaksi.html'
    };
  }
}

ListTransaksiComponent.$inject = ['backendService', 'SweetAlert', '$sce', '$state', '$timeout', '$rootScope'];