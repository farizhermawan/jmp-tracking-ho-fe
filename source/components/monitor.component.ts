import DefaultPage from "../classes/default-page";

export default class MonitorComponent extends DefaultPage {

  protected state = {one:false, two:false, three:false};

  constructor(private $rootScope, private backendService) {
    super(
      {},
      {},
      {
        section: {one: "", two: "", three: ""},
        items: {one: [], two: [], three: []}
        },
      {});
  }

  $onInit() {
    var _this = this;

    this.resetState();
    let now = new Date();
    this.backendService.getMonitor({date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)}, function (resp) {
      _this.data.section.one = Date.parse(resp.data.date);
      _this.data.items.one = resp.data.data;
      _this.state.one = true;
    });
    this.backendService.getMonitor({date: new Date(now.getFullYear(), now.getMonth(), now.getDate())}, function (resp) {
      _this.data.section.two = Date.parse(resp.data.date);
      _this.data.items.two = resp.data.data;
      _this.state.two = true;
    });
    this.backendService.getMonitor({date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)}, function (resp) {
      _this.data.section.three = Date.parse(resp.data.date);
      _this.data.items.three = resp.data.data;
      _this.state.three = true;
    });
  }

  resetState() {
    this.state = {one: false, two: false, three: false};
  }

  prevDay() {
    let _this = this;
    this.resetState();

    this.data.section.three = angular.copy(this.data.section.two);
    this.data.items.three = angular.copy(this.data.items.two);
    this.state.three = true;

    this.data.section.two = angular.copy(this.data.section.one);
    this.data.items.two = angular.copy(this.data.items.one);
    this.state.two = true;

    let date = new Date(this.data.section.one);
    this.data.section.one = date.setDate(date.getDate()-1);
    this.data.items.one = [];
    this.backendService.getMonitor({date: new Date(this.data.section.one)}, function (resp) {
      _this.data.section.one = Date.parse(resp.data.date);
      _this.data.items.one = resp.data.data;
      _this.state.one = true;
    });
  }

  nextDay() {
    let _this = this;
    this.resetState();

    this.data.section.one = angular.copy(this.data.section.two);
    this.data.items.one = angular.copy(this.data.items.two);
    this.state.one = true;

    this.data.section.two = angular.copy(this.data.section.three);
    this.data.items.two = angular.copy(this.data.items.three);
    this.state.two = true;

    let date = new Date(this.data.section.three);
    this.data.section.three = date.setDate(date.getDate()+1);
    this.data.items.three = [];
    this.backendService.getMonitor({date: new Date(this.data.section.three)}, function (resp) {
      _this.data.section.three = Date.parse(resp.data.date);
      _this.data.items.three = resp.data.data;
      _this.state.three = true;
    });
  }

  isReady() {
    return this.state.one && this.state.two && this.state.three;
  }

  getBackground(status) {
    if (status == 'OPEN') return 'bg-red';
    if (status == 'ARRIVED') return 'bg-yellow';
    if (status == 'CLOSED') return 'bg-green';
    if (status == 'PLAN') return 'bg-gray';
    return '';
  }

  markAsArrived(item) {
    item.status = 'ARRIVED';
  }

  static Factory() {
    return {
      controller: MonitorComponent,
      templateUrl: 'views/components/monitor.html?rand=' + Date.now()
    };
  }
}

MonitorComponent.$inject = ['$rootScope', 'backendService'];
