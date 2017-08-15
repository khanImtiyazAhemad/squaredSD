angular.module('avaanaController').controller('update_new_appointmentCtrl', function(spinnerService, apiService, $scope, $mdDialog, event, events, $filter, $mdpTimePicker,calendar, existing_events, practitioner) {
    $scope.event = event
    $scope.events = events
    $scope.existing_events = existing_events
    $scope.practitioner = practitioner
    console.log(JSON.stringify($scope.practitioner))
    $scope.calendar = calendar
    var numRegex = /^\d+$/;
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    data={
        id : $scope.event.id,
        type : $scope.event.type
    }
    $scope.updateAppointment = {}
    $scope.repeatEventData ={}
    days_json = apiService.days_json

    function eveSummary(detail_obj){
        $scope.repeatEventData.selected=[]
        if(detail_obj.weekly_days){
            $scope.repeatEventData.selected_index = detail_obj.weekly_days;
           for (i=0;i<detail_obj.weekly_days.length;i++){
                $scope.repeatEventData.selected.push(days_json[detail_obj.weekly_days[i]])
            }
        }else{
            $scope.repeatEventData.selected_index = [0];
            $scope.repeatEventData.selected=['Sun']
        }

        if(detail_obj.end_type=='Never'){
            end_check = ''
        }else if(detail_obj.end_type=='After Occurence'){
            end_check = ", "+detail_obj.repeat_occurance+" times"
        }else{
            end_check = ", until "+$filter('date')(detail_obj.end_on, 'MMMM dd, yyyy')
        }
        if(detail_obj.repeat_type == 'Daily' || detail_obj.repeat_type == 'Every Weekday'){
            $scope.repeatEventData.event_summary = detail_obj.repeat_type+end_check
        }else if(detail_obj.repeat_type == 'Weekly'){
            $scope.repeatEventData.event_summary = detail_obj.repeat_type + " on " + $scope.repeatEventData.selected+end_check
        }else if(detail_obj.repeat_type == 'Monthly'){
            if(detail_obj.monthly_type=='Day of the month'){
                $scope.repeatEventData.event_summary = detail_obj.repeat_type + " on day " + $filter('date')(detail_obj.appointment_date, 'dd')+end_check;
            }else{
                var month_week_day = new Date(detail_obj.appointment_date);
                var week_number = Math.ceil((month_week_day.getDate() - 1 - month_week_day.getDay()) / 7)
                var firstDateOfMonth = new Date(month_week_day.getFullYear(), month_week_day.getMonth()-1, 1);
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
                $scope.repeatEventData.event_summary = detail_obj.repeat_type + " on the " +week_count[week_number]+ $filter('date')(detail_obj.appointment_date, 'EEEE')+end_check;
                $scope.repeatEventData.monthly_week = week_count[week_number]
                $scope.repeatEventData.monthly_day = parseInt(days_json[$filter('date')(detail_obj.blocked_date, 'EEE')])
            }
        }
        else if(detail_obj.repeat_type == 'Yearly'){
            $scope.repeatEventData.event_summary = detail_obj.repeat_type + " on " + $filter('date')(detail_obj.appointment_date, 'MMMM dd')+end_check;
        }
        $scope.repeatEventData.repeats = detail_obj.repeat_type;
        $scope.repeatEventData.ends_on = detail_obj.end_type;
        $scope.repeatEventData.ends_monthly = detail_obj.monthly_type;
        $scope.repeatEventData.repeats_occurance = detail_obj.repeat_occurance
    }
    apiService.getDataWithToken('a_calendar_appointment_detail/', data, 'post').then(function(success) {
        // console.log("Success..." + JSON.stringify(success.data))
        $scope.appointment_details = success.data.appointment_details
        if (success.data.status == 200) {
            if(data.type == "new_appointment"){
                $scope.comment = success.data.appointment_details.comment;
                $scope.prac_name = success.data.appointment_details.practitioner_name;
            }else if(data.type == "permanent_appointment"){
                $scope.prac_name = success.data.appointment_details.practiitoner_detail.name;
            }
            $scope.customerEmail = success.data.appointment_details.customer_email;
            $scope.customerNumber = success.data.appointment_details.customer_phone;
            $scope.cal_date = new Date(success.data.appointment_details.appointment_date);
            $scope.customerName = success.data.appointment_details.customer_name;
            $scope.updateAppointment.startTimeText = success.data.appointment_details.appointment_start_time;
            $scope.updateAppointment.endTimeText = success.data.appointment_details.appointment_end_time;
            $scope.service_name = success.data.appointment_details.service_name;
            $scope.UpdateEventType=success.data.appointment_details.repeat_mode;
            eveSummary(success.data.appointment_details)
        } else {
            $scope.ApiErr = status.data.Error
        }
    }, function(error) {
        console.log('Error:' + JSON.stringify(error));
    });
    $scope.close=function(){
        $mdDialog.hide()
    }
    $scope.delete = function() {
        apiService.getDataWithToken('a_delete_appointment_detail/', data, 'post').then(function(success) {
            if (success.data.status == 200) {
                $mdDialog.hide()
                $('#'+$scope.calendar).fullCalendar('removeEvents', data.id);
                $('#calendar_'+localStorage.business_id).fullCalendar('removeEvents', data.id);
                angular.forEach($scope.existing_events, function(obj, key) {
                    if(obj.id==data.id){
                        $scope.existing_events.splice(key, 1);
                    }
                });
                angular.forEach($scope.practitioner, function(obj, key) {
                    if(obj.id==$scope.appointment_details.business_practitioner){
                        angular.forEach(obj.practitioner_new_appointments, function(value, key) {
                            if(value.id==$scope.appointment_details.id){
                                obj.practitioner_new_appointments.splice(key, 1);
                            }
                        });
                    }
                });
            } else {
                $scope.ApiErr = status.data.Error
            }
        }, function(error) {
            console.log('Error:' + JSON.stringify(error));
        });
    }

    $scope.updateAppointment.timeArray = apiService.timeArray

    // Validation Section
   $scope.ServiceNameValidation = function() {
        if ($scope.service_name == null || $scope.service_name == undefined || $scope.service_name == '') {
            $scope.ServiceNameErrErr = 'Please select a service for this appointment.'
        } else {
            $scope.ServiceNameErrErr = null
        }
    }


    $scope.PractitionerNameValidation = function() {
        if ($scope.prac_name == null || $scope.prac_name == undefined || $scope.prac_name == '') {
            $scope.PractitionerNameErr = 'Please select a practitioner for this appointment.'
        } else {
            $scope.PractitionerNameErr = null
        }
    }


    $scope.appointmentDateValidation = function() {
        if ($scope.cal_date == null || $scope.cal_date == undefined || $scope.cal_date == '') {
            $scope.appointmentDateErr = 'Please select a date.'
        } else {
            $scope.appointmentDateErr = null
        }
    }
    $scope.appointmentstartTimeValidation = function() {
         start_time_value = $('#start_time_bar input[type="search"]:eq(0)').val()
        if (start_time_value == null || start_time_value == undefined || start_time_value == '') {
            $scope.appointmentStartTimeErr = 'Please Select Start Time for Apppointment'
        } else {
            $scope.appointmentStartTimeErr = null
        }
    }
    $scope.appointmentendTimeValidation = function() {
        end_time_value = $('#end_time_bar input[type="search"]:eq(0)').val()
        if (end_time_value == null || end_time_value == undefined || end_time_value == '') {
            $scope.appointmentEndTimeErr = 'Please select a start time.'
        } else {
            $scope.appointmentEndTimeErr = null
        }
    }
    $scope.customerEmailValidation = function() {
        if ($scope.customerEmail == null || $scope.customerEmail == undefined || $scope.customerEmail == '') {
            $scope.customerEmailErr = 'Please enter a customer email.'
        } else if (!emailRegex.test($scope.customerEmail)) {
            $scope.customerEmailErr = "Please enter a valid email.";
        } else {
            $scope.customerEmailErr = null
        }
    }

    $scope.customerNameValidation = function() {
        if ($scope.customerName == null || $scope.customerName == undefined || $scope.customerName == '') {
            $scope.customerNameErr = "Please enter the customer's name."
        } else {
            $scope.customerNameErr = null
        }
    }

    $scope.customernumberValidation = function() {
        if ($scope.customerNumber == null || $scope.customerNumber == undefined || $scope.customerNumber == '') {
            $scope.customerNumberErr = "Please enter the customer's mobile number."
        } else if (!numRegex.test($scope.customerNumber)) {
            $scope.customerNumberErr = "Please use numbers only; no dashes or spaces."
        } else {
            $scope.customerNumberErr = null
        }
    }
    $scope.update = function() {
        $scope.ServiceNameValidation()
        $scope.appointmentDateValidation()
        $scope.appointmentstartTimeValidation()
        $scope.appointmentendTimeValidation()
        $scope.customerNameValidation()
        $scope.PractitionerNameValidation()
        if ($scope.ServiceNameErrErr == null && $scope.appointmentDateErr == null && $scope.appointmentStartTimeErr == null && $scope.appointmentEndTimeErr == null && $scope.customerNameErr == null && $scope.PractitionerNameErr == null) {
            spinnerService.show("html5spinner");
            data={
                id : $scope.event.id,
                type : $scope.event.type,
                customer_name:$scope.customerName,
                customer_email:$scope.customerEmail,
                customer_phone:$scope.customerNumber,
                service_name:$scope.service_name,
                service_id:$scope.appointment_details.service_id,
                business:$scope.appointment_details.business,
                business_practitioner:$scope.appointment_details.business_practitioner,
                appointment_start_time:start_time_value,
                appointment_end_time:end_time_value,
                appointment_price:$scope.appointment_details.appointment_price,
                appointment_date:$scope.cal_date,
                comment:$scope.comment,
            }
            apiService.getDataWithToken('a_update_calendar_appointment/', data, 'post').then(function(success) {
                if (success.data.status == 200) {
                    $mdDialog.hide()
                    var date = new Date(success.data.new_Appointment_data.appointment_date);
                    start_hours = apiService.convertHours_Minutes(success.data.new_Appointment_data.appointment_start_time, "start_hours")
                    start_min = apiService.convertHours_Minutes(success.data.new_Appointment_data.appointment_start_time, "start_min")
                    end_hours = apiService.convertHours_Minutes(success.data.new_Appointment_data.appointment_end_time, "end_hours")
                    end_min = apiService.convertHours_Minutes(success.data.new_Appointment_data.appointment_end_time, "end_min")
                    var repeat_true = success.data.new_Appointment_data.repeat_mode == 'Repeat';
                    dow = apiService.repeat_type_method(repeat_true, success.data.new_Appointment_data)
                    repeat_end_date = apiService.repeat_end_type_method(repeat_true, success.data.new_Appointment_data)
                    $('#'+$scope.calendar).fullCalendar('removeEvents');
                    $('#calendar_'+localStorage.business_id).fullCalendar('removeEvents');
                    for(i=0;i<$scope.events.length;i++){
                        if($scope.events[i].id==success.data.new_Appointment_data.id && $scope.events[i].type=="new_appointment"){
                            $scope.events.splice(i,1)
                        }
                    }
                    angular.forEach($scope.existing_events, function(obj, key) {
                        if(obj.id==success.data.new_Appointment_data.id){
                            $scope.existing_events.splice(key, 1);
                        }
                    });
                    angular.forEach($scope.practitioner, function(obj, key) {
                        if(obj.id==success.data.new_Appointment_data.business_practitioner){
                            $scope.practitioner_new_appointments = obj.practitioner_new_appointments;
                            angular.forEach(obj.practitioner_new_appointments, function(value, key) {
                                if(value.id==$scope.appointment_details.id){
                                    obj.practitioner_new_appointments.splice(key, 1);
                                }
                            });
                        }
                    });
                    if (repeat_true && (success.data.new_Appointment_data.repeat_type == 'Monthly' || success.data.new_Appointment_data.repeat_type == 'Yearly')) {
                        monthly_start_date = new Date(success.data.new_Appointment_data.blocked_date)
                        monthly_end_date = new Date(repeat_end_date)
                        do {
                            $scope.events.push({
                                title:success.data.new_Appointment_data.customer_name,
                                customer_name : success.data.new_Appointment_data.service_name,
                                practitioner_name: $scope.event.prac_name,
                                start: new Date(monthly_start_date.getFullYear(), monthly_start_date.getMonth(), monthly_start_date.getDate(), start_hours, start_min),
                                end: new Date(monthly_start_date.getFullYear(), monthly_start_date.getMonth(), monthly_start_date.getDate(), end_hours, end_min),
                                color: '#00bd71',
                                customer_icon : "user",
                                practitioner_icon: "heartbeat",
                                type: "new_appointment",
                                prac_ID : success.data.new_Appointment_data.business_practitioner,
                                id: success.data.new_Appointment_data.id
                            })
                            if (success.data.new_Appointment_data.repeat_type == 'Yearly') {
                                monthly_start_date.setYear(monthly_start_date.getFullYear() + 1)
                            } else {
                                if(success.data.new_Appointment_data.monthly_type=='Day of the month'){
                                    monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                }
                                else if(success.data.new_Appointment_data.monthly_type=='Day of the week'){
                                    monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                    monthly_start_date=getspecificDay(monthly_start_date,success.data.new_Appointment_data.monthly_day,success.data.new_Appointment_data.monthly_week)
                                }
                            }
                        }
                        while (new Date(monthly_start_date) <= new Date(monthly_end_date));
                    } else if(repeat_true && !(success.data.new_Appointment_data.repeat_type == 'Monthly' || success.data.new_Appointment_data.repeat_type == 'Yearly')){
                            $scope.events.push({
                                title:success.data.new_Appointment_data.customer_name,
                                customer_name : success.data.new_Appointment_data.service_name,
                                practitioner_name: $scope.event.prac_name,
                                start : start_hours + ":" + start_min,
                                end : end_hours + ":" + end_min,
                                dow : dow,
                                ranges : repeat_true ? [{
                                    start: date,
                                    end: repeat_end_date,
                                }] : null,
                                color: '#00bd71',
                                customer_icon : "user",
                                practitioner_icon: "heartbeat",
                                type: "new_appointment",
                                prac_ID : success.data.new_Appointment_data.business_practitioner,
                                id: success.data.new_Appointment_data.id
                            })
                    }else if(!repeat_true){
                        $scope.events.push({
                            title:success.data.new_Appointment_data.customer_name,
                            customer_name : success.data.new_Appointment_data.service_name,
                            practitioner_name: $scope.event.prac_name,
                            start : new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                            end : new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                            color: '#00bd71',
                            customer_icon : "user",
                            practitioner_icon: "heartbeat",
                            type: "new_appointment",
                            prac_ID : success.data.new_Appointment_data.business_practitioner,
                            id: success.data.new_Appointment_data.id
                        })
                    }
                    $('#' + $scope.calendar).fullCalendar('addEventSource', $scope.events);
                    $('#' + $scope.calendar).fullCalendar('refetchEvents');
                    $('#calendar_'+localStorage.business_id).fullCalendar('addEventSource', $scope.events);
                    $('#calendar_'+localStorage.business_id).fullCalendar('refetchEvents');
                    $scope.events =$scope.events
                    $scope.existing_events.push(success.data.new_Appointment_data)
                    $scope.practitioner_new_appointments.push(success.data.new_Appointment_data)
                    spinnerService.hide("html5spinner");
                }else {
                    $scope.ApiErr = status.data.Error
                }
            }, function(error) {
                console.log('Error:' + JSON.stringify(error));
            });
        }
    }
    // Time md-autocomplete method
    $scope.TimeMethod = function(txt) {
        var resArr = $scope.updateAppointment.timeArray;
        var searchArr = [];
        if (txt) {
            for (i = 0; i < resArr.length; i++) {
                if (resArr[i].indexOf((txt).toLowerCase()) > -1) {
                    searchArr.push(resArr[i]);
                }
            }
            return searchArr;
        } else {
            return resArr;
        }
    }
// When times start and end time changes
$scope.ChangeTime = function(time, txt) {
        if (txt) {
            startTimeValue = $('#start_time_bar input[type="search"]:eq(0)').val()
            endTimeValue = $('#end_time_bar input[type="search"]:eq(0)').val()
            if (startTimeValue) {
                startIndex = $scope.updateAppointment.timeArray.indexOf(startTimeValue)
                service_time = $('#service_name_bar input[type="search"]:eq(0)').val()
                if (service_time) {
                    endtimeSetter(service_time, startIndex);
                }
            }
            if (endTimeValue && startTimeValue) {
                startIndex = $scope.updateAppointment.timeArray.indexOf(startTimeValue)
                endIndex = $scope.updateAppointment.timeArray.indexOf(endTimeValue)
                if (endIndex < startIndex) {
                    $scope.appointmentEndTimeErr = "Please enter a valid End Time"
                } else {
                    $scope.appointmentEndTimeErr = null
                }
            }
        }
    }
// function to set the end time according to start time and Service Changes
    var endtimeSetter = function(service_time, startIndex) {
        var ArrayofTime = $scope.updateAppointment.timeArray
        console.log($scope.updateAppointment.timeArray.length)
        min = service_time.split(/\(([^)]+)\)/)
        add_min = min[1].split(' ')
        service_duration = add_min[0]
        quotient = Math.floor(service_duration / 15)
        remainder = (service_duration / 15) - quotient
        if (remainder) {
            inserted_index = ArrayofTime.indexOf(ArrayofTime[startIndex + quotient])
            item = ArrayofTime[inserted_index]
            item_Array = item.split(/[\s:]+/)
            if (ArrayofTime[inserted_index].includes('30')) {
                create_item = item_Array[0] + ":45 " + item_Array[2]
            } else {
                create_item = item_Array[0] + ":15 " + item_Array[2]
            }
            ArrayofTime.splice(inserted_index + 1, 0, create_item)
            $scope.appointment.endTimeText = create_item
        } else {
            $scope.appointment.endTimeText = ArrayofTime[startIndex + quotient]
        }
    }


    var Event_dialog = function(edit_data){
        $mdDialog.show({
            multiple : true,
            scope: $scope,
            preserveScope: true,
            templateUrl: 'static/templates/repeatEvent.html',
            controller: 'repeatEventCtrl',
            locals: {
                eventdate : $scope.cal_date,
                edit_Data : $scope.repeatEventData
            },
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
        });
    }
    $scope.updateEvent = function(){
        Event_dialog($scope.repeatEventData);
    }
});
