import Constant from "./classes/constant";

function run(lock, authService, backendService, SweetAlert, $rootScope, $state, $timeout, $location, $cookies) {

  if (location.hostname != 'localhost' && location.protocol != 'https:')
  {
    location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
  }

  $rootScope.user = {
    id: null,
    auth0_id: null,
    name: null,
    remember_token: null,
    role: "not connected"
  };

  $rootScope.logout = function() {
    SweetAlert.swal({
      title: "Ingin keluar dari aplikasi?",
      text: "Pastikan tidak ada pekerjaan yang belum disimpan!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }, function (confirm) {
      if(confirm) {
        $rootScope.user.role = "not connected";
        $cookies.remove("savedAuth");
        authService.logout();
      }
    });
  };

  $rootScope.isLoggedIn = function() {
    return $rootScope.user.role != 'not connected';
  };

  $rootScope.isRegistered = function() {
    return $rootScope.isLoggedIn() && $rootScope.user.role != 'unknown';
  };

  let callbackAfterAuth = function (authResult) {
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);
    $cookies.put('savedAuth', authResult.idTokenPayload.at_hash, {domain: Constant.BASE_DOMAIN, expires: expireDate});
    backendService.callbackLogin(authResult, function () {
      loadProfile();
    });
  };

  authService.listenForAuth(callbackAfterAuth);

  // $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
  //   if(!authService.userHasRole(toStateParams.roles)) {
  //     $state.go('default');
  //   }
  // });

  let timeoutToRedirect = null;

  $timeout(function () {
    if (!authService.isAuthenticated()) {
      if ($state.current.name == "callback") {
        $state.go('default');
        timeoutToRedirect = $timeout(function () {
          location.href = "/";
        }, 10000);
      }
      else {
        if ($location.path() != "/") localStorage.setItem("redirectUrl", $location.path());
        var savedAuth = $cookies.get("savedAuth");
        if (typeof savedAuth === "undefined") {
          $state.go('default');
          authService.login();
        }
        else {
          backendService.savedAuth({hash: savedAuth}, function (resp) {
            if (resp.data.authResult == null) {
              $state.go('default');
              authService.login();
            }
            else {
              authService.callbackAfterAuth(function () {
                location.href = "/";
              }, resp.data.authResult);
            }
          })
        }
      }
    }
    else {
      loadProfile();
    }
  }, 100);

  function loadProfile() {
    backendService.getProfile(function(resp) {
      if (timeoutToRedirect != null) $timeout.cancel(timeoutToRedirect);
      if (resp.data.message == 'success') {
        $rootScope.user = resp.data.profile;
        if($rootScope.user.role == "unknown") {
          $state.go('default');
          SweetAlert.swal({
            title: "Akun anda tidak terdaftar",
            text: "Pastikan anda login dengan akun yang benar!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Coba Lagi",
            cancelButtonText: "Keluar",
            closeOnConfirm: true
          }, function(isConfirm){
            if(isConfirm) {
              location.href = "/";
            }
            else {
              $rootScope.user.role = "not connected";
              authService.logout();
            }
          });
        }
        else if($state.current.name == "callback" || $state.current.name == "default") {
          var redirect = localStorage.getItem("redirectUrl");
          $state.go(redirect == null || redirect == "/" ? "dashboard" : redirect.toString().substr(1));
          localStorage.removeItem("redirectUrl")
        }
      }
      else if (resp.data.message == 'inactive') {
        $state.go('default');
        SweetAlert.swal({
          title: "Akun anda dinonaktifkan",
          text: "Pastikan anda login dengan akun yang benar!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Coba Lagi",
          cancelButtonText: "Keluar",
          closeOnConfirm: true
        }, function(isConfirm){
          if(isConfirm) {
            location.href = "/";
          }
          else {
            $rootScope.user.role = "not connected";
            authService.logout();
          }
        });
      }
      else {
        authService.logout();
        $state.go('default');
      }
    });
  }
}

run.$inject = ['lock', 'authService', 'backendService', 'SweetAlert', '$rootScope', '$state', '$timeout', '$location', '$cookies'];

export default run;
