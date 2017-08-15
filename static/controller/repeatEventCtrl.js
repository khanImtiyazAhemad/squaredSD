angular.module('avaanaController').controller('repeatEventCtrl', function(apiService, $scope, $rootScope, $mdDialog, $filter, eventdate, edit_Data, from) {
	$scope.eventdate = eventdate
	$scope.edit_Data = edit_Data
    $scope.from = from
    $scope.for_string = $scope.from=='new'?" appointments":" occurence"
	if($scope.edit_Data){
		$scope.repeatEventObj = $scope.edit_Data
		console.log(JSON.stringify($scope.repeatEventObj))
	}else{
		$scope.repeatEventObj = {}
		$scope.repeatEventObj.repeats = 'Weekly'
		$scope.repeatEventObj.ends_on = 'Never'
		$scope.repeatEventObj.ends_monthly = 'Day of the month'
		$scope.repeatEventObj.selected = ["Sunday"];
        $scope.repeatEventObj.selected_index = [0];
        $scope.weekly_string = 'Sunday'
	}
    $scope.repeatEventObj.start_date = $scope.eventdate
    var days_json = apiService.reverse_days_json
    $scope.days = days_list = Object.keys(days_json)

    $scope.cancel = function() {
        $mdDialog.hide()
    }

    $scope.event_submit = function() {
        $scope.repeatEventObj.data={
        	repeat_type : $scope.repeatEventObj.repeats,
        	weekly_days : $scope.repeatEventObj.repeats=='Weekly' ? $scope.repeatEventObj.selected_index : null,
            monthly_type : $scope.repeatEventObj.repeats=='Monthly' ? $scope.repeatEventObj.ends_monthly:null,
        	monthly_date : $scope.repeatEventObj.repeats=='Monthly' ? $scope.repeatEventObj.ends_monthly=='Day of the month'?$scope.repeatEventObj.start_date:$filter('date')($scope.repeatEventObj.start_date, 'EEEE'):null,
        	start_date : $scope.repeatEventObj.start_date,
            yearly_date : $scope.repeatEventObj.repeats=='Yearly' ? $scope.repeatEventObj.start_date : null,
        	end_type : $scope.repeatEventObj.ends_on,
        	repeat_occurance : $scope.repeatEventObj.ends_on=='After Occurence'?$scope.repeatEventObj.repeats_occurance:null,
        	end_on : $scope.repeatEventObj.ends_on=='End On'? $scope.repeatEventObj.end_date : null
        }
        $scope.repeatEventData = $scope.repeatEventObj
        $mdDialog.hide()
    }


    $scope.$watch('repeatEventObj.repeats + repeatEventObj.selected + repeatEventObj.start_date + repeatEventObj.ends_monthly + repeatEventObj.ends_on + repeatEventObj.repeats_occurance + repeatEventObj.end_date', function() {
        var end_check = undefined
        if($scope.repeatEventObj.ends_on=='Never'){
        	end_check = ''
        }else if($scope.repeatEventObj.ends_on=='After Occurence'){
        	end_check = " for "+$scope.repeatEventObj.repeats_occurance+$scope.for_string
        }else{
        	end_check = " until "+$filter('date')($scope.repeatEventObj.end_date, 'MMMM dd, yyyy')
        }
        if($scope.repeatEventObj.repeats == 'Daily' || $scope.repeatEventObj.repeats == 'Every Weekday'){
        	$scope.repeatEventObj.event_summary = $scope.repeatEventObj.repeats+end_check
        }else if($scope.repeatEventObj.repeats == 'Weekly'){
        	$scope.repeatEventObj.event_summary = $scope.repeatEventObj.repeats + " on " + $scope.weekly_string+end_check
        }else if($scope.repeatEventObj.repeats == 'Monthly'){
        	if($scope.repeatEventObj.ends_monthly=='Day of the month'){
        		$scope.repeatEventObj.event_summary = $scope.repeatEventObj.repeats + " on day " + $filter('date')($scope.repeatEventObj.start_date, 'dd')+" of each month"+end_check;
        	}else{
                var month_week_day = new Date($scope.repeatEventObj.start_date);
                var week_number = Math.ceil((month_week_day.getDate() - 1 - month_week_day.getDay()) / 7)
                var firstDateOfMonth = new Date(month_week_day.getFullYear(), month_week_day.getMonth(), 1);
                var lastDateOfMonth = new Date(month_week_day.getFullYear(), month_week_day.getMonth(), 0);
                var current_lastDateOfMonth = new Date(month_week_day.getFullYear(), month_week_day.getMonth()+1, 0);
                var number_of_weeks = Math.ceil( (firstDateOfMonth.getDay() + lastDateOfMonth.getDate()) / 7);
                week_count={
                    '0':"First ",
                    '1':month_week_day.getDay()<firstDateOfMonth.getDay()?"First ":"Second ",
                    '2':month_week_day.getDay()<firstDateOfMonth.getDay()?"Second ":"Third ",
                    '3':month_week_day.getDay()>current_lastDateOfMonth.getDay() && week_number<=number_of_weeks?"Last ":"Third ",
                    '4':month_week_day.getDay()<=current_lastDateOfMonth.getDay() && week_number<=number_of_weeks?"Last ":"Fourth ",
                    '5':month_week_day.getDay()<=current_lastDateOfMonth.getDay() && week_number<=number_of_weeks?"Last ":"Fifth ",
                }
        		$scope.repeatEventObj.event_summary = $scope.repeatEventObj.repeats + " on the "+week_count[week_number]+ $filter('date')($scope.repeatEventObj.start_date, 'EEEE')+end_check;
                $scope.repeatEventObj.monthly_week = week_count[week_number]
                $scope.repeatEventObj.monthly_day = parseInt(days_json[$filter('date')($scope.repeatEventObj.start_date, 'EEE')])
        	}
        }
        else if($scope.repeatEventObj.repeats == 'Yearly'){
        	$scope.repeatEventObj.event_summary = $scope.repeatEventObj.repeats + " on " + $filter('date')($scope.repeatEventObj.start_date, 'MMMM dd')+end_check;
        }

    })


    $scope.toggle = function(item, list) {
        $scope.weekly_string = ''
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
            $scope.repeatEventObj.selected_index.splice(idx,1);
        } else {
            list.push(item);
            $scope.repeatEventObj.selected_index.push(days_json[item]);
        }
        $scope.weekly_string = list.toString().replace(/,/g, ', ').replace(/,(?=[^,]+$)/, ' and ')
        console.log($scope.repeatEventObj.selected_index)
    };
    $scope.exists = function(item, list) {
        return list.indexOf(item) > -1;
    };

});
