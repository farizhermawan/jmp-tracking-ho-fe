import Constant from "../classes/constant";

export default class AppComponent {
  version = Constant.APP_VERSION;
  buildVersion = new Date().toISOString().substr(0, 10);
  year = new Date().getFullYear();

  constructor(private $rootScope, $http) {
    $http.get(Constant.FRONTEND_URL + "/build.txt").then((resp) => {
      this.buildVersion = resp.data;
    });
  }

  static Factory() {
    return {
      controller: AppComponent,
      templateUrl: 'views/components/app.html'
    };
  }
}

AppComponent.$inject = ['$rootScope', '$http'];
