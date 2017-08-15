angular.module('avaanaController').controller('welcomePackCtrl', function(apiService, $scope, $stateParams, $mdDialog, $state, Message,type,$timeout) {
    $scope.alertMessage = Message;
    $scope.type = type;

    var focus_function = function(location){
            $("#"+location).focus()
    }

});