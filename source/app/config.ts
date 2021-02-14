import Constant from "./classes/constant";

function config(locationProvider, stateProvider, urlRouterProvider, $httpProvider, jwtOptionsProvider, lockProvider) {
  locationProvider.html5Mode(true);
  urlRouterProvider.otherwise('/');

  jwtOptionsProvider.config({
    tokenGetter: function () {
      return localStorage.getItem('access_token');
    },
    whiteListedDomains: [Constant.API_HOST, 'jmp-apps.auth0.com']
  });

  $httpProvider.interceptors.push('jwtInterceptor');

  stateProvider.state('default', {
    url: '/',
    template: ''
  })
  .state('dashboard', {
    url: '/dashboard',
    template: '<dashboard></dashboard>'
  })
  .state('monitor', {
    url: '/monitor',
    template: '<monitor></monitor>'
  })
  .state('ballance', {
    url: '/ballance',
    template: '<ballance></ballance>'
  })
  .state('finance', {
    url: '/finance',
    template: '<finance></finance>'
  })
  .state('listTransaksi', {
    url: '/list-transaksi?status&show',
    template: '<list-transaksi></list-transaksi>'
  })
  .state('viewTransaksi', {
    url: '/view-transaksi/{id}',
    params: {
      id: null
    },
    template: '<view-transaksi></view-transaksi>'
  })
  .state('transaksi', {
    url: '/transaksi',
    template: '<transaksi-main></transaksi-main>'
  })
  .state('revisiTransaksi', {
    url: '/revisi-transaksi/{id}',
    params: {
      id: null
    },
    template: '<transaksi-main></transaksi-main>'
  })
  .state('callback', {
    url: '/callback',
    template: '<login-callback></login-callback>'
  })
  .state('routes', {
    url: '/routes',
    template: '<routes></routes>'
  })
  .state('customers', {
    url: '/customers',
    template: '<customers></customers>'
  })
  .state('vehicles', {
    url: '/vehicles',
    template: '<vehicles></vehicles>'
  })
  .state('drivers', {
    url: '/drivers',
    template: '<drivers></drivers>'
  })
  .state('keneks', {
    url: '/keneks',
    template: '<keneks></keneks>'
  })
  .state('users', {
    url: '/users',
    template: '<users></users>'
  })
  .state('switchRole', {
    url: '/switch-role',
    template: '<switch-role></switch-role>'
  })
  .state('biayaKendaraan', {
    url: '/biaya-kendaraan',
    template: '<biaya-kendaraan></biaya-kendaraan>'
  })
  .state('listBiayaKendaraan', {
    url: '/list-biaya-kendaraan',
    template: '<list-biaya-kendaraan></list-biaya-kendaraan>'
  })
  .state('biayaTidakLangsung', {
    url: '/biaya-tidak-langsung',
    template: '<biaya-tidak-langsung></biaya-tidak-langsung>'
  })
  .state('listBiayaTidakLangsung', {
    url: '/list-biaya-tidak-langsung',
    template: '<list-biaya-tidak-langsung></list-biaya-tidak-langsung>'
  })
  .state('reportBiayaKendaraan', {
    url: '/report-biaya-kendaraan',
    template: '<report-biaya-kendaraan></report-biaya-kendaraan>'
  })
  .state('masterSubCustomer', {
    url: '/sub-customer',
    template: '<master-sub-customer />'
  })
  .state('masterDepoMT', {
    url: '/depo-mt',
    template: '<master-depo-mt />'
  });

  lockProvider.init({
    clientID: 'FwUoeHNGCB19ndqGLITKyQi0smIxaOSK',
    domain: 'jmp-apps.auth0.com',
    options: {
      theme: {
        logo: Constant.FRONTEND_URL + '/images/android-icon-192x192.png'
      },
      languageDictionary: {
        title: "JMP Apps"
      },
      closable: false,
      auth: {
        audience: 'http://cdp-kontrak.jmp-logistic.com/',
        responseType: 'token id_token',
        redirect: true,
        redirectUrl: Constant.FRONTEND_URL + '/callback',
        params: {
          prompt: 'select_account',
          scope: 'openid email profile'
        },
        sso: false
      }
    }
  });
}

config.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', 'jwtOptionsProvider', 'lockProvider'];

export default config;
