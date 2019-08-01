import components from './components';
import directives from './directives';
import services from './services';
import config from './config';
import run from "./run";

let app = angular.module('angular-admin-lte', [
  'auth0.auth0',
  'angular-jwt',
  'ui.router',
  'oi.select',
  'ngInputCurrency',
  'oitozero.ngSweetAlert',
  'ds.clock',
  'moment-picker',
  'ngSanitize',
  'auth0.lock',
  'ngCookies'
]);

app.config(config);

app.run(run);

angular.bootstrap(document.body, [app.name, components.name, directives.name, services.name], {
  strictDi: true
});