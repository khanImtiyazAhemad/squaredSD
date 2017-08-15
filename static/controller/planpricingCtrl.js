angular.module("avaanaController").controller("planpricingCtrl", function($scope, $state) {

$scope.price={};
$scope.price.partnerAvaClick=function(){

	
   $state.go('app.listyourbusiness')
}

});