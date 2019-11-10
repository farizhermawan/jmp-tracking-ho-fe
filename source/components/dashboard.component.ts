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
  }

  getBackgroundFromAmount (amount) {
    if (amount <= 0) return 'bg-red';
    else if (amount <= this.defaultLimit) return 'bg-yellow';
    else return 'bg-green';
  }

  getDateOffsetMonth(offset) {
    let date = angular.copy(this.$rootScope.date);
    date.setMonth(date.getMonth() + offset);
    return date;
  }

  static Factory() {
    return {
      controller: DashboardComponent,
      templateUrl: 'views/components/dashboard.html'
    };
  }
}

DashboardComponent.$inject = ['$rootScope', 'backendService'];
