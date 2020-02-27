import DefaultPage from "../classes/default-page";

export default class ListTransaksiReportComponent extends DefaultPage {

  constructor(private backendService, SweetAlert, private $sce, private $state, private $timeout, private $rootScope) {
    super(
      {},
      {
        dateStart: null,
        dateEnd: null
      },
      {},
      {SweetAlert: SweetAlert}
    );
  }

  static Factory() {
    return {
      controller: ListTransaksiReportComponent,
      templateUrl: 'views/components/list-transaksi-report.html'
    };
  }

  $onInit() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);

    let _this = this;

    this.param.dateStart = firstDay;
    this.param.dateEnd = lastDay;
  }

  exportExcel() {
    var _this = this;
    this.loading = true;
    this.backendService.exportVehicleCostReport(this.param, function (resp) {
      _this.onExport(resp);
    });
  }
}

ListTransaksiReportComponent.$inject = ['backendService', 'SweetAlert', '$sce', '$state', '$timeout', '$rootScope'];
