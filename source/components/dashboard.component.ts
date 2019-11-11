import DefaultPage from "../classes/default-page";

export default class DashboardComponent extends DefaultPage {

  constructor(private $rootScope, private backendService) {
    super({}, {}, {}, {});
  }

  $onInit() {
    var _this = this;
    this.backendService.getDashboard(function (resp) {
      _this.data = resp.data.data;
    });
    this.$rootScope.date = new Date();
    this.param.periode = this.dateToStr(new Date());
  }

  dateToStr(date) {
    var monthNames = [
      "Januari", "Februari", "Maret",
      "April", "Mei", "Juni", "Juli",
      "Agustus", "September", "Oktober",
      "November", "Desember"
    ];
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return monthNames[monthIndex] + ' ' + year;
  }

  strToDate(str) {
    var dateStr = str.split(" ");
    var monthNames = [
      "Januari", "Februari", "Maret",
      "April", "Mei", "Juni", "Juli",
      "Agustus", "September", "Oktober",
      "November", "Desember"
    ];
    return new Date(dateStr[1], monthNames.indexOf(dateStr[0]), 1);
  }

  getPercentage(a, b) {
    a = parseInt(a);
    b = parseInt(b);
    if (a == 0 && b == 0) return "";
    if (a == b) return "=";
    if (a == 0) return "";
    if (b == 0) return "";
    return Math.abs(Math.round((a-b)/b*100)) + "%";
  }

  getPercentageBackground(a, b) {
    a = parseInt(a);
    b = parseInt(b);
    if (a > b) return "text-green";
    if (a < b) return "text-red";
    return "text-yellow";
  }

  getPercentageIcon(a, b) {
    a = parseInt(a);
    b = parseInt(b);
    if (a == 0 && b == 0) return "";
    if (a > b) return "fa-caret-up";
    if (a < b) return "fa-caret-down";
    return "";
  }

  getBackgroundFromAmount (amount) {
    if (amount <= 0) return 'bg-red';
    else if (amount <= this.defaultLimit) return 'bg-yellow';
    else return 'bg-green';
  }

  getDateOffsetMonth(offset) {
    let date = this.strToDate(this.param.periode);
    date.setMonth(date.getMonth() + offset);
    return date;
  }

  updateRitasi() {
    let _this = this;
    _this.backendService.getRitasi(this.param.periode, function (resp) {
      _this.data.car_stat = resp.data.data;
    });
  }

  static Factory() {
    return {
      controller: DashboardComponent,
      templateUrl: 'views/components/dashboard.html?rand=' + Date.now()
    };
  }
}

DashboardComponent.$inject = ['$rootScope', 'backendService'];
