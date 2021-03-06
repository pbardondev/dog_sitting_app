var $controller,
    $httpBackend,
    $rootScope,
    logoutResponse,
    createController,
    navbarCtrl;

define(['angular', 'angularMocks', 'pawPalApp', 'controllers', 'controllers/navbarController'], function() {
    describe('Starting navbar controller test', function () {
        beforeEach(module('pawPalApp'));
        beforeEach(module('controllers'));

        beforeEach(inject(function (_$controller_, _$httpBackend_, _$rootScope_) {
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;

            var $state = {
                transitionTo : function(state) {
                    console.log('transitioning to : ', state.toString());
                }
            };

            logoutResponse = $httpBackend.when('DELETE', '/session')
            .respond({
                'email' : 'test123@email.com',
                'token' : 'AAAAAAAAAAAA'
            });

            createController = function () {
                return $controller('NavbarCtrl', {'$scope': $rootScope, '$state': $state });
            };
            navbarCtrl = createController();
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('navbar controller test', function() {
            console.log('starting navbar controller test...');

            it('should be able to instantiate a navbar controller', function() {
                expect(navbarCtrl).not.toBeUndefined();
            });

            it('should be able to log out', function() {
                expect($rootScope.logout).not.toBeUndefined();
                $httpBackend.expect('DELETE', '/session');
                $rootScope.logout()
                .then(function(){
                    expect($rootScope.loggedIn).not.toBe(true);
                });
                $httpBackend.flush();
            });

        });


    });
});