angular.module("squaredSDController").controller("homeCtrl", function(apiService, $scope) {
	apiService.getData('productList', {}, 'get').then(function(success) {
		// console.log(JSON.stringify(success))
        if (success.status == 200) {
        	$scope.productList = success.data
        }else {

        }
    }, function(error) {
		console.log(JSON.stringify(error))
    });
   
});
