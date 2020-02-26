export default class MainSidebarComponent {

  private param;

  constructor(private $rootScope, private $timeout, private $q, private $state, private backendService, private $sce) {
    this.param = {
      query: null
    };
  }

  searchCIds(query, querySelectAs) {
    if (query == null || query.length == 0) return;
    let _this = this;
    let deferred = this.$q.defer();
    this.backendService.searchContainerIds({q: query}, function (resp) {
      return deferred.resolve(resp.data.data);
    });
    return deferred.promise;
  };

  viewRecord(id) {
    if (typeof id != 'undefined') {
      this.$state.go("viewTransaksi", {
        id: btoa(btoa(btoa(id)))
      });
    }
  }

  static Factory() {
    return {
      controller: MainSidebarComponent,
      templateUrl: 'views/components/main-sidebar.html'
    };
  }
}

MainSidebarComponent.$inject = ['$rootScope', '$timeout', '$q', '$state', 'backendService', '$sce'];