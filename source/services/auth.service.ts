export default class AuthService {

  constructor(private lock) {}

  listenForAuth(callback) {
    let _this = this;
    this.lock.interceptHash();
    this.lock.on('authenticated', function (authResult) {
      _this.callbackAfterAuth(callback, authResult);
    });
  }

  callbackAfterAuth(callback, authResult) {
    var parsedAuthResult = {
      accessToken: authResult.accessToken,
      idToken: authResult.idToken,
      idTokenPayload: authResult.idTokenPayload,
      expiresIn: authResult.expiresIn
    };
    this.setSettion(parsedAuthResult);
    callback(parsedAuthResult);
  }

  login() {
    this.lock.show()
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.login();
  }

  isAuthenticated() {
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  setSettion(authResult) {
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

}

AuthService.$inject = ['lock'];