angular.module("avaanaController").controller("checkoutConfirmCtrl", function($scope, $state, $stateParams, apiService,$filter) {
    apiService.getData("a_appointment_detail/"+ $stateParams.appointment_id+"/", {}, 'get').then(function(res) {
        $scope.appointment_details = res.data.appointment_details
        appointment_values()
    });

    var appointment_values = function(){
        $scope.length = $scope.appointment_details.length
    	$scope.customerName = $scope.appointment_details.customer_name
    	$scope.businessImage = $scope.appointment_details.business_image
    	$scope.businessLocation = $scope.appointment_details.business_location.address+" "+$scope.appointment_details.business_location.city+","+$scope.appointment_details.business_location.state+" "+$scope.appointment_details.business_location.postal_code
        $scope.businessname = $scope.appointment_details.business_name
        $scope.practitionername = $scope.appointment_details.practitioner_name
        $scope.appointmentDate = $filter('date')($scope.appointment_details.appointment_date, "dd MMMM yyyy")
        $scope.appointmentTime = $scope.appointment_details.appointment_start_time
        $scope.servicename = $scope.appointment_details.service_name
        $scope.appointmentPrice =$scope.appointment_details.appointment_price <=0 ?"Free":$scope.appointment_details.appointment_price
    }
});