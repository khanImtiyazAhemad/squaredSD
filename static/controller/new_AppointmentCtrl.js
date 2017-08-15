angular.module('avaanaController').controller('new_AppointmentCtrl', function(spinnerService, apiService, $scope, $mdDialog, $timeout, service, $filter, $mdpTimePicker, practitioner, prac_id, events, calendar,pre_populate_data, existing_events) {
    $scope.events = events
    $scope.prac_id = prac_id
    $scope.service = service
    $scope.calendar = calendar
    $scope.pre_populate_data = pre_populate_data
    $scope.existing_events = existing_events
    if($scope.pre_populate_data){
        $scope.cal_date = $scope.pre_populate_data;
        $scope.startTimeText=$filter('date')($scope.pre_populate_data.format(),'hh:mm a')
    }
    $scope.appointment = {}
    $scope.practitioner = practitioner

    $scope.serviceArray = $scope.service
    if ($scope.prac_id) {
        for (i = 0; i < $scope.practitioner.length; i++) {
            if ($scope.practitioner[i].id == $scope.prac_id) {
                $scope.practitioner = [$scope.practitioner[i]]
                $scope.practitioner_new_appointments = $scope.practitioner.practitioner_new_appointments

            }
        }
    }
    var numRegex = /^\d+$/;
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $scope.appointment.timeArray = apiService.timeArray
    $scope.cancel = function() {
        $mdDialog.hide()
    }
        // Validation Section
    $scope.ServiceNameValidation = function() {
        var service_name_value = $('#service_name_bar input[type="search"]:eq(0)').val()
        serviceNameValue = service_name_value.split(/\(([^)]+)\)/)
        if (serviceNameValue == null || serviceNameValue == undefined || serviceNameValue == '') {
            $scope.ServiceNameErr = 'Please select a service for this new appointment.'
        } else {
            $scope.ServiceNameErr = null
        }
    }
    $scope.PractitionerNameValidation = function() {
        PractitionerNameValue = $('#practitioner_name_bar input[type="search"]:eq(0)').val()
        if (PractitionerNameValue == null || PractitionerNameValue == undefined || PractitionerNameValue == '') {
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

    $scope.submit = function() {
        $scope.ServiceNameValidation()
        $scope.appointmentDateValidation()
        $scope.appointmentstartTimeValidation()
        $scope.appointmentendTimeValidation()
        $scope.customerNameValidation()
        $scope.PractitionerNameValidation()
        if ($scope.ServiceNameErrErr == null && $scope.appointmentDateErr == null && $scope.appointmentStartTimeErr == null && $scope.appointmentEndTimeErr == null && $scope.customerNameErr == null &&  $scope.PractitionerNameErr == null) {
            spinnerService.show("html5spinner");
            data = {
                customer_name: $scope.customerName,
                customer_email: $scope.customerEmail,
                customer_phone: $scope.customerNumber,

                // repeat_data : $scope.eventType=='Repeat'?$scope.repeatEventData.data:null,
                // For repeat Functionality
                repeat_mode: $scope.eventType,
                repeat_type: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.repeats : null,
                weekly_days: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.repeats == 'Weekly' ? $scope.repeatEventObj.selected_index : null : null,
                monthly_type: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.repeats == 'Monthly' ? $scope.repeatEventObj.ends_monthly : null : null,
                monthly_date: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.repeats == 'Monthly' ? $scope.repeatEventObj.start_date : null : null,
                monthly_week: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.repeats == 'Monthly' ? $scope.repeatEventObj.ends_monthly == 'Day of the week' ? $scope.repeatEventObj.monthly_week : null : null : null,
                monthly_day: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.repeats == 'Monthly' ? $scope.repeatEventObj.ends_monthly == 'Day of the week' ? $scope.repeatEventObj.monthly_day : null : null : null,
                start_date: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.start_date : null,
                yearly_date: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.repeats == 'Yearly' ? $scope.repeatEventObj.start_date : null : null,
                end_type: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.ends_on : null,
                repeat_occurance: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.ends_on == 'After Occurence' ? $scope.repeatEventObj.repeats_occurance : null : null,
                end_on: $scope.eventType == 'Repeat' ? $scope.repeatEventObj.ends_on == 'End On' ? $scope.repeatEventObj.end_date : null : null,
                // Ends Here
                service_name: serviceNameValue[0],
                service_id: $scope.service_id,
                business: $scope.business_id,
                business_practitioner: $scope.practitioner_id,
                appointment_start_time: start_time_value,
                appointment_end_time: end_time_value,
                appointment_price: $scope.price,
                appointment_date: $scope.cal_date,
                comment: $scope.comment,
            }
            apiService.getDataWithToken('a_new_appointment/', data, 'post').then(function(success) {
                if (success.data.status == 200) {
                    $mdDialog.hide()
                    $('#' + $scope.calendar).fullCalendar('removeEvents')
                    $('#' + $scope.calendar).fullCalendar('refetchEvents');
                    var date = new Date(data.appointment_date);
                    start_hours = apiService.convertHours_Minutes(data.appointment_start_time, "start_hours")
                    start_min = apiService.convertHours_Minutes(data.appointment_start_time, "start_min")
                    end_hours = apiService.convertHours_Minutes(data.appointment_end_time, "end_hours")
                    end_min = apiService.convertHours_Minutes(data.appointment_end_time, "end_min")
                    var repeat_true = success.data.new_Appointment_data.repeat_mode == 'Repeat';
                    dow = apiService.repeat_type_method(repeat_true, success.data.new_Appointment_data)
                    repeat_end_date = apiService.repeat_end_type_method(repeat_true, success.data.new_Appointment_data)

                    if (repeat_true && (success.data.new_Appointment_data.repeat_type == 'Monthly' || success.data.new_Appointment_data.repeat_type == 'Yearly')) {
                        monthly_start_date = new Date(success.data.new_Appointment_data.appointment_date)
                        monthly_end_date = new Date(repeat_end_date)
                        do {
                            $scope.events.push({
                                title: success.data.new_Appointment_data.customer_name,
                                customer_name: success.data.new_Appointment_data.service_name,
                                practitioner_name: $scope.practitioner_name,
                                start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                                end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                                color: '#00bd71',
                                customer_icon: "user",
                                practitioner_icon: "heartbeat",
                                type: 'new_appointment',
                                prac_ID : success.data.new_Appointment_data.business_practitioner,
                                id: success.data.new_Appointment_data.id
                            })
                            if (success.data.new_Appointment_data.repeat_type == 'Yearly') {
                                monthly_start_date.setYear(monthly_start_date.getFullYear() + 1)
                            } else {
                                monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                if (success.data.new_Appointment_data.monthly_type == 'Day of the month') {
                                    monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                } else if (success.data.new_Appointment_data.monthly_type == 'Day of the week') {
                                    monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                    monthly_start_date = apiService.getspecificDay(monthly_start_date, success.data.new_Appointment_data.monthly_day, success.data.new_Appointment_data.monthly_week)
                                }
                            }
                        }
                        while (new Date(monthly_start_date) <= new Date(monthly_end_date));
                    } else if (repeat_true && !(success.data.new_Appointment_data.repeat_type == 'Monthly' || success.data.new_Appointment_data.repeat_type == 'Yearly')) {
                        $scope.events.push({
                            title: success.data.new_Appointment_data.customer_name,
                            practitioner_name: success.data.new_Appointment_data.service_name,
                            customer_name: success.data.new_Appointment_data.customer_name,
                            start: repeat_true ? start_hours + ":" + start_min : new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                            end: repeat_true ? end_hours + ":" + end_min : new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                            dow: dow,
                            ranges: repeat_true ? [{
                                start: date,
                                end: repeat_end_date,
                            }] : null,
                            color: '#00bd71',
                            customer_icon: "user",
                            practitioner_icon: "heartbeat",
                            type: 'new_appointment',
                            prac_ID : success.data.new_Appointment_data.business_practitioner,
                            id: success.data.new_Appointment_data.id
                        })
                    } else if (!repeat_true) {
                        $scope.events.push({
                            title: " " + success.data.new_Appointment_data.customer_name,
                            customer_name: success.data.new_Appointment_data.service_name,
                            start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                            end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                            color: '#00bd71',
                            comment_icon: "comment-o",
                            practitioner_icon: "heartbeat",
                            type: "new_appointment",
                            prac_ID : success.data.new_Appointment_data.business_practitioner,
                            id: success.data.new_Appointment_data.id
                        })

                    }
                    $('#' + $scope.calendar).fullCalendar('addEventSource', $scope.events);
                    $('#' + $scope.calendar).fullCalendar('refetchEvents');
                    $scope.events = $scope.events;
                    $scope.existing_events.push(success.data.new_Appointment_data)
                    $scope.practitioner_new_appointments.push(success.data.new_Appointment_data)
                } else {
                    $scope.ApiErr = status.data.Error
                }
                spinnerService.hide("html5spinner");
            }, function(error) {
                console.log('Error:' + JSON.stringify(error));
            });
        }
    }
    // Service md-autocomplete Method
    $scope.ServiceSearchMethod = function(txt) {
            var resArr = $scope.serviceArray;
            var searchArr = [];
            if (txt) {
                for (i = 0; i < resArr.length; i++) {
                    if (resArr[i]['service_name'].toLowerCase().indexOf((txt).toLowerCase()) > -1) {
                        searchArr.push(resArr[i]);
                    }
                }
                return searchArr;
            } else {
                return resArr;
            }
        }
    $scope.serviceWithtime = function(service) {
        $scope.price = service.discount ? service.discount : service.price
        $scope.service_id = service.id
        $scope.business_id = service.business
        return service.service_name + " (" + $filter('timeformat')(service.length_of_service) + " min)"
    }

    new_practitioner = []
    $scope.ChangeService = function(txt) {
            var resArr = $scope.serviceArray;
            if (txt) {
                service_name_string = txt.substr(0,txt.indexOf('(')-1)
                new_practitioner = []
                service_time = $('#service_name_bar input[type="search"]:eq(0)').val()
                startTimeValue = $('#start_time_bar input[type="search"]:eq(0)').val()
                if (startTimeValue) {
                    startIndex = $scope.appointment.timeArray.indexOf(startTimeValue);
                    endtimeSetter(service_time, startIndex);
                }
                 for (i = 0; i < $scope.practitioner.length; i++) {
                    console.log($scope.practitioner[i].practitioner_service.includes(service_name_string))
                    if ($scope.practitioner[i].practitioner_service.includes(service_name_string)) {
                        new_practitioner.push($scope.practitioner[i])
                    }
                }
            }else{
                return resArr;
            }
        }
    // Practitioner Md-autocomplete method
    $scope.PractitionerSearchMethod = function(txt) {
            var resArr = new_practitioner.length?new_practitioner:$scope.practitioner;
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
    // When Practitioner then Service will reflect according to the practitioner Change
    $scope.ChangePractitioner = function(practitionerdata, txt) {
            if (txt) {
                $scope.practitioner_id = practitionerdata.id
                $scope.practitioner_name = practitionerdata.name
                $scope.practitioner_new_appointments = practitionerdata.practitioner_new_appointments
            }
        }
        // Time md-autocomplete method
    $scope.TimeMethod = function(txt) {
            var resArr = $scope.appointment.timeArray;
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
                    startIndex = $scope.appointment.timeArray.indexOf(startTimeValue)
                    service_time = $('#service_name_bar input[type="search"]:eq(0)').val()
                    if (service_time) {
                        endtimeSetter(service_time, startIndex);
                    }
                }
                if (endTimeValue && startTimeValue) {
                    startIndex = $scope.appointment.timeArray.indexOf(startTimeValue)
                    endIndex = $scope.appointment.timeArray.indexOf(endTimeValue)
                    if (endIndex < startIndex) {
                        $scope.appointmentEndTimeErr = "End time cannot be before start time."
                    } else {
                        $scope.appointmentEndTimeErr = null
                    }
                }
            }
        }
        // function to set the end time according to start time and Service Changes
    var endtimeSetter = function(service_time, startIndex) {
        var ArrayofTime = $scope.appointment.timeArray
        console.log($scope.appointment.timeArray.length)
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
                from:"new"
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
