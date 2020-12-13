import AppComponent from './components/app.component';
import HeaderComponent from './components/header.component';
import MainSidebarComponent from './components/main-sidebar.component';
// pages
import DashboardComponent from './components/dashboard.component';
import TransaksiMainComponent from './components/transaksi.main.component';
import CallbackComponent from "./components/callback.component";
import BallanceComponent from "./components/ballance.component";
import FinanceComponent from "./components/finance.component";
import ListTransaksiComponent from "./components/list-transaksi.component";
import MasterVehicleComponent from "./components/master.vehicle.component";
import MasterDriverComponent from "./components/master.driver.component";
import MasterKenekComponent from "./components/master.kenek.component";
import MasterUserComponent from "./components/master.user.component";
import ViewTransaksiComponent from "./components/view-transaksi.component";
import SwitchRoleComponent from "./components/switch-role.component";
import MasterRouteComponent from "./components/master.route.component";
import MasterCustomerComponent from "./components/master.customer.component";
import BiayaKendaraanComponent from "./components/transaksi.undirect.component";
import ListBiayaKendaraanComponent from "./components/list-transaksi-undirect.component";
import reportBiayaKendaraanComponent from "./components/list-transaksi-report.component";
import BiayaTidakLangsungComponent from "./components/transaksi-undirect-v2.component";
import ListBiayaTidakLangsungComponent from "./components/list-transaksi-undirect-v2.component";
import MonitorComponent from "./components/monitor.component";

// module
let mod = angular.module('components', []);

mod.component('app', AppComponent.Factory());
mod.component('header', HeaderComponent.Factory());
mod.component('mainSidebar', MainSidebarComponent.Factory());
// pages
mod.component('dashboard', DashboardComponent.Factory());
mod.component('monitor', MonitorComponent.Factory());
mod.component('ballance', BallanceComponent.Factory());
mod.component('finance', FinanceComponent.Factory());
mod.component('listTransaksi', ListTransaksiComponent.Factory());
mod.component('viewTransaksi', ViewTransaksiComponent.Factory());
mod.component('routes', MasterRouteComponent.Factory());
mod.component('customers', MasterCustomerComponent.Factory());
mod.component('vehicles', MasterVehicleComponent.Factory());
mod.component('drivers', MasterDriverComponent.Factory());
mod.component('keneks', MasterKenekComponent.Factory());
mod.component('users', MasterUserComponent.Factory());
mod.component('transaksiMain', TransaksiMainComponent.Factory());
mod.component('biayaKendaraan', BiayaKendaraanComponent.Factory());
mod.component('listBiayaKendaraan', ListBiayaKendaraanComponent.Factory());
mod.component('reportBiayaKendaraan', reportBiayaKendaraanComponent.Factory());
mod.component('biayaTidakLangsung', BiayaTidakLangsungComponent.Factory());
mod.component('listBiayaTidakLangsung', ListBiayaTidakLangsungComponent.Factory());
// other
mod.component('switchRole', SwitchRoleComponent.Factory());
mod.component('loginCallback', CallbackComponent.Factory());

export default mod;
