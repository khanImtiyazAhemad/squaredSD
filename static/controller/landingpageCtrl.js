angular.module("avaanaController").controller("landingpageCtrl", function($scope, $state) {


$scope.landingPage={};


$scope.landingPage.listYourBusiness_Click=function(){
   $state.go('app.listyourbusiness')
}
$scope.landingPage.price_Click=function(){

    $state.go('app.planpricing')

}


  
});