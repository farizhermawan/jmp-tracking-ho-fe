import * as angular from "angular";

import './vendor';
import './styles.scss';
import './custom';

import components from './app/components';
import directives from './app/directives';
import services from './app/services';
import config from './app/config';
import run from "./app/run";

let app = angular.module('angular-admin-lte', [
  'angular-jwt',
  'auth0.lock',
  'ui.router',
  'moment-picker',
  'oi.select',
  'ngInputCurrency',
  'oitozero.ngSweetAlert',
  'ds.clock',
  'ngSanitize',
  'ngCookies'
]);

app.config(config);

app.run(run);

angular.bootstrap(document.body, [app.name, components.name, directives.name, services.name], {
  strictDi: true
});
