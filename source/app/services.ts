import AuthService from './services/auth.service';
import BackendService from "./services/backend.service";
import DataService from "./services/data.service";

let mod = angular.module('services', []);

mod.service('authService', AuthService);
mod.service('backendService', BackendService);
mod.service('dataService', DataService);

export default mod;
