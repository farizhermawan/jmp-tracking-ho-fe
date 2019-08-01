import AuthService from './services/auth.service';
import BackendService from "./services/backend.service";

let mod = angular.module('services', []);

mod.service('authService', AuthService);
mod.service('backendService', BackendService);

export default mod;