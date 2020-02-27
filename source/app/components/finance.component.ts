import DefaultPage from "../classes/default-page";

export default class FinanceComponent extends DefaultPage {

  constructor(private backendService, SweetAlert, private $timeout) {
    super(
      {entity: []},
      {entity: null, dateStart: null, dateEnd: null},
      {ballance: 0, records: []},
      {SweetAlert: SweetAlert}
    );
  }

  static Factory() {
    return {
      controller: FinanceComponent,
      templateUrl: 'views/components/finance.html'
    };
  }

  $onInit() {
    let date = new Date(), y = date.getFullYear(), m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);

    this.param.dateStart = firstDay;
    this.param.dateEnd = lastDay;

    this.loadEntities();
  }

  submitFilter() {
    let _this = this;
    this.loading = true;
    this.$timeout(function () {
      _this.backendService.getFinance(_this.param, function (resp) {
        _this.data = resp.data.data;
        angular.forEach(_this.data.records, function (value, key) {
          let datetime = _this.data.records[key]['posted_at'].split(" ");
          _this.data.records[key]['posted_at'] = {date: datetime[0], time: datetime[1]}
        });
        _this.loading = false;
      })
    }, 100);
  }

  exportExcel() {
    let _this = this;
    this.loading = true;
    this.backendService.exportFinance(this.param, function (resp) {
      _this.onExport(resp);
    });
  }

  private loadEntities() {
    let _this = this;
    this.backendService.getEntities(function (resp) {
      _this.list.entity = resp.data.data;
      _this.param.entity = _this.list.entity[0];
      _this.submitFilter();
    });
  }
}

FinanceComponent.$inject = ['backendService', 'SweetAlert', '$timeout'];
