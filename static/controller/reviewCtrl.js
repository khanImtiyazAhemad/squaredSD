angular.module('avaanaController').controller('reviewCtrl', function(apiService, $scope,$stateParams) {
    apiService.getData('a_appointment_detail/'+$stateParams.key, {}, 'get').then(function(success) {
        if (success.data.status == 200) {
        	$scope.appointment = success.data.appointment_details
            $scope.comment = success.data.reviews_active=='Enable'?true:false;
        }
    }, function(error) {
    });

    $scope.wordType = function() {
        if ($scope.comment.length > 500) {
            $scope.ErrorMessage = ' Please enter max 500 character';
        }
    };
    $scope.answer = function() {
        if ($('input[type=radio]:checked').val() == "" || $('input[type=radio]:checked').val() == undefined || $('input[type=radio]:checked').val() == null) {
            $scope.ErrorMessage = 'Please select a star rating.';

        } else if ($scope.comment == "" || $scope.comment == undefined || $scope.comment == null) {
            $scope.ErrorMessage = 'Please enter a comment.';
        } else {
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
                service_name: $scope.appointment.service_name,
                customer: $scope.appointment.customer,
            }
            console.log("Rating-->" + JSON.stringify(data))
            if (data.rate == null) {
                $scope.ErrorMessage = 'Please select a star rating.'
            }
            apiService.getData('a_review/', data, 'post').then(function(success) {
                if (success.data.status == 200) {

                }else if(success.data.status != 200){
                	$scope.ErrorMessage=success.data.Message
                }
            }, function(error) {
            });
        };
    };
});