angular.module('avaanaController').controller('ratingCtrl', function(apiService,$scope, $rootScope, $mdDialog, $sce, $uibModal, appointment) {
	$scope.appointment = appointment
	console.log($scope.appointment.business_detail.business_detail.reviews_active)
	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};


	$scope.wordType=function(){

	 if($scope.comment.length >500){
			$scope.ErrorMessage='Maximum review size is 500 characters.';
		}
	};

	$scope.answer = function(answer) {
		if($('input[type=radio]:checked').val()=="" || $('input[type=radio]:checked').val()==undefined || $('input[type=radio]:checked').val()==null){
					$scope.ErrorMessage='Please select a star rating.';
				
				}	else if($scope.comment =="" || $scope.comment ==undefined || $scope.comment ==null){
					$scope.ErrorMessage='Please enter a comment.';
				
				}else {
				data = {
					appointment_id: $scope.appointment.id,
					rate1: parseFloat($('#rateset_1 input[type=radio]:checked').val()),
					rate2: parseFloat($('#rateset_2 input[type=radio]:checked').val()),
					rate3: parseFloat($('#rateset_3 input[type=radio]:checked').val()),
					rate4: parseFloat($('#rateset_4 input[type=radio]:checked').val()),
					rate5: parseFloat($('#rateset_5 input[type=radio]:checked').val()),
					comment: $scope.comment,
					business: $scope.appointment.business,
					practitioner: $scope.appointment.business_practitioner,
					service_name: $scope.appointment.service_name
				}
				if(data.rate==null){
					$scope.ErrorMessage='Please select a star rating.'
				}
				apiService.getDataWithToken('a_rating/', data, 'post').then(function(success){
				  if(success.data.status==200){
				         $mdDialog.hide();
				         $scope.appointment.appointment_rated=true
				  }
				  },function(error){
				  });
			};
		};
});