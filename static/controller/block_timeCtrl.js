angular.module('avaanaController').controller('block_timeCtrl', function(spinnerService, apiService, $scope, $rootScope, $mdDialog, $mdpTimePicker, $filter, practitioner, prac_id, events, calendar, existing_events) {
    $scope.comment = 'Blocked Time'
    $scope.events = events
    $scope.prac_id = prac_id
    $scope.existing_events = existing_events
    $scope.practitioner = practitioner
    $scope.calendar = calendar
    $scope.repeatEventData = {}
    if ($scope.prac_id) {
        for (i = 0; i < $scope.practitioner.length; i++) {
            if ($scope.practitioner[i].id == $scope.prac_id) {
                $scope.practitioner = [$scope.practitioner[i]]
                $scope.practitioner_block_appointments = $scope.practitioner.practitioner_block_times
            }
        }
    }
    $scope.timeArray = apiService.timeArray
    $scope.cancel = function() {
        $mdDialog.hide()
    }
    $scope.PractitionerNameValidation = function() {
        PractitionerNameValue = $('#practitioner_name_bar input[type="search"]:eq(0)').val()
        if (PractitionerNameValue == null || PractitionerNameValue == undefined || PractitionerNameValue == '') {
            $scope.PractitionerNameErr = 'Please select a practitioner.'
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
            $scope.appointmentStartTimeErr = 'Please select a start time.'
        } else {
            $scope.appointmentStartTimeErr = null
        }
    }
    $scope.appointmentendTimeValidation = function() {
        end_time_value = $('#end_time_bar input[type="search"]:eq(0)').val()
        if (end_time_value == null || end_time_value == undefined || end_time_value == '') {
            $scope.appointmentEndTimeErr = 'Please select an end time.'
        } else {
            $scope.appointmentEndTimeErr = null
        }
    }

    $scope.submit = function() {
        $scope.appointmentDateValidation()
        $scope.appointmentstartTimeValidation()
        $scope.appointmentendTimeValidation()
        $scope.PractitionerNameValidation()
        if ($scope.appointmentDateErr == null && $scope.appointmentStartTimeErr == null && $scope.appointmentEndTimeErr == null && $scope.PractitionerNameErr == null) {
            spinnerService.show("html5spinner");
            data = {
                business: $scope.business_id,
                blocked_practitioner: $scope.practitioner_id,
                blocked_date: $scope.cal_date,
                repeat_mode: $scope.eventType,
                repeat_type: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.repeats : null,
                weekly_days: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.repeats == 'Weekly' ? $scope.repeatEventObj.selected_index : null : null,
                monthly_type: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.repeats == 'Monthly' ? $scope.repeatEventObj.ends_monthly : null : null,
                monthly_date: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.repeats == 'Monthly' ? $scope.repeatEventObj.start_date : null : null,
                monthly_week : $scope.eventType == 'Repeat' ? $scope.repeatEventObj.repeats == 'Monthly' ? $scope.repeatEventObj.ends_monthly=='Day of the week'?$scope.repeatEventObj.monthly_week: null : null : null,
                monthly_day : $scope.eventType == 'Repeat' ? $scope.repeatEventObj.repeats == 'Monthly' ? $scope.repeatEventObj.ends_monthly=='Day of the week'?$scope.repeatEventObj.monthly_day: null : null : null,
                start_date: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.start_date : null,
                yearly_date: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.repeats == 'Yearly' ? $scope.repeatEventObj.start_date : null : null,
                end_type: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.ends_on : null,
                repeat_occurance: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.ends_on == 'After Occurence' ? $scope.repeatEventObj.repeats_occurance : null : null,
                end_on: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.ends_on == 'End On' ? $scope.repeatEventObj.end_date : null : null,

                blocked_start_time: start_time_value,
                blocked_end_time: end_time_value,
                comment: $scope.comment,
            }
            apiService.getDataWithToken('a_block_time/', data, 'post').then(function(success) {
                if (success.data.status == 200) {
                    $mdDialog.hide()
                    $('#' + $scope.calendar).fullCalendar('removeEvents')
                    $('#' + $scope.calendar).fullCalendar('refetchEvents');
                    var date = new Date(success.data.block_appointment.blocked_date);
                    start_hours = apiService.convertHours_Minutes(success.data.block_appointment.blocked_start_time, "start_hours")
                    start_min = apiService.convertHours_Minutes(success.data.block_appointment.blocked_start_time, "start_min")
                    end_hours = apiService.convertHours_Minutes(success.data.block_appointment.blocked_end_time, "end_hours")
                    end_min = apiService.convertHours_Minutes(success.data.block_appointment.blocked_end_time, "end_min")
                    var repeat_true = success.data.block_appointment.repeat_mode == 'Repeat';
                    dow = apiService.repeat_type_method(repeat_true, success.data.block_appointment)
                    repeat_end_date = apiService.repeat_end_type_method(repeat_true, success.data.block_appointment)
                    if (repeat_true && (success.data.block_appointment.repeat_type == 'Monthly' || success.data.block_appointment.repeat_type == 'Yearly')) {
                        monthly_start_date = new Date(success.data.block_appointment.blocked_date)
                        monthly_end_date = new Date(repeat_end_date)
                        do {
                            $scope.events.push({
                                title: " " + success.data.block_appointment.comment,
                                practitioner_name: success.data.block_appointment.practitioner_name,
                                start: new Date(monthly_start_date.getFullYear(), monthly_start_date.getMonth(), monthly_start_date.getDate(), start_hours, start_min),
                                end: new Date(monthly_start_date.getFullYear(), monthly_start_date.getMonth(), monthly_start_date.getDate(), end_hours, end_min),
                                color: '#E74C3C',
                                comment_icon: "comment-o",
                                practitioner_icon: "heartbeat",
                                type: "block_time",
                                prac_ID : success.data.block_appointment.blocked_practitioner,
                                id: success.data.block_appointment.id
                            })
                            if (success.data.block_appointment.repeat_type == 'Yearly') {
                                monthly_start_date.setYear(monthly_start_date.getFullYear() + 1)
                            } else {
                                if(success.data.block_appointment.monthly_type=='Day of the month'){
                                    monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                }
                                else if(success.data.block_appointment.monthly_type=='Day of the week'){
                                    monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                    monthly_start_date=apiService.getspecificDay(monthly_start_date,success.data.block_appointment.monthly_day,success.data.block_appointment.monthly_week)
                                }
                            }
                        }
                        while (new Date(monthly_start_date) <= new Date(monthly_end_date));
                    } else if(repeat_true && !(success.data.block_appointment.repeat_type == 'Monthly' || success.data.block_appointment.repeat_type == 'Yearly')){
                        $scope.events.push({
                            title: " " + success.data.block_appointment.comment,
                            practitioner_name: success.data.block_appointment.practitioner_name,
                            start: repeat_true ? start_hours + ":" + start_min : new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                            end: repeat_true ? end_hours + ":" + end_min : new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                            dow: dow,
                            ranges: repeat_true ? [{
                                start: date,
                                end: repeat_end_date,
                            }] : null,
                            color: '#E74C3C',
                            comment_icon: "comment-o",
                            practitioner_icon: "heartbeat",
                            type: "block_time",
                            prac_ID : success.data.block_appointment.blocked_practitioner,
                            id: success.data.block_appointment.id
                        })
                    }else if(!repeat_true){
                        $scope.events.push({
                            title: " " + success.data.block_appointment.comment,
                            practitioner_name: success.data.block_appointment.practitioner_name,
                            start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                            end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                            color: '#E74C3C',
                            comment_icon: "comment-o",
                            practitioner_icon: "heartbeat",
                            type: "block_time",
                            prac_ID : success.data.block_appointment.blocked_practitioner,
                            id: success.data.block_appointment.id
                        })

                    }
                    $('#' + $scope.calendar).fullCalendar('addEventSource', $scope.events);
                    $('#' + $scope.calendar).fullCalendar('refetchEvents');
                    $scope.events = $scope.events;
                    $scope.existing_events.push(success.data.block_appointment)
                    $scope.practitioner_block_appointments.push(success.data.block_appointment)
                } else {
                    $scope.ApiErr = status.data.Error
                }
                spinnerService.hide("html5spinner");
            }, function(error) {
                spinnerService.hide("html5spinner");
            });
        }
    }
    $scope.PractitionerSearchMethod = function(txt) {
        var resArr = $scope.practitioner;
        var searchArr = [];
        if (txt) {
            for (i = 0; i < resArr.length; i++) {
                if (resArr[i]['name'].toLowerCase().indexOf((txt).toLowerCase()) > -1) {
                    searchArr.push(resArr[i]);
                }
            }
            return searchArr;
        } else {
            return resArr;
        }
    }
    $scope.ChangePractitioner = function(practitionerdata, txt) {
            if (txt) {
                console.log(practitionerdata)
                $scope.practitioner_id = practitionerdata.id
                $scope.practitioner_name = practitionerdata.name
                $scope.business_id = practitionerdata.business
                $scope.practitioner_block_appointments = practitionerdata.practitioner_block_times
            }
        }

    $scope.TimeMethod = function(txt) {
        var resArr = $scope.timeArray;
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

    $scope.ChangeTime = function(time, txt) {
        if (txt) {
            startTimeValue = $('#start_time_bar input[type="search"]:eq(0)').val()
            endTimeValue = $('#end_time_bar input[type="search"]:eq(0)').val()
            if (endTimeValue && startTimeValue) {
                startIndex = $scope.timeArray.indexOf(startTimeValue)
                endIndex = $scope.timeArray.indexOf(endTimeValue)
                if (endIndex < startIndex) {
                    $scope.appointmentEndTimeErr = "Please ensure the end time is after the start time."
                } else {
                    $scope.appointmentEndTimeErr = null
                }
            }
        }
    }

    var Event_dialog = function(edit_data) {
        $mdDialog.show({
            multiple: true,
            scope: $scope,
            preserveScope: true,
            templateUrl: 'static/templates/repeatEvent.html',
            controller: 'repeatEventCtrl',
            locals: {
                eventdate: $scope.cal_date,
                edit_Data: edit_data,
                from:"block"
            },
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
        });
    }

    $scope.eventChange = function() {
        if ($scope.eventType == 'Repeat') {
            Event_dialog('')
        }
    }

    $scope.editrepeatEvent = function() {
        Event_dialog($scope.repeatEventData);
    }
});
