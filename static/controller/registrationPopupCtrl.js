angular.module('avaanaController').controller('registrationPopupCtrl', function(apiService, $scope, $mdDialog) {
    $scope.close=function(){
        $mdDialog.hide()
    }
});