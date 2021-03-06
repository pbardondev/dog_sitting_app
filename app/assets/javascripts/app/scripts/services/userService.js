define('services/userService', ['services', 'angular-cookies'], function(services){
    'use strict';
    return services.factory('UserService',
            [ '$q', '$cookies', '$log', '$http',
            function($q, $cookies, $log, $http) {

        function UserService() {
            this.user = {
                email: '',
                token: ''
            };

            this.isUserLoggedIn = function() {
                if (typeof $cookies.get('X-PP-TOKEN') === 'undefined') {
                    return false;
                }

                this.user.token = $cookies.get('X-PP-TOKEN');
                return true;
            };

            this.createUser = function (userInfo) {
                var oThis = this,
                    deferred = $q.defer(),
                    loginInfo = {
                        user: {
                            email: userInfo.email,
                            password: userInfo.password
                        }
                };

                $log.info('Attempting to create user with info: ', JSON.stringify(loginInfo));
                var config = { login: true };
                $http.post('/users', JSON.stringify(loginInfo), config)
                .then(function (response) {
                    $log.info('response from server:\n',
                        JSON.stringify(response));
                    var responseToken = response.headers()['x-pp-token'];
                    $cookies.put('X-PP-TOKEN', responseToken);
                    oThis.user.token = responseToken;
                    oThis.user.email = response.data.email;
                    $log.info(JSON.stringify($cookies.getAll()));
                    deferred.resolve();
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;

            };

            this.loginUser = function(userInfo) {
                var deferred = $q.defer(),
                    oThis = this;

                var loginInfo = {
                    user: {
                        email: userInfo.email,
                        password: userInfo.password
                    }
                };

                var config = { login: true };
                $http.post('/session', JSON.stringify(loginInfo), config)
                .then(function(results) {
                    $log.info('success response from server:\n',
                        JSON.stringify(results));
                    var responseToken = results.headers()['x-pp-token'];
                    $cookies.put('X-PP-TOKEN', responseToken);
                    oThis.user.email = results.data.email;
                    oThis.user.token = responseToken;
                    $log.info(JSON.stringify($cookies.getAll()));
                    deferred.resolve();
                }, function(err) {
                    $log.error('error response from new session was ', JSON.stringify(err));
                    deferred.reject(err);
                });

                return deferred.promise;
            };

            this.logoutCurrentUser = function() {
                var deferred = $q.defer(),
                    oThis = this;

                $http.delete('/session')
                .then(function(result) {
                    $log.info('deleted session with response:', JSON.stringify(result));
                    oThis.user.email = '';
                    oThis.user.token = '';
                    $cookies.remove('X-PP-TOKEN');
                    deferred.resolve(result);
                }, function(err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            };
        }
        return new UserService();
    }]);
});
