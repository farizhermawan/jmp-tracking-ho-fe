export default class AppComponent {

  constructor(private $rootScope) {}

  static Factory() {
    return {
      controller: AppComponent,
      templateUrl: 'views/components/app.html'
    };
  }
}

AppComponent.$inject = ['$rootScope'];
