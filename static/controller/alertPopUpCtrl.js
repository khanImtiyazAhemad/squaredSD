angular.module('avaanaController').controller('alertPopUpCtrl', function(apiService, $scope, $stateParams, $mdDialog, $state, Message,type,$timeout,next_Step,current_Step,Heading, callback,scope) {
    $scope.alertMessage = Message;
    $scope.type = type;
    $scope.next_Step = next_Step;
    $scope.current_Step = current_Step;
    $scope.alertHeading = Heading;
    $scope.callback = callback
    $scope = scope
    
    
    var focus_function = function(location){
            $("#"+location).focus()
    }

    // $scope.continue= function(){
    //     if($scope.current_Step=='2'){
    //         $scope.business.step2Continue()
    //     }else if($scope.current_Step=='3'){
    //         $scope.step3()
    //     }
    //     $mdDialog.hide();
    //     // $destroy();
    // }

    // $scope.step2= function(){
    //     if($scope.current_Step=='2'){
    //         $timeout(function() {focus_function('pract_name');}, 100);
    //     }else if($scope.current_Step=='3'){
    //         $timeout(function() {focus_function('buss_prof');}, 100);
    //     }
    //     $mdDialog.hide();
    //     // $destroy();
    // }

    $scope.yes = function(){
        $scope.callback();
        $mdDialog.hide();
    }
    $scope.no = function(){
        $mdDialog.hide();
    }
});
