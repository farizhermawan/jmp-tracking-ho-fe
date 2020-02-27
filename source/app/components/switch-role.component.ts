import DefaultPage from "../classes/default-page";

export default class SwitchRoleComponent extends DefaultPage {

  constructor(private $rootScope) {
    super(
      {role: []},
      {},
      {},
      {}
    );
  }

  static Factory() {
    return {
      controller: SwitchRoleComponent,
      templateUrl: 'views/components/switch-role.html'
    };
  }

  $onInit() {
    this.list.role = ['admin', 'Owner', 'Supervisor', 'Operator'];
  }

  switchRole(role) {
    this.$rootScope.user.role = role;
    this.$rootScope.user.roleSwitched = true;
  }
}

SwitchRoleComponent.$inject = ['$rootScope'];
