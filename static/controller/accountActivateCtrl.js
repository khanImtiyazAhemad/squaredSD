angular.module("avaanaController").controller("accountActivateCtrl", function($scope, apiService, $state, $filter, $stateParams) {
    $scope.obj = {}
    $scope.obj.savePassword = function() {
        if ($scope.obj.new_password == "" || $scope.obj.new_password == undefined || $scope.obj.new_password == null) {
            $scope.obj.new_passwordErr = "Please enter your new password.";
        } else if ($scope.obj.new_password.length < 8) {
            $scope.obj.new_passwordErr = "Password needs to be at least 8 characters.";
        } else {
            $scope.obj.new_passwordErr = null;
        }
        if ($scope.obj.confirm_password == "" || $scope.obj.confirm_password == undefined || $scope.obj.confirm_password == null) {
            $scope.obj.confirm_passwordErr = "Please confirm your password.";
        } else if ($scope.obj.confirm_password != $scope.obj.new_password) {
            $scope.obj.confirm_passwordErr = "Passwords do not match.";
        } else {
            $scope.obj.confirm_passwordErr = null;
        }
        if ($scope.obj.new_passwordErr == null && $scope.obj.confirm_passwordErr == null) {
            data={
                password:$scope.obj.new_password,
                confirm_password:$scope.obj.confirm_password
            }
            apiService.getData('a_activate_account_password/'+$stateParams.slug+"/", data, 'post').then(function(success) {
                if (success.data.status == 200) {
                    $state.go('app.home')
                } else if (success.data.status != 500) {
                    $scope.obj.failureErr = success.data.Message
                }
            }, function(error) {
            });
        }
    }

})