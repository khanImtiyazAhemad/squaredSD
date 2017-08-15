angular.module('avaanaController').controller('staffProfileCtrl', function(apiService,$scope,$mdDialog,practitioner, business_timing) {

	$scope.practitioner = practitioner
	$scope.business_timing = business_timing
	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
	$scope.closeClick=function(ev){
		$mdDialog.hide();
}
});