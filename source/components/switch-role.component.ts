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

  $onInit() {
    this.list.role = ['admin', 'Owner', 'Finance', 'Koordinator'];
  }

  switchRole(role) {
    this.$rootScope.user.role = role;
    this.$rootScope.user.roleSwitched = true;
  }

  static Factory() {
    return {
      controller: SwitchRoleComponent,
      templateUrl: 'views/components/switch-role.html'
    };
  }
}

SwitchRoleComponent.$inject = ['$rootScope'];