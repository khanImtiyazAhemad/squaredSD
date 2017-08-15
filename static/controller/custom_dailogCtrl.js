angular.module('avaanaController').controller('custom_dailogCtrl', function($scope, $mdDialog, $state, message) {
    $scope.alertMessage = message;

    $scope.closeClick = function(){
        $mdDialog.hide();
    }
});
