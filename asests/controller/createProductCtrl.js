angular.module("squaredSDController").controller("createProductCtrl", function($scope, apiService, $state) {

    $scope.Addproducts = function() {
        if ($scope.productName==undefined || $scope.productName==null || $scope.productName=='') {
        		$scope.productNameErr = 'Please enter your Product name'
        } else {
        		$scope.productNameErr = null        		
        }

        if ($scope.description==undefined || $scope.description==null || $scope.description=='') {
        		$scope.descriptionErr = 'Please enter your Product name'
        } else {
        		$scope.descriptionErr = null        		

        }
        if ($scope.descriptionErr==null && $scope.productNameErr==null) {
            var data = {
                product_name: $scope.productName,
                product_description: $scope.description
            }
            apiService.getDataWithToken('createProduct', data, 'post').then(function(success) {
                // console.log(JSON.stringify(success))
                if (success.status == 201) {
                    $state.go('app.home')
                } else {

                }
            }, function(error) {
                console.log(JSON.stringify(error))
            });
        }


    }

});