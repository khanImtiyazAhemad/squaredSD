angular.module("avaanaController").controller("forgotPasswordCtrl", function($scope, $state, $stateParams, apiService) {


    $scope.obj = {}
    $scope.not_send = true;
    $scope.notification = false;
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


    $scope.obj.validateEmail = function() {
        if ($scope.obj.email == null || $scope.obj.email == undefined || $scope.obj.email == '') {
            $scope.obj.emailErr = "Please enter email to send a forgot password link to.";
        } else if (!emailRegex.test($scope.obj.email)) {
            $scope.obj.emailErr = "Please enter a valid email.";
        } else {
            $scope.obj.emailErr = null
        }
    }

    $scope.obj.forgotPassword = function() {
        $scope.obj.validateEmail()
        if ($scope.obj.emailErr == null) {
            data = {
                email: $scope.obj.email
            }
            apiService.getData('a_forgot_password/', data, 'post').then(function(success) {
                if (success.data.status == 200) {
                    $scope.not_send = false;
                    $scope.notification = true;
                } else if (success.data.status != 200) {
                    $scope.obj.failureErr = success.data.Message;
                }
            }, function(error) {
            });
        }
    }


})