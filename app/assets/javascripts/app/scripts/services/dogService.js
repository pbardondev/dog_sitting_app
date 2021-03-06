define('services/dogService', ['services', 'services/userService'], function(services) {
    'use strict';
    return services.factory('DogService', [ '$q', '$http', 'UserService', '$log',
        function($q, $http, userSvc, $log) {

            function DogService() {
                this.dogUrl = '/api/dogs';

                this.getDogPage = function(page) {
                    var deferred = $q.defer(),
                        oThis = this;

                    var config = {
                        params : {
                            'search' : 'all',
                            'page' : page
                        },
                        skipToken: true
                    };

                    $http.get(this.dogUrl, config)
                        .then(function(result) {
                            if (result.data) {
                                $log.info(JSON.stringify(result));
                                oThis.dogs = result.data;
                                deferred.resolve(result.data);
                            }
                        }, function(err) {
                            $log.error(err);
                            deferred.reject(err);
                        });

                    return deferred.promise;
                };

                this.getCurrentUserDogs = function() {
                    var deferred = $q.defer(),
                        oThis = this;
                    $http.get('/api/dogs')
                    .then(function(result) {
                        if (result.data) {
                            $log.info(JSON.stringify(result));
                            oThis.dogs = result.data;
                            deferred.resolve(result.data);
                        }
                    }, function(err) {
                        $log.error(err);
                        deferred.reject(err);
                    });

                    return deferred.promise;

                };

                this.createDog = function(formData) {
                    var deferred = $q.defer(),
                        config = {
                            headers: {
                                'Content-Type' : 'application/json'
                            }
                        },
                        data = formData || {};

                    $http.post('/api/dogs', { dog: formData }, config)
                    .then(function(result) {
                        $log.info(JSON.stringify(result));
                        if (result.status !== 200) {
                            var errMsg = 'Unable to create dog: ' + result.message;
                            $log.error(errMsg);
                            deferred.reject(new Error(errMsg));
                            return;
                        }
                        deferred.resolve(result);
                    }, function(err) {
                        $log.error(err);
                        deferred.reject(err);
                    });

                    return deferred.promise;
                };
            }
            return new DogService();
        }]);
});
