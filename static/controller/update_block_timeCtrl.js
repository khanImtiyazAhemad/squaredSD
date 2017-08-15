angular.module('avaanaController').controller('update_block_timeCtrl', function(spinnerService, apiService, $scope, $rootScope, $mdDialog, $mdpTimePicker, $filter, event, events, calendar, existing_events, practitioner) {
    $scope.event = event
    $scope.events = events
    $scope.calendar = calendar
    $scope.existing_events = existing_events
    $scope.practitioner = practitioner
    data = {
        id: $scope.event.id,
        type: $scope.event.type
    }
    $scope.updateBlockTime = {}
    $scope.repeatEventData = {}
    days_json = apiService.days_json

    function eveSummary(detail_obj) {
        $scope.repeatEventData.selected = []
        if (detail_obj.weekly_days) {
            $scope.repeatEventData.selected_index = detail_obj.weekly_days;
            for (i = 0; i < detail_obj.weekly_days.length; i++) {
                $scope.repeatEventData.selected.push(days_json[detail_obj.weekly_days[i]])
            }
        } else {
            $scope.repeatEventData.selected_index = [0];
            $scope.repeatEventData.selected = ['Sun']
        }

        if (detail_obj.end_type == 'Never') {
            end_check = ''
        } else if (detail_obj.end_type == 'After Occurence') {
            end_check = ", " + detail_obj.repeat_occurance + " times"
        } else {
            end_check = ", until " + $filter('date')(detail_obj.end_on, 'MMMM dd, yyyy')
        }
        if (detail_obj.repeat_type == 'Daily' || detail_obj.repeat_type == 'Every Weekday') {
            $scope.repeatEventData.event_summary = detail_obj.repeat_type + end_check
        } else if (detail_obj.repeat_type == 'Weekly') {
            $scope.repeatEventData.event_summary = detail_obj.repeat_type + " on " + $scope.repeatEventData.selected + end_check
        } else if (detail_obj.repeat_type == 'Monthly') {
            if (detail_obj.monthly_type == 'Day of the month') {
                $scope.repeatEventData.event_summary = detail_obj.repeat_type + " on day " + $filter('date')(detail_obj.blocked_date, 'dd') + end_check;
            } else {
                var month_week_day = new Date(detail_obj.blocked_date);
                var week_number = Math.ceil((month_week_day.getDate() - 1 - month_week_day.getDay()) / 7)
                var firstDateOfMonth = new Date(month_week_day.getFullYear(), month_week_day.getMonth() - 1, 1);
                var lastDateOfMonth = new Date(month_week_day.getFullYear(), month_week_day.getMonth(), 0);
                var current_lastDateOfMonth = new Date(month_week_day.getFullYear(), month_week_day.getMonth() + 1, 0);
                var number_of_weeks = Math.ceil((firstDateOfMonth.getDay() + lastDateOfMonth.getDate()) / 7);
                week_count = {
                    '0': "First ",
                    '1': month_week_day.getDay() < firstDateOfMonth.getDay() ? "First " : "Second ",
                    '2': month_week_day.getDay() < firstDateOfMonth.getDay() ? "Second " : "Third ",
                    '3': month_week_day.getDay() > current_lastDateOfMonth.getDay() && week_number <= number_of_weeks ? "Last " : "Third ",
                    '4': month_week_day.getDay() <= current_lastDateOfMonth.getDay() && week_number <= number_of_weeks ? "Last " : "Fourth ",
                    '5': month_week_day.getDay() <= current_lastDateOfMonth.getDay() && week_number <= number_of_weeks ? "Last " : "Fifth ",
                }
                $scope.repeatEventData.event_summary = detail_obj.repeat_type + " on the " + week_count[week_number] + $filter('date')(detail_obj.blocked_date, 'EEEE') + end_check;
                $scope.repeatEventData.monthly_week = week_count[week_number]
                $scope.repeatEventData.monthly_day = parseInt(days_json[$filter('date')(detail_obj.blocked_date, 'EEE')])
            }
        } else if (detail_obj.repeat_type == 'Yearly') {
            $scope.repeatEventData.event_summary = detail_obj.repeat_type + " on " + $filter('date')(detail_obj.blocked_date, 'MMMM dd') + end_check;
        }
        $scope.repeatEventData.repeats = detail_obj.repeat_type;
        $scope.repeatEventData.ends_on = detail_obj.end_type;
        $scope.repeatEventData.ends_monthly = detail_obj.monthly_type;
        $scope.repeatEventData.repeats_occurance = detail_obj.repeat_occurance


    }
    $scope.updateBlockTime.timeArray = apiService.timeArray
    apiService.getDataWithToken('a_calendar_appointment_detail/', data, 'post').then(function(success) {
        // console.log("Success..." + JSON.stringify(success.data.appointment_details))
        if (success.data.status == 200) {
            // console.log(JSON.stringify(success.data.appointment_details))
            $scope.appointment_details = success.data.appointment_details
            $scope.cal_date = new Date(success.data.appointment_details.blocked_date);
            $scope.comment = success.data.appointment_details.comment;
            $scope.prac_name = success.data.appointment_details.practitioner_name;
            $scope.updateBlockTime.startTimeText = success.data.appointment_details.blocked_start_time;
            $scope.updateBlockTime.endTimeText = success.data.appointment_details.blocked_end_time;
            $scope.UpdateEventType = success.data.appointment_details.repeat_mode;
            $scope.blocked_practitioner = success.data.appointment_details.blocked_practitioner;
            repeatObj = success.data.appointment_details;
            eveSummary(success.data.appointment_details);

        } else {
            $scope.ApiErr = status.data.Error
        }
    }, function(error) {
        console.log('Error:' + JSON.stringify(error));
    });
    $scope.close = function() {
        $mdDialog.hide()
    }
    $scope.remove = function() {
        apiService.getDataWithToken('a_delete_appointment_detail/', data, 'post').then(function(success) {
            if (success.data.status == 200) {
                $mdDialog.hide()
                $('#' + $scope.calendar).fullCalendar('removeEvents', data.id);
                $('#calendar_'+localStorage.business_id).fullCalendar('removeEvents', data.id);
                angular.forEach($scope.existing_events, function(obj, key) {
                    if(obj.id==data.id){
                        $scope.existing_events.splice(key, 1);
                    }
                });
                angular.forEach($scope.practitioner, function(obj, key) {
                    if(obj.id==$scope.blocked_practitioner){
                        console.log(JSON.stringify(obj))
                        angular.forEach(obj.practitioner_block_times, function(value, key) {
                            if(value.id==data.id){
                                obj.practitioner_block_times.splice(key, 1);
                            }
                        });
                    }
                });
            } else {
                $scope.ApiErr = status.data.Error
            }
        }, function(error) {});
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

    $scope.update = function() {
        console.log("runnnnnnn")
        console.log($scope.UpdateEventType)
        $scope.appointmentDateValidation()
        $scope.appointmentstartTimeValidation()
        $scope.appointmentendTimeValidation()
        $scope.PractitionerNameValidation()
        if ($scope.appointmentDateErr == null && $scope.appointmentStartTimeErr == null && $scope.appointmentEndTimeErr == null && $scope.PractitionerNameErr == null) {
            spinnerService.show("html5spinner");
            data = {
                business: $scope.appointment_details.business,
                blocked_practitioner: $scope.appointment_details.blocked_practitioner,
                blocked_date: $scope.cal_date,
                repeat_mode: $scope.UpdateEventType,
                repeat_type: $scope.UpdateEventType == 'Repeat' ? $scope.repeatEventData.repeats : null,
                weekly_days: $scope.UpdateEventType == 'Repeat' ? $scope.repeatEventData.repeats == 'Weekly' ? $scope.repeatEventData.selected_index : null : null,
                monthly_type: $scope.UpdateEventType == 'Repeat' ? $scope.repeatEventData.repeats == 'Monthly' ? $scope.repeatEventData.ends_monthly : null : null,
                monthly_date: $scope.UpdateEventType == 'Repeat' ? $scope.repeatEventData.repeats == 'Monthly' ? $scope.repeatEventData.start_date : null : null,
                monthly_week: $scope.UpdateEventType == 'Repeat' ? $scope.repeatEventData.repeats == 'Monthly' ? $scope.repeatEventData.ends_monthly == 'Day of the week' ? $scope.repeatEventData.monthly_week : null : null : null,
                monthly_day: $scope.UpdateEventType == 'Repeat' ? $scope.repeatEventData.repeats == 'Monthly' ? $scope.repeatEventData.ends_monthly == 'Day of the week' ? $scope.repeatEventData.monthly_day : null : null : null,
                start_date: $scope.UpdateEventType == 'Repeat' ? $scope.repeatEventData.start_date : null,
                yearly_date: $scope.UpdateEventType == 'Repeat' ? $scope.repeatEventData.repeats == 'Yearly' ? $scope.repeatEventData.start_date : null : null,
                end_type: $scope.UpdateEventType == 'Repeat' ? $scope.repeatEventData.ends_on : null,
                repeat_occurance: $scope.UpdateEventType == 'Repeat' ? $scope.repeatEventData.ends_on == 'After Occurance' ? $scope.repeatEventData.repeats_occurance : null : null,
                end_on: $scope.UpdateEventType == 'Repeat' ? $scope.repeatEventData.ends_on == 'End On' ? $scope.repeatEventData.end_date : null : null,
                // Ends Here
                blocked_start_time: start_time_value,
                blocked_end_time: end_time_value,
                comment: $scope.comment,
                id: $scope.event.id,
                type: $scope.event.type
            }
            console.log("data.......", data)
            apiService.getDataWithToken('a_update_calendar_appointment/', data, 'post').then(function(success) {
                console.log("success.....", JSON.stringify(success.data))
                if (success.data.status == 200) {
                    $mdDialog.hide()
                    var date = new Date(success.data.block_appointment.blocked_date);
                    start_hours = apiService.convertHours_Minutes(success.data.block_appointment.blocked_start_time, "start_hours")
                    start_min = apiService.convertHours_Minutes(success.data.block_appointment.blocked_start_time, "start_min")
                    end_hours = apiService.convertHours_Minutes(success.data.block_appointment.blocked_end_time, "end_hours")
                    end_min = apiService.convertHours_Minutes(success.data.block_appointment.blocked_end_time, "end_min")
                    var repeat_true = success.data.block_appointment.repeat_mode == 'Repeat';
                    dow = apiService.repeat_type_method(repeat_true, success.data.block_appointment)
                    repeat_end_date = apiService.repeat_end_type_method(repeat_true, success.data.block_appointment)
                    $('#' + $scope.calendar).fullCalendar('removeEvents');
                    $('#calendar_'+localStorage.business_id).fullCalendar('removeEvents');
                    for (i = 0; i < $scope.events.length; i++) {
                        if ($scope.events[i].id == success.data.block_appointment.id && $scope.events[i].type == "block_time") {
                            $scope.events.splice(i, 1)
                        }
                    }

                    angular.forEach($scope.existing_events, function(obj, key) {
                        if(obj.id==success.data.block_appointment.id){
                            $scope.existing_events.splice(key, 1);
                        }
                    });
                    angular.forEach($scope.practitioner, function(obj, key) {
                        if(obj.id==success.data.block_appointment.blocked_practitioner){
                            $scope.practitioner_block_appointments = obj.practitioner_block_times;
                            angular.forEach(obj.practitioner_block_times, function(value, key) {
                                if(value.id==success.data.block_appointment.id){
                                    obj.practitioner_block_times.splice(key, 1);
                                }
                            });
                        }
                    });
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

                                if (success.data.block_appointment.monthly_type == 'Day of the month') {
                                    monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                } else if (success.data.block_appointment.monthly_type == 'Day of the week') {
                                    monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                    monthly_start_date = apiService.getspecificDay(monthly_start_date, success.data.block_appointment.monthly_day, success.data.block_appointment.monthly_week)
                                }
                            }
                        }
                        while (new Date(monthly_start_date) <= new Date(monthly_end_date));
                    } else if (repeat_true && !(success.data.block_appointment.repeat_type == 'Monthly' || success.data.block_appointment.repeat_type == 'Yearly')) {
                        $scope.events.push({
                            title: " " + success.data.block_appointment.comment,
                            practitioner_name: success.data.block_appointment.practitioner_name,
                            start: start_hours + ":" + start_min,
                            end: end_hours + ":" + end_min,
                            dow: dow,
                            ranges: repeat_true ? [{
                                start: date,
                                end: repeat_end_date,
                            }] : null,
                            color: '#e74c3c',
                            comment_icon: "comment-o",
                            practitioner_icon: "heartbeat",
                            type: 'block_time',
                            prac_ID : success.data.block_appointment.blocked_practitioner,
                            id: success.data.block_appointment.id,
                        })
                    } else if (!repeat_true) {
                        $scope.events.push({
                            title: " " + success.data.block_appointment.comment,
                            practitioner_name: success.data.block_appointment.practitioner_name,
                            start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                            end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                            color: '#e74c3c',
                            comment_icon: "comment-o",
                            practitioner_icon: "heartbeat",
                            type: 'block_time',
                            prac_ID : success.data.block_appointment.blocked_practitioner,
                            id: success.data.block_appointment.id
                        })
                    }
                    $('#' + $scope.calendar).fullCalendar('addEventSource', $scope.events);
                    $('#' + $scope.calendar).fullCalendar('refetchEvents');
                    $('#calendar_'+localStorage.business_id).fullCalendar('addEventSource', $scope.events);
                    $('#calendar_'+localStorage.business_id).fullCalendar('refetchEvents');
                    $scope.events = $scope.events
                    $scope.existing_events.push(success.data.block_appointment)
                    $scope.practitioner_block_appointments.push(success.data.block_appointment)
                    spinnerService.hide("html5spinner");
                } else {
                    $scope.ApiErr = status.data.Error
                }
            }, function(error) {});
        }
    }

    $scope.showTimePicker = function(ev, type) {
        $mdpTimePicker(new Date(2016, 10, 14, 00, 00), {
            targetEvent: ev
        }).then(function(selectedDate) {
            if (type == 'start') {
                $scope.startTime = $filter('date')(selectedDate, 'hh:mm a');
            } else {
                $scope.endTime = $filter('date')(selectedDate, 'hh:mm a');
            }

        })
    }

    // Time md-autocomplete method
    $scope.TimeMethod = function(txt) {
            var resArr = $scope.updateBlockTime.timeArray;
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
            if (endTimeValue && startTimeValue) {
                startIndex = $scope.updateBlockTime.timeArray.indexOf(startTimeValue)
                endIndex = $scope.updateBlockTime.timeArray.indexOf(endTimeValue)
                if (endIndex < startIndex) {
                    $scope.appointmentEndTimeErr = "Please enter a valid end time."
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
                edit_Data: $scope.repeatEventData
            },
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
        });
    }


    $scope.updateEvent = function() {
        Event_dialog($scope.repeatEventData);
    }
});
