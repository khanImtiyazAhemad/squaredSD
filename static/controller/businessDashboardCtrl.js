angular.module("avaanaController").directive("highChart", function($parse) {

        var link = function(scope, ele, attr) {
            scope.$watch('chartConfig', function(newVal) {
                if (newVal) {
                    var props = $parse(attr.highChart)(scope);
                    props.chart.renderTo = ele[0];
                    new Highcharts.Chart(props);
                }
            });
        }
        return {
            restrict: "A",
            link: link,
        }
    })
    .controller("businessDashboardCtrl", function(spinnerService, apiService, $anchorScroll, $location, $state, $scope, $window, $uibModal, $timeout, $filter, $mdpTimePicker, uiCalendarConfig, $mdDialog) {
        // (http[s]?:\\/\\/  <span class="plus">+</span>
        spinnerService.show("html5spinner");
        $scope.dashborad = {}
        $scope.pract_text = '+ Add Practitioner'
        $scope.service_text = '+ Add Service'
        $scope.dropDownSelect = false;
        $scope.calendarselectable = true
        $scope.dashborad.all_calendar = true
        var numRegex = /^\d+$/;
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var websiteRegex = new RegExp("^((www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?")
        $scope.convertImgToDataURLviaCanvas = function(url, callback, outputFormat) {
                var img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = function() {
                    var canvas = document.createElement('CANVAS');
                    var ctx = canvas.getContext('2d');
                    var dataURL;
                    canvas.height = this.height;
                    canvas.width = this.width;
                    ctx.drawImage(this, 0, 0);
                    dataURL = canvas.toDataURL(outputFormat);
                    callback(dataURL, outputFormat);
                    canvas = null;
                };
                img.src = url;
            }
            // Intiate Variable for Logo of Business and Practitioner Logo
        $scope.edit_content = true;
        $scope.tab_Content = false;
        $scope.appointments_content = false
        $scope.dashborad.logo_image = null
        $scope.dashborad.practitioner_logo_image = null
        $scope.length_of_the_service = apiService.lengthOfService
        $scope.dashborad.booking_type = apiService.type_booking
        $scope.startEndArr = ['06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'];
        $scope.startTimeClick = function(obj, type, index) {
            if (type == 'start') {
                $scope.startEndValidation(obj)
                obj.start_timing = $scope.startEndArr[index]
                $scope.startEndValidation(obj)

            } else if (type == 'end') {
                obj.end_timing = $scope.startEndArr[index]
                $scope.startEndValidation(obj)
            }
        }

        $scope.startEndValidation = function(obj) {
                start_index = $scope.startEndArr.indexOf(obj.start_timing)
                end_index = $scope.startEndArr.indexOf(obj.end_timing)
                if (end_index <= start_index) {
                    obj.error = "Please select Valid time"
                } else {
                    obj.error = null;
                }
            }
            // To open each step when user want to edit the Step 1,Step 2 and all

        $scope.Step1Edit = "Edit";
        $scope.Step2Edit = "Edit";
        $scope.Step3Edit = "Edit";
        $scope.Step4Edit = "Edit";

        var days_json = {
            'Sun': 0,
            'Mon': 1,
            'Tue': 2,
            'Wed': 3,
            'Thur': 4,
            'Fri': 5,
            'Sat': 6
        }

        $scope.OpenMethod = function(obj, id) {
                if (obj == 1) {
                    if ($scope.Step1Edit == "Edit") {
                        $scope.Step1Edit = 'Close'
                        autocompleteMethod(id)
                        return
                    }
                    $scope.Step1Edit = 'Edit'
                } else if (obj == 2) {
                    if ($scope.Step2Edit == "Edit") {
                        $scope.Step2Edit = 'Close'
                        return
                    }
                    $scope.Step2Edit = 'Edit'
                } else if (obj == 3) {
                    if ($scope.Step3Edit == "Edit") {
                        $scope.Step3Edit = 'Close'
                        return
                    }
                    $scope.Step3Edit = 'Edit'
                } else if (obj == 4) {
                    if ($scope.Step4Edit == "Edit") {
                        $scope.Step4Edit = 'Close'
                        return
                    }
                    $scope.Step4Edit = 'Edit'
                }
            }
            // To get the List of all the Business of Owner with JWT
        apiService.getDataWithToken('a_get_owner_all_business/', {}, 'get').then(function(res) {
            console.log(JSON.stringify(res.data.Business_data))
            $scope.businessResponse = {
                business_details: res.data.Business_data
            }
            for (i = 0; i < $scope.businessResponse.business_details.length; i++) {
                $scope.businessResponse.business_details[i].slickDisp = false;
                $scope.businessResponse.business_details[i].serviceSlickDisp = false
            }
            id = $scope.businessResponse.business_details[0]['id']
            $scope.clickedTab(id, 0)
        })
        $scope.selectChanged = function(data) {
            // console.log("select data------", $scope.dashType.id)
            $scope.business_name = $scope.dashType.name;
            $scope.business_id = $scope.dashType.id
        }

        $scope.editClick = function() {
            $scope.tab_Content = true;
            $scope.edit_content = false;
        };


        $scope.backClick = function() {
            $scope.edit_content = true;
            $scope.tab_Content = false;
            $scope.appointments_content = false
        };

        $scope.customer_booking = function() {
                $scope.edit_content = false;
                $scope.tab_Content = false;
                $scope.appointments_content = true
            }
            // To aet the Data on each tab and this function fire when a user click on another tab
        $scope.custom_dailog = function(message) {
            $mdDialog.show({
                controller: 'custom_dailogCtrl',
                templateUrl: 'static/templates/custom_dialog.html',
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {
                    "message": message,
                }
            });
            $timeout(function() {
                $mdDialog.hide()
            }, 3000)
        }
        $scope.clickedTab = function(id, type, practitioner, index) {
                if (type == 'dropDown') {
                    $scope.dropDownSelect = true
                } else {
                    $scope.dropDownSelect = false
                }
                $('#calendar_' + localStorage.business_id).fullCalendar('destroy')
                $('#calendar_' + localStorage.business_id).fullCalendar($scope.uiConfig.calendar);
                $('#calendar_' + localStorage.business_id + "_" + index).fullCalendar('destroy');
                $('#calendar_' + localStorage.business_id + "_" + index).fullCalendar($scope.uiConfig1.calendar);
                if (type == undefined && practitioner == undefined && index == undefined) {
                    return;
                }
                $scope.backClick()
                $scope.calendar_index = index;
                $scope.calendar_practitioner = practitioner;
                $scope.Step1Edit = "Edit";
                $scope.Step2Edit = "Edit";
                $scope.Step3Edit = "Edit";
                $scope.Step4Edit = "Edit";

                for (i = 0; i < $scope.businessResponse.business_details.length; i++) {
                    if ($scope.businessResponse.business_details[i].id == id) {
                        key = i;
                        // console.log(key)
                    }
                }
                $scope.dashborad.all_business_appointments = $scope.businessResponse.business_details[key].business_all_appointments;
                $scope.dashborad.non_avaana_user_appointments = $scope.businessResponse.business_details[key].business_non_avaana_user_appointments;
                $scope.dashborad.block_time = $scope.businessResponse.business_details[key].business_block_time;
                if (type == 'All') {
                    // $scope.calendarselectable = false
                    $('#calendar_' + localStorage.business_id).fullCalendar('removeEvents');
                    $('#calendar_' + localStorage.business_id).fullCalendar('refetchEvents');
                    $scope.events = []
                    for (i = 0; i < $scope.dashborad.all_business_appointments.length; i++) {
                        var date = new Date($scope.dashborad.all_business_appointments[i].appointment_date);
                        start_hours = apiService.convertHours_Minutes($scope.dashborad.all_business_appointments[i].appointment_start_time, "start_hours")
                        start_min = apiService.convertHours_Minutes($scope.dashborad.all_business_appointments[i].appointment_start_time, "start_min")
                        end_hours = apiService.convertHours_Minutes($scope.dashborad.all_business_appointments[i].appointment_end_time, "end_hours")
                        end_min = apiService.convertHours_Minutes($scope.dashborad.all_business_appointments[i].appointment_end_time, "end_min")
                        $scope.events.push({
                            title: " " + $scope.dashborad.all_business_appointments[i].customer_name,
                            customer_name: $scope.dashborad.all_business_appointments[i].service_name,
                            practitioner_name: $scope.dashborad.all_business_appointments[i].practiitoner_name,
                            start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                            end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                            color: '#00bd71',
                            customer_icon: "user",
                            practitioner_icon: "heartbeat",
                            type: "permanent_appointment",
                            prac_ID: $scope.dashborad.all_business_appointments[i].business_practitioner,
                            id: $scope.dashborad.all_business_appointments[i].id
                        })
                    }


                    //******************Appointment Time**************
                    for (i = 0; i < $scope.dashborad.non_avaana_user_appointments.length; i++) {
                        var date = new Date($scope.dashborad.non_avaana_user_appointments[i].appointment_date);
                        start_hours = apiService.convertHours_Minutes($scope.dashborad.non_avaana_user_appointments[i].appointment_start_time, "start_hours")
                        start_min = apiService.convertHours_Minutes($scope.dashborad.non_avaana_user_appointments[i].appointment_start_time, "start_min")
                        end_hours = apiService.convertHours_Minutes($scope.dashborad.non_avaana_user_appointments[i].appointment_end_time, "end_hours")
                        end_min = apiService.convertHours_Minutes($scope.dashborad.non_avaana_user_appointments[i].appointment_end_time, "end_min")
                        var repeat_true = $scope.dashborad.non_avaana_user_appointments[i].repeat_mode == 'Repeat';
                        dow = apiService.repeat_type_method(repeat_true, $scope.dashborad.non_avaana_user_appointments[i])
                        repeat_end_date = apiService.repeat_end_type_method(repeat_true, $scope.dashborad.non_avaana_user_appointments[i])
                        if (repeat_true && ($scope.dashborad.non_avaana_user_appointments[i].repeat_type == 'Monthly' || $scope.dashborad.non_avaana_user_appointments[i].repeat_type == 'Yearly')) {
                            monthly_start_date = new Date($scope.dashborad.non_avaana_user_appointments[i].appointment_date)
                            monthly_end_date = new Date(repeat_end_date)
                            do {
                                $scope.events.push({
                                    title: $scope.dashborad.non_avaana_user_appointments[i].customer_name,
                                    customer_name: $scope.dashborad.non_avaana_user_appointments[i].service_name,
                                    practitioner_name: $scope.dashborad.non_avaana_user_appointments[i].practitioner_name,
                                    start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                                    end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                                    color: '#00bd71',
                                    customer_icon: "user",
                                    practitioner_icon: "heartbeat",
                                    type: "new_appointment",
                                    prac_ID: $scope.dashborad.non_avaana_user_appointments[i].business_practitioner,
                                    id: $scope.dashborad.non_avaana_user_appointments[i].id
                                })

                                if ($scope.dashborad.non_avaana_user_appointments[i].repeat_type == 'Yearly') {
                                    monthly_start_date.setYear(monthly_start_date.getFullYear() + 1)
                                } else {
                                    if ($scope.dashborad.non_avaana_user_appointments[i].monthly_type == 'Day of the month') {
                                        monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                    } else if ($scope.dashborad.non_avaana_user_appointments[i].monthly_type == 'Day of the week') {
                                        monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                        monthly_start_date = getspecificDay(monthly_start_date, $scope.dashborad.non_avaana_user_appointments[i].monthly_day, $scope.dashborad.non_avaana_user_appointments[i].monthly_week)
                                    }
                                }
                            }
                            while (new Date(monthly_start_date) <= new Date(monthly_end_date));
                        } else if (repeat_true && !($scope.dashborad.non_avaana_user_appointments[i].repeat_type == 'Monthly' || $scope.dashborad.non_avaana_user_appointments[i].repeat_type == 'Yearly')) {
                            $scope.events.push({
                                title: $scope.dashborad.non_avaana_user_appointments[i].customer_name,
                                customer_name: $scope.dashborad.non_avaana_user_appointments[i].service_name,
                                practitioner_name: $scope.dashborad.non_avaana_user_appointments[i].practitioner_name,
                                start: start_hours + ":" + start_min,
                                end: end_hours + ":" + end_min,
                                dow: dow,
                                ranges: repeat_true ? [{
                                    start: date,
                                    end: repeat_end_date,
                                }] : null,
                                color: '#00bd71',
                                customer_icon: "user",
                                practitioner_icon: "heartbeat",
                                type: "new_appointment",
                                prac_ID: $scope.dashborad.non_avaana_user_appointments[i].business_practitioner,
                                id: $scope.dashborad.non_avaana_user_appointments[i].id
                            })
                        } else if (!repeat_true) {
                            $scope.events.push({
                                title: $scope.dashborad.non_avaana_user_appointments[i].customer_name,
                                customer_name: $scope.dashborad.non_avaana_user_appointments[i].service_name,
                                practitioner_name: $scope.dashborad.non_avaana_user_appointments[i].practitioner_name,
                                start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                                end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                                color: '#00bd71',
                                customer_icon: "user",
                                practitioner_icon: "heartbeat",
                                type: "new_appointment",
                                prac_ID: $scope.dashborad.non_avaana_user_appointments[i].business_practitioner,
                                id: $scope.dashborad.non_avaana_user_appointments[i].id,
                            })
                        }
                    } //for loop end

                    for (i = 0; i < $scope.dashborad.block_time.length; i++) {
                        var date = new Date($scope.dashborad.block_time[i].blocked_date);
                        start_hours = apiService.convertHours_Minutes($scope.dashborad.block_time[i].blocked_start_time, "start_hours")
                        start_min = apiService.convertHours_Minutes($scope.dashborad.block_time[i].blocked_start_time, "start_min")
                        end_hours = apiService.convertHours_Minutes($scope.dashborad.block_time[i].blocked_end_time, "end_hours")
                        end_min = apiService.convertHours_Minutes($scope.dashborad.block_time[i].blocked_end_time, "end_min")
                        var repeat_true = $scope.dashborad.block_time[i].repeat_mode == 'Repeat';
                        dow = apiService.repeat_type_method(repeat_true, $scope.dashborad.block_time[i])
                        repeat_end_date = apiService.repeat_end_type_method(repeat_true, $scope.dashborad.block_time[i])
                        if (repeat_true && ($scope.dashborad.block_time[i].repeat_type == 'Monthly' || $scope.dashborad.block_time[i].repeat_type == 'Yearly')) {
                            monthly_start_date = new Date($scope.dashborad.block_time[i].blocked_date)
                            monthly_end_date = new Date(repeat_end_date)
                            do {
                                $scope.events.push({
                                    title: " " + $scope.dashborad.block_time[i].comment,
                                    practitioner_name: $scope.dashborad.block_time[i].practitioner_name,
                                    start: new Date(monthly_start_date.getFullYear(), monthly_start_date.getMonth(), monthly_start_date.getDate(), start_hours, start_min),
                                    end: new Date(monthly_start_date.getFullYear(), monthly_start_date.getMonth(), monthly_start_date.getDate(), end_hours, end_min),
                                    color: '#e74c3c',
                                    comment_icon: "comment-o",
                                    practitioner_icon: "heartbeat",
                                    type: "block_time",
                                    prac_ID: $scope.dashborad.block_time[i].blocked_practitioner,
                                    id: $scope.dashborad.block_time[i].id
                                })
                                if ($scope.dashborad.block_time[i].repeat_type == 'Yearly') {
                                    monthly_start_date.setYear(monthly_start_date.getFullYear() + 1)
                                } else {
                                    if ($scope.dashborad.block_time[i].monthly_type == 'Day of the month') {
                                        monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                    } else if ($scope.dashborad.block_time[i].monthly_type == 'Day of the week') {
                                        monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                        monthly_start_date = apiService.getspecificDay(monthly_start_date, $scope.dashborad.block_time[i].monthly_day, $scope.dashborad.block_time[i].monthly_week)
                                    }
                                }
                            } while (new Date(monthly_start_date) <= new Date(monthly_end_date))
                        } else if (repeat_true && !($scope.dashborad.block_time[i].repeat_type == 'Monthly' || $scope.dashborad.block_time[i].repeat_type == 'Yearly')) {
                            $scope.events.push({
                                title: " " + $scope.dashborad.block_time[i].comment,
                                practitioner_name: $scope.dashborad.block_time[i].practitioner_name,
                                start: repeat_true ? start_hours + ":" + start_min : new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                                end: repeat_true ? end_hours + ":" + end_min : new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                                dow: dow,
                                ranges: repeat_true ? [{
                                    start: date,
                                    end: repeat_end_date,
                                }] : null,
                                color: '#e74c3c',
                                comment_icon: "comment-o",
                                practitioner_icon: "heartbeat",
                                type: "block_time",
                                prac_ID: $scope.dashborad.block_time[i].blocked_practitioner,
                                id: $scope.dashborad.block_time[i].id
                            })
                        } else if (!repeat_true) {
                            $scope.events.push({
                                title: " " + $scope.dashborad.block_time[i].comment,
                                practitioner_name: $scope.dashborad.block_time[i].practitioner_name,
                                start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                                end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                                color: '#E74C3C',
                                comment_icon: "comment-o",
                                practitioner_icon: "heartbeat",
                                type: "block_time",
                                prac_ID: $scope.dashborad.block_time[i].blocked_practitioner,
                                id: $scope.dashborad.block_time[i].id
                            })
                        }

                    }
                    if ($scope.businessResponse.business_details[key].business_detail.business_cliniko.appointments) {
                        cliniko_appointment = $scope.businessResponse.business_details[key].business_detail.business_cliniko.appointments
                        for (i = 0; i < cliniko_appointment.length; i++) {
                            $scope.events.push({
                                title: " Cliniko Appointments",
                                practitioner_name: cliniko_appointment[i].patient_name,
                                start: new Date(cliniko_appointment[i].appointment_start),
                                end: new Date(cliniko_appointment[i].appointment_end),
                                color: '#e74c3c',
                                comment_icon: "comment-o",
                                practitioner_icon: "heartbeat",
                                type: "Cliniko_Apponitments",
                                id: cliniko_appointment[i].id
                            })
                        }
                    }
                    $('#calendar_' + localStorage.business_id).fullCalendar('addEventSource', $scope.events);
                    $('#calendar_' + localStorage.business_id).fullCalendar('refetchEvents');
                    $scope.events = $scope.events;
                } else if (type == 'Practitioner') {
                    console.log("practitoner ID" + JSON.stringify(practitioner))
                    $scope.calendarselectable = true
                    $('#calendar_' + localStorage.business_id + "_" + index).fullCalendar('removeEvents')
                    $('#calendar_' + localStorage.business_id + "_" + index).fullCalendar('refetchEvents');
                    $scope.events = []
                    for (i = 0; i < practitioner.practiitioner_appointments.length; i++) {
                        var date = new Date(practitioner.practiitioner_appointments[i].appointment_date);
                        start_hours = apiService.convertHours_Minutes(practitioner.practiitioner_appointments[i].appointment_start_time, "start_hours")
                        start_min = apiService.convertHours_Minutes(practitioner.practiitioner_appointments[i].appointment_start_time, "start_min")
                        end_hours = apiService.convertHours_Minutes(practitioner.practiitioner_appointments[i].appointment_end_time, "end_hours")
                        end_min = apiService.convertHours_Minutes(practitioner.practiitioner_appointments[i].appointment_end_time, "end_min")
                        $scope.events.push({
                            title: practitioner.practiitioner_appointments[i].customer_name,
                            customer_name: practitioner.practiitioner_appointments[i].service_name,
                            practitioner_name: $scope.dashborad.all_business_appointments[i].practiitoner_name,
                            start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                            end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                            color: '#00bd71',
                            customer_icon: "user",
                            practitioner_icon: "heartbeat",
                            type: "permanent_appointment",
                            prac_ID: $scope.dashborad.all_business_appointments[i].business_practitioner,
                            id: practitioner.practiitioner_appointments[i].id
                        })
                    }

                    //******************Practitioner Appointment  Time********************************

                    for (i = 0; i < practitioner.practitioner_new_appointments.length; i++) {
                        var date = new Date(practitioner.practitioner_new_appointments[i].appointment_date);
                        start_hours = apiService.convertHours_Minutes(practitioner.practitioner_new_appointments[i].appointment_start_time, "start_hours")
                        start_min = apiService.convertHours_Minutes(practitioner.practitioner_new_appointments[i].appointment_start_time, "start_min")
                        end_hours = apiService.convertHours_Minutes(practitioner.practitioner_new_appointments[i].appointment_end_time, "end_hours")
                        end_min = apiService.convertHours_Minutes(practitioner.practitioner_new_appointments[i].appointment_end_time, "end_min")
                        var repeat_true = practitioner.practitioner_new_appointments[i].repeat_mode == 'Repeat';
                        dow = apiService.repeat_type_method(repeat_true, practitioner.practitioner_new_appointments[i])
                        repeat_end_date = apiService.repeat_end_type_method(repeat_true, practitioner.practitioner_new_appointments[i])
                        if (repeat_true && (practitioner.practitioner_new_appointments[i].repeat_type == 'Monthly' || practitioner.practitioner_new_appointments[i].repeat_type == 'Yearly')) {
                            monthly_start_date = new Date(practitioner.practitioner_new_appointments[i].appointment_date)
                            monthly_end_date = new Date(repeat_end_date)
                            do {
                                $scope.events.push({
                                    title: practitioner.practitioner_new_appointments[i].customer_name,
                                    customer_name: practitioner.practitioner_new_appointments[i].service_name,
                                    practitioner_name: practitioner.practitioner_new_appointments[i].practitioner_name,
                                    start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                                    end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                                    color: '#00bd71',
                                    customer_icon: "user",
                                    practitioner_icon: "heartbeat",
                                    type: "new_appointment",
                                    prac_ID: practitioner.practitioner_new_appointments[i].business_practitioner,
                                    id: practitioner.practitioner_new_appointments[i].id
                                })

                                if (practitioner.practitioner_new_appointments[i].repeat_type == 'Yearly') {
                                    monthly_start_date.setYear(monthly_start_date.getFullYear() + 1)
                                } else {
                                    if (practitioner.practitioner_new_appointments[i].monthly_type == 'Day of the month') {
                                        monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                    } else if (practitioner.practitioner_new_appointments[i].monthly_type == 'Day of the week') {
                                        monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                        monthly_start_date = apiService.getspecificDay(monthly_start_date, practitioner.practitioner_new_appointments[i].monthly_day, practitioner.practitioner_new_appointments[i].monthly_week)
                                    }
                                }
                            }
                            while (new Date(monthly_start_date) <= new Date(monthly_end_date));
                        } else if (repeat_true && !(practitioner.practitioner_new_appointments[i].repeat_type == 'Monthly' || practitioner.practitioner_new_appointments[i].repeat_type == 'Yearly')) {
                            $scope.events.push({
                                title: practitioner.practitioner_new_appointments[i].customer_name,
                                customer_name: practitioner.practitioner_new_appointments[i].service_name,
                                practitioner_name: practitioner.practitioner_new_appointments[i].practitioner_name,
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
                                type: "new_appointment",
                                prac_ID: practitioner.practitioner_new_appointments[i].business_practitioner,
                                id: practitioner.practitioner_new_appointments[i].id
                            })
                        } else if (!repeat_true) {
                            $scope.events.push({
                                title: practitioner.practitioner_new_appointments[i].customer_name,
                                customer_name: practitioner.practitioner_new_appointments[i].service_name,
                                practitioner_name: practitioner.practitioner_new_appointments[i].practitioner_name,
                                start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                                end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                                color: '#00bd71',
                                customer_icon: "user",
                                practitioner_icon: "heartbeat",
                                type: "new_appointment",
                                prac_ID: practitioner.practitioner_new_appointments[i].business_practitioner,
                                id: practitioner.practitioner_new_appointments[i].id

                            })
                        }
                    }

                    for (i = 0; i < practitioner.practitioner_block_times.length; i++) {
                        var date = new Date(practitioner.practitioner_block_times[i].blocked_date);
                        start_hours = apiService.convertHours_Minutes(practitioner.practitioner_block_times[i].blocked_start_time, "start_hours")
                        start_min = apiService.convertHours_Minutes(practitioner.practitioner_block_times[i].blocked_start_time, "start_min")
                        end_hours = apiService.convertHours_Minutes(practitioner.practitioner_block_times[i].blocked_end_time, "end_hours")
                        end_min = apiService.convertHours_Minutes(practitioner.practitioner_block_times[i].blocked_end_time, "end_min")
                        var repeat_true = practitioner.practitioner_block_times[i].repeat_mode == 'Repeat';
                        dow = apiService.repeat_type_method(repeat_true, practitioner.practitioner_block_times[i])
                        repeat_end_date = apiService.repeat_end_type_method(repeat_true, practitioner.practitioner_block_times[i])
                        if (repeat_true && (practitioner.practitioner_block_times[i].repeat_type == 'Monthly' || practitioner.practitioner_block_times[i].repeat_type == 'Yearly')) {
                            monthly_start_date = new Date(practitioner.practitioner_block_times[i].blocked_date)
                            monthly_end_date = new Date(repeat_end_date)
                            do {
                                $scope.events.push({
                                    title: " " + practitioner.practitioner_block_times[i].comment,
                                    practitioner_name: practitioner.practitioner_block_times[i].practitioner_name,
                                    start: new Date(monthly_start_date.getFullYear(), monthly_start_date.getMonth(), monthly_start_date.getDate(), start_hours, start_min),
                                    end: new Date(monthly_start_date.getFullYear(), monthly_start_date.getMonth(), monthly_start_date.getDate(), end_hours, end_min),
                                    color: '#E74C3C',
                                    comment_icon: "comment-o",
                                    practitioner_icon: "heartbeat",
                                    type: "block_time",
                                    prac_ID: practitioner.practitioner_block_times[i].blocked_practitioner,
                                    id: practitioner.practitioner_block_times[i].id
                                })
                                if (practitioner.practitioner_block_times[i].repeat_type == 'Yearly') {
                                    monthly_start_date.setYear(monthly_start_date.getFullYear() + 1)
                                } else {
                                    if (practitioner.practitioner_block_times[i].monthly_type == 'Day of the month') {
                                        monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                    } else if (practitioner.practitioner_block_times[i].monthly_type == 'Day of the week') {
                                        monthly_start_date.setMonth(monthly_start_date.getMonth() + 1)
                                        monthly_start_date = apiService.getspecificDay(monthly_start_date, practitioner.practitioner_block_times[i].monthly_day, practitioner.practitioner_block_times[i].monthly_week)
                                    }
                                }
                            }
                            while (new Date(monthly_start_date) <= new Date(monthly_end_date));
                        } else if (repeat_true && !(practitioner.practitioner_block_times[i].repeat_type == 'Monthly' || practitioner.practitioner_block_times[i].repeat_type == 'Yearly')) {
                            $scope.events.push({
                                title: " " + practitioner.practitioner_block_times[i].comment,
                                practitioner_name: practitioner.practitioner_block_times[i].practitioner_name,
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
                                prac_ID: practitioner.practitioner_block_times[i].blocked_practitioner,
                                id: practitioner.practitioner_block_times[i].id
                            })
                        } else {
                            $scope.events.push({
                                title: " " + practitioner.practitioner_block_times[i].comment,
                                practitioner_name: practitioner.practitioner_block_times[i].practitioner_name,
                                start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                                end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                                color: '#E74C3C',
                                comment_icon: "comment-o",
                                practitioner_icon: "heartbeat",
                                type: "block_time",
                                prac_ID: practitioner.practitioner_block_times[i].blocked_practitioner,
                                id: practitioner.practitioner_block_times[i].id
                            })

                        }
                    }
                    $('#calendar_' + localStorage.business_id + "_" + index).fullCalendar('addEventSource', $scope.events);
                    $('#calendar_' + localStorage.business_id + "_" + index).fullCalendar('refetchEvents');
                    $scope.events = $scope.events;
                }


                $scope.seriesArr = [];
                var color = "#E74C3C";
                var days = ['Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat', 'Sun']
                for (i = 0; i < days.length; i++) {
                    $scope.seriesArr.push({
                        name: days[i],
                        y: 0,
                        drilldown: days[i],
                        color: color
                    });
                }
                appointments = $scope.businessResponse.business_details[key].business_appointments;

                appointment_graph = function(appointments) {
                    for (i = 0; i < appointments.length; i++) {
                        appointment_day = new Date(appointments[i].appointment_date).getDay()
                        if (appointment_day == 0)
                            appointment_day = 7
                        $scope.seriesArr[appointment_day - 1].y = $scope.seriesArr[appointment_day - 1].y + 1
                    }
                }
                appointment_graph(appointments);
                $scope.chartConfig = {
                    chart: {
                        type: 'column'
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        title: {
                            text: 'No. of Appointments'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: false,
                                format: '{point.y:1}'
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:2}</b> of total<br/>'
                    },
                    series: [{
                        name: 'Brands',
                        colorByPoint: true,
                        data: $scope.seriesArr
                    }],
                };

                localStorage.business_id = $scope.businessResponse.business_details[key].id;
                $scope.dashborad.step1Status = $scope.businessResponse.business_details[key].id;
                business_slug_mail = $scope.businessResponse.business_details[key].slug ? $scope.businessResponse.business_details[key].slug : ""
                $scope.dashborad.step2Status = $scope.businessResponse.business_details[key].id;
                $scope.dashborad.businessName = $scope.businessResponse.business_details[key].name;

                $scope.dashborad.address = $scope.businessResponse.business_details[key].business_location.address;
                $scope.dashborad.city = $scope.businessResponse.business_details[key].business_location.city;
                $scope.dashborad.state = $scope.businessResponse.business_details[key].business_location.state;
                $scope.dashborad.postal_code = $scope.businessResponse.business_details[key].business_location.postal_code;
                $scope.dashborad.email = $scope.businessResponse.business_details[key].email;
                $scope.dashborad.contact_name = $scope.businessResponse.business_details[key].contact_name;
                $scope.dashborad.telephone = $scope.businessResponse.business_details[key].tel_no;
                // ********************* SET Service Detail Data ***********************************************
                $scope.dashborad.days = $scope.businessResponse.business_details[key].business_days;
                $scope.dashborad.servicesArray = $scope.businessResponse.business_details[key].business_service;
                $timeout(function() {
                    $scope.businessResponse.business_details[key].serviceSlickDisp = true;
                }, 100)
                $scope.dashborad.booking_mode = $scope.businessResponse.business_details[key].business_detail.booking_mode;
                $scope.dashborad.business_profile = $scope.businessResponse.business_details[key].business_detail.business_profile;
                $scope.dashborad.cliniko_api = $scope.businessResponse.business_details[key].business_detail.business_cliniko_api;
                $scope.dashborad.businessPhotoArray = $scope.businessResponse.business_details[key].business_photos;
                for (var i = 0; i < $scope.dashborad.businessPhotoArray.length; i++) {
                    if ($scope.dashborad.businessPhotoArray[i].type_of_url == 'Video') {
                        $scope.dashborad.businessPhotoArray[i].thumb_image = apiService.getThumb($scope.dashborad.businessPhotoArray[i].correct_image, 'small')
                    }
                }
                $scope.convertImgToDataURLviaCanvas($scope.businessResponse.business_details[key].business_detail['thumb_image'], function(base64Img) {
                    $scope.dashborad.logo_image = base64Img;
                });
                $scope.dashborad.logo_name = $scope.businessResponse.business_details[key].business_detail.logo_name;
                $scope.dashborad.cancellation_policy = $scope.businessResponse.business_details[key].business_detail.cancelation_policy;
                $scope.dashborad.lead_time = $scope.businessResponse.business_details[key].business_detail.max_lead_time;
                $scope.dashborad.Scheduled_month = $scope.businessResponse.business_details[key].business_detail.max_feature_time;
                $scope.dashborad.reviews_active = $scope.businessResponse.business_details[key].business_detail.reviews_active;
                $scope.dashborad.website = $scope.businessResponse.business_details[key].business_detail.website;
                $scope.dashborad.facebook = $scope.businessResponse.business_details[key].business_detail.facebook_link;
                $scope.dashborad.business_telephone = $scope.businessResponse.business_details[key].business_detail.business_telephone;
                //********* SET Practitioners Detail Data **********/
                $scope.dashborad.PractitionerList = $scope.businessResponse.business_details[key].business_practitioner
                if ($scope.dashborad.PractitionerList.length == 1) {
                    $scope.dashborad.all_calendar = false
                } else {
                    $scope.dashborad.all_calendar = true
                }
                $timeout(function() {
                    $scope.businessResponse.business_details[key].slickDisp = true;
                }, 100)
                apiService.getData('a_get_business_services/' + localStorage.business_id + "/", {}, 'get').then(function(res) {
                        $scope.dashborad.businessServiceResponse = res.data.business_service
                    })
                    // Step 4
                $scope.dashborad.abn = $scope.businessResponse.business_details[key].abn;
                $scope.dashborad.bnkName = $scope.businessResponse.business_details[key].business_stripe.bank_name;
                $scope.dashborad.accHolderName = $scope.businessResponse.business_details[key].business_stripe.account_holder_name;
                $scope.dashborad.RoutingName = $scope.businessResponse.business_details[key].business_stripe.routing_number;
                spinnerService.hide("html5spinner");

            }
            // To get all the LISt of State of Australia
        apiService.getData('all_state/', {}, 'get').then(function(res) {
                $scope.dashborad.State = res.data.state
                allStateList = [];
                angular.forEach($scope.dashborad.State,function(obj,key){
                    allStateList.push(obj['state'])
                });
            })
            // To get all the List of Exsiting Service
        apiService.getData('a_get_service_cat/', {}, 'get').then(function(res) {
            $scope.ServiceResponse = {
                services: res.data.avaana_services,
                avaana_categories: res.data.avaana_categories,
            }
        })

        var after_updating = function(type,id) {
                apiService.getDataWithToken('updating_mail/', {"update":type,"slug":business_slug_mail,"id":id}, 'post').then(function(res) {
                    // console.log(JSON.stringify(res.data))
                    if (res.data.status == 200) {} else {}
                })
            }
            // Static Array fro Practitioner timing
            /************** Step 1 Validation and API call  *******************/

        var focus_function = function(location) {
            $("#" + location).focus()
                // }
        }
        $scope.validateName = function() {
            if ($scope.dashborad.businessName == '' || $scope.dashborad.businessName == undefined || $scope.dashborad.businessName == null) {
                $scope.dashborad.businessNameErr = "Please enter your Business Name";
            } else {
                $scope.dashborad.businessNameErr = null;
            }
        }
        $scope.validateAddress = function() {
            if ($scope.dashborad.address == '' || $scope.dashborad.address == undefined || $scope.dashborad.address == null) {
                $scope.dashborad.addressErr = "Please enter your business address.";
            } else {
                $scope.dashborad.addressErr = null;
                // scroll_error = false
            }
        }
        $scope.validateCity = function() {
            if ($scope.dashborad.city == '' || $scope.dashborad.city == undefined || $scope.dashborad.city == null) {
                $scope.dashborad.cityErr = "Please enter your city.";
            } else {
                $scope.dashborad.cityErr = null;
                // scroll_error = false
            }
        }
        $scope.validateState = function() {
            if ($scope.dashborad.state == '' || $scope.dashborad.state == undefined || $scope.dashborad.state == null) {
                $scope.dashborad.stateErr = "Please enter your state.";
                //scroll_function('scroll_business_state')
            } else {
                $scope.dashborad.stateErr = null;
                // scroll_error = false
            }
        }
        $scope.validatePostal_code = function() {
            if ($scope.dashborad.postal_code == '' || $scope.dashborad.postal_code == undefined || $scope.dashborad.postal_code == null) {
                $scope.dashborad.postal_codeErr = "Please enter your post code.";
                //scroll_function('scroll_business_postcode')
            } else {
                $scope.dashborad.postal_codeErr = null;
                // scroll_error = false
            }
        }
        $scope.validateEmail = function() {
            if ($scope.dashborad.email == '' || $scope.dashborad.email == undefined || $scope.dashborad.email == null) {
                $scope.dashborad.emailErr = "Please enter your email.";
                //scroll_function('scroll_business_email')
            } else if (!emailRegex.test($scope.dashborad.email)) {
                $scope.dashborad.emailErr = "Please enter a valid email address.";
                //scroll_function('scroll_business_email')
            } else {
                $scope.dashborad.emailErr = null;
                // scroll_error = false
            }
        }
        $scope.validateContactname = function() {
            if ($scope.dashborad.contact_name == '' || $scope.dashborad.contact_name == undefined || $scope.dashborad.contact_name == null) {
                $scope.dashborad.contact_nameErr = "Please enter the name of a representative of your business that we can reach out to.";
                //scroll_function('scroll_business_key_contact')
            } else {
                $scope.dashborad.contact_nameErr = null;
                // scroll_error = false
            }
        }
        $scope.validateTelephone = function() {
            if ($scope.dashborad.telephone == '' || $scope.dashborad.telephone == undefined || $scope.dashborad.telephone == null) {
                $scope.dashborad.telephoneErr = "Please enter your business contact's number."
                    //scroll_function('scroll_business_contact')
            } else if ($scope.dashborad.telephone != '' && $scope.dashborad.telephone != undefined && $scope.dashborad.telephone != null) {
                if (!numRegex.test($scope.dashborad.telephone)) {
                    $scope.dashborad.telephoneErr = "Please use numbers only; no dashes or spaces."
                        //scroll_function('scroll_business_contact')
                } else {
                    $scope.dashborad.telephoneErr = null;
                    // scroll_error = false
                }
            } else {
                $scope.dashborad.telephoneErr = null;
                // scroll_error = false
            }
        }
        $scope.Step1 = function() {
            $scope.validateName();
            $scope.validateAddress();
            $scope.validateCity();
            $scope.validateState();
            $scope.validatePostal_code();
            $scope.validateEmail();
            $scope.validateContactname();
            $scope.validateTelephone();

            if ($scope.dashborad.businessNameErr != null) {
                focus_function('scroll_business_name');
            } else if ($scope.dashborad.cityErr != null) {
                focus_function('locality');
            } else if ($scope.dashborad.stateErr != null) {
                focus_function('administrative_area_level_1');
            } else if ($scope.dashborad.postal_codeErr != null) {
                focus_function('postal_code');
            } else if ($scope.dashborad.emailErr != null) {
                focus_function('scroll_business_email');
            } else if ($scope.dashborad.contact_nameErr != null) {
                focus_function('scroll_business_key_contact');
            } else if ($scope.dashborad.telephoneErr != null) {
                focus_function('scroll_business_contact');
            } else if ($scope.dashborad.businessNameErr == null && $scope.dashborad.addressErr == null && $scope.dashborad.cityErr == null && $scope.dashborad.stateErr == null && $scope.dashborad.postal_codeErr == null && $scope.dashborad.emailErr == null && $scope.dashborad.contact_nameErr == null && $scope.dashborad.telephoneErr == null) {
                spinnerService.show("html5spinner");
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                    'address': $scope.dashborad.address + $scope.dashborad.city + $scope.dashborad.state + $scope.dashborad.postal_code
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        $scope.lat = results[0].geometry.location.lat();
                        $scope.lng = results[0].geometry.location.lng();
                    } else {
                        alert("Geocode was not successful: " + status);
                    }
                });
                data = {
                    id: $scope.dashborad.step1Status,
                    name: $scope.dashborad.businessName,
                    location_data: {
                        address: $scope.dashborad.address,
                        city: $scope.dashborad.city,
                        state: $scope.dashborad.state,
                        postal_code: $scope.dashborad.postal_code,
                        lat: $scope.lat,
                        lng: $scope.lng
                    },
                    email: $scope.dashborad.email,
                    contact_name: $scope.dashborad.contact_name,
                    tel_no: $scope.dashborad.telephone,
                }
                apiService.getData('a_createbusiness/', data, 'post').then(function(success) {
                    if (success.data.status == 500) {
                        spinnerService.hide("html5spinner");
                        $scope.dashborad.apiError = success.data.Error;
                        error_key = Object.keys(success.data.Message);
                        if (error_key[0] === 'email') {
                            $scope.register.emailErr = "Email address already exists.";
                        } else {
                            $scope.register.addressErr = success.data.Error;
                        }
                    } else {
                        spinnerService.hide("html5spinner");
                        localStorage.business_id = success.data.Business_data.id;
                        after_updating("Step-1")
                        $scope.dashborad.step1Status = $scope.businessResponse.business_details[key].id;
                        $scope.dashborad.step2Status = $scope.businessResponse.business_details[key].id;
                        $scope.custom_dailog("Key Business & Contact Information Details Changed");
                    }
                }, function(error) {
                        spinnerService.hide("html5spinner");

                });
            }
        }



        /******************************* Step 2 Validation  ******************************************************/
        $scope.validatePrac_name = function() {
            if ($scope.dashborad.prac_name == '' || $scope.dashborad.prac_name == undefined || $scope.dashborad.prac_name == null) {
                $scope.dashborad.prac_nameErr = "Please enter the name of your practitioner.";
            } else {
                $scope.dashborad.prac_nameErr = null;
                // scroll_error = false
            }
        }
        $scope.validatePractitionerLogoImage = function() {
            if ($scope.dashborad.practitioner_logo_name == '' || $scope.dashborad.practitioner_logo_name == undefined || $scope.dashborad.practitioner_logo_name == null) {
                $scope.dashborad.practitionerImageErr = "Please choose a picture for your practitioner.";
            } else {
                $scope.dashborad.practitionerImageErr = null;
                // scroll_error = false
            }
        }
        $scope.validatePrac_Profile = function() {
            if ($scope.dashborad.prac_profile == '' || $scope.dashborad.prac_profile == undefined || $scope.dashborad.prac_profile == null) {
                $scope.dashborad.prac_profileErr = "Please enter a short bio for this practitioner (Maximum 600 characters).";
            } else {
                $scope.dashborad.prac_profileErr = null;
                // scroll_error = false
            }
        }

        $scope.validatePractitioneremail = function() {
            if ($scope.dashborad.prac_email == '' || $scope.dashborad.prac_email == undefined || $scope.dashborad.prac_email == null) {
                $scope.dashborad.prac_emailErr = "Please enter this practitioner's email.";
            } else if (!emailRegex.test($scope.dashborad.prac_email)) {
                $scope.dashborad.prac_emailErr = "Please enter a valid email address.";
            } else {
                $scope.dashborad.prac_emailErr = null;
                // scroll_error = false
            }
        }

        $scope.removePractitionerAPI = function(){
            apiService.getDataWithToken('a_business_practitioner_remove/' + $scope.removePractitionerID + "/", {}, 'get').then(function(success) {
                // console.log("Success..." + JSON.stringify(success.data))
                if (success.data.status == 200) {
                    $scope.businessResponse.business_details[key].slickDisp = false
                    $scope.dashborad.PractitionerList = success.data.Business_all_practitioner;
                    if ($scope.dashborad.PractitionerList.length == 1) {
                        $scope.dashborad.all_calendar = false
                    } else {
                        $scope.dashborad.all_calendar = true
                    }
                    $timeout(function() {
                        $scope.businessResponse.business_details[key].slickDisp = true
                    }, 100)
                    $scope.custom_dailog("Practitioner Removed");
                }
            }, function(error) {});

        }

        $scope.removePractitioner = function(practitioner) {
            $scope.removePractitionerID = practitioner.id
            complete_registration_pop_up("Are you sure you wish to remove "+practitioner.name+" as a practitioner associated with your business",$scope.removePractitionerAPI);
            return;
        }


        $scope.editPractitioner = function(practitioner) {
            $scope.pract_text = 'Save Changes'
            $scope.dashborad.prac_name = practitioner.name
            $scope.myImage = practitioner.correct_image
            $scope.dashborad.prac_profile = practitioner.profile
            $scope.dashborad.prac_email = practitioner.email
            $scope.dashborad.practitioner_logo_name = practitioner.logo_name
            $scope.update_prac_id = practitioner.id
            $scope.convertImgToDataURLviaCanvas(practitioner.correct_image, function(base64Img) {
                $scope.dashborad.practitioner_logo_image = base64Img;
            });
        }
        $scope.update_prac_id = null
        $scope.step3 = function() {
            $scope.validatePrac_name();
            // $scope.validatePractitionerLogoImage();
            // $scope.validatePrac_Profile();
            $scope.validatePractitioneremail();
            // && $scope.dashborad.prac_profileErr == null && $scope.dashborad.practitionerImageErr == null

            if ($scope.dashborad.prac_nameErr != null) {
                focus_function('prac_name_error')
            } else if ($scope.dashborad.prac_profileErr != null) {
                focus_function('prac_profile_error')
            } else if ($scope.dashborad.prac_emailErr != null) {
                focus_function('prac_email_error')
            } else if ($scope.dashborad.prac_nameErr == null && $scope.dashborad.prac_emailErr == null) {
                spinnerService.show("html5spinner");
                update_type = $scope.update_prac_id?"Prac_update":"Prac_added"
                data = {
                    id: $scope.update_prac_id,
                    name: $scope.dashborad.prac_name,
                    logo_image: $scope.dashborad.practitioner_logo_image,
                    logo_name: $scope.dashborad.practitioner_logo_name,
                    profile: $scope.dashborad.prac_profile,
                    email: $scope.dashborad.prac_email,
                    business: localStorage.business_id
                }
                apiService.getData('a_createbusiness_practitioner/', data, 'post').then(function(success) {
                    console.log(JSON.stringify(success.data))
                    if (success.data.status == 500) {
                        $scope.dashborad.step3ApiErr = success.data.Error
                    } else {
                        $scope.businessResponse.business_details[key].slickDisp = false
                        $scope.dashborad.step3ApiErr = success.data.message
                        $scope.dashborad.PractitionerList = success.data.Business_all_practitioner;
                        $scope.businessResponse.business_details[key].business_practitioner = success.data.Business_all_practitioner;
                        if ($scope.dashborad.PractitionerList.length == 1) {
                            $scope.dashborad.all_calendar = false
                        } else {
                            $scope.dashborad.all_calendar = true
                        }
                        $scope.update_prac_id = null;
                        $timeout(function() {
                            $scope.businessResponse.business_details[key].slickDisp = true
                        }, 100)
                        blankPractitionerInput();
                        after_updating(update_type,success.data.Business_all_practitioner[0]['id']);
                        if($scope.pract_text == 'Save Changes'){
                            $scope.custom_dailog("Practitioner Details Changed");
                        }else{
                            $scope.custom_dailog("Practitioner Added");
                        }
                        $scope.pract_text = '+ Add Practitioner'
                    }
                    spinnerService.hide("html5spinner");
                }, function(error) {
                    spinnerService.hide("html5spinner");
                    // console.log('Error:' + JSON.stringify(error));
                });
            }
        }
        var blankPractitionerInput = function() {
            $scope.dashborad.prac_name = ''
            $scope.dashborad.prac_profile = ''
            $scope.dashborad.prac_email = ''
            $scope.dashborad.practitioner_logo_image = null;
            $scope.dashborad.practitioner_logo_name = null;
            $scope.dashborad.practitionerImageErr = null;
        }
        $scope.step3Continue = function() {
            if ($scope.dashborad.PractitionerList.length <= 0) {
                $scope.dashborad.step3ApiErr = "Please enter at least one Practitioner."
            } else {
                $scope.dashborad.step3ApiErr = null
                $scope.status.payment_card = true;
            }
        }



        $scope.CategroySearchMethod = function(txt) {
                var resArr = $scope.ServiceResponse.avaana_categories;
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
            // Ends Here
        $scope.ChangeCategoryItem = function(id) {
            for (i = 0; i < $scope.ServiceResponse.avaana_categories.length; i++) {
                if ($scope.ServiceResponse.avaana_categories[i].id == id) {
                    $scope.ServiceResponse.services = $scope.ServiceResponse.avaana_categories[i].category_serviceArray;
                }
            }
        }
        $scope.ServiceSearchMethod = function(txt) {
            var resArr = $scope.ServiceResponse.services;
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
        $scope.validateService = function() {
            if ($('#service_name input[type="search"]:eq(0)').val() == '' || $('#service_name input[type="search"]:eq(0)').val() == undefined || $('#service_name input[type="search"]:eq(0)').val() == null) {
                $scope.dashborad.dashborad_serviceErr = "Please enter a service.";
            } else {
                $scope.dashborad.dashborad_serviceErr = null;
            }
        }
        $scope.validatecategory = function() {
            if ($('#category_name input[type="search"]:eq(0)').val() == '' || $('#category_name input[type="search"]:eq(0)').val() == undefined || $('#category_name input[type="search"]:eq(0)').val() == null) {
                $scope.dashborad.dashborad_catgErr = "Please select a category for this service.";
            } else {
                $scope.dashborad.dashborad_catgErr = null;
            }
        }

        $scope.validateprovidingService = function() {
            if ($scope.dashborad.prac_provide_service == '' || $scope.dashborad.prac_provide_service == undefined || $scope.dashborad.prac_provide_service == null) {
                $scope.dashborad.providing_serviceErr = "Please select at least one of your practitioners who is qualified to provide this service.";
            } else {
                $scope.dashborad.providing_serviceErr = null;
            }
        }

        $scope.validateserviceLength = function() {
            if ($scope.dashborad.service_length == '' || $scope.dashborad.service_length == undefined || $scope.dashborad.service_length == null) {
                $scope.dashborad.service_lengthErr = "Please select a time duration for this service.";
            } else {
                $scope.dashborad.service_lengthErr = null;
            }
        }
        $scope.validateServicePrice = function() {

                if ($scope.dashborad.service_price == '' || $scope.dashborad.service_price == undefined || $scope.dashborad.service_price == null) {
                    $scope.dashborad.service_priceErr = "Please enter a price.";
                } else {
                    $scope.dashborad.service_priceErr = null;
                }

                if ($scope.dashborad.service_price.length && $scope.dashborad.service_price.indexOf('$') == -1) {
                    $scope.dashborad.service_price = "$" + $scope.dashborad.service_price
                } else if ($scope.dashborad.service_price == '$') {
                    $scope.dashborad.service_price = null;
                }


            }
            /********* Ends Here ******/
        $scope.validateServiceDiscount = function() {
            if ($scope.dashborad.service_discount == '' || $scope.dashborad.service_discount == undefined || $scope.dashborad.service_discount == null) {
                $scope.dashborad.service_discountErr = null;
            } else if ($scope.dashborad.service_discount != '' || $scope.dashborad.service_discount != undefined || $scope.dashborad.service_discount != null) {
                if ($scope.dashborad.service_discount.length && $scope.dashborad.service_discount.indexOf('$') == -1) {
                    $scope.dashborad.service_discount = "$" + $scope.dashborad.service_discount
                } else if ($scope.dashborad.service_discount == '$') {
                    $scope.dashborad.service_discount = null;
                }
                var price = $scope.dashborad.service_price.indexOf('$') != -1 ? $scope.dashborad.service_price.substring(1, $scope.dashborad.service_price.length) : $scope.dashborad.service_price;
                var discount = $scope.dashborad.service_discount.indexOf('$') != -1 ? $scope.dashborad.service_discount.substring(1, $scope.dashborad.service_discount.length) : $scope.dashborad.service_discount;
                if (parseInt(discount) > parseInt(price)) {
                    $scope.dashborad.service_discountErr = "Discounted Price can not be greater than normal price.";
                } else {
                    $scope.dashborad.service_discountErr = null;
                }
            }
        }


        $scope.service_id = null;
        $scope.addService = function() {
                $scope.validateService();
                $scope.validatecategory();
                $scope.validateprovidingService();
                $scope.validateserviceLength();
                $scope.validateServicePrice();
                $scope.validateServiceDiscount();
                if ($scope.dashborad.business_serviceErr == null && $scope.dashborad.providing_serviceErr == null && $scope.dashborad.service_lengthErr == null && $scope.dashborad.service_priceErr == null && $scope.dashborad.service_discountErr == null) {
                    spinnerService.show("html5spinner");
                    update_type = $scope.service_id?"Ser_update":"Ser_added"

                    data = {
                        business: localStorage.business_id,
                        service_name: $('#service_name input[type="search"]:eq(0)').val(),
                        category_name: $('#category_name input[type="search"]:eq(0)').val(),
                        length_of_service: $scope.dashborad.service_length,
                        service_practitioner: $scope.dashborad.prac_provide_service,
                        price: $scope.dashborad.service_price.indexOf('$') != -1 ? $scope.dashborad.service_price.substring(1, $scope.dashborad.service_price.length) : $scope.dashborad.service_price,
                        discount: $scope.dashborad.service_discount == undefined ? $scope.dashborad.service_discount : $scope.dashborad.service_discount.indexOf('$') != -1 ? $scope.dashborad.service_discount.substring(1, $scope.dashborad.service_discount.length) : $scope.dashborad.service_discount,
                        id: $scope.service_id
                    }
                    apiService.getData('a_createbusiness_service/', data, 'post').then(function(success) {
                        // console.log("Success..." + JSON.stringify(success.data))
                        if (success.data.status == 500) {
                            $scope.dashborad.ServiceApiErr = success.data.Error;
                        } else {
                            $scope.businessResponse.business_details[key].serviceSlickDisp = false
                            $scope.dashborad.businessServiceResponse = success.data.business_service;
                            $scope.dashborad.ServiceApiErr = null;
                            $scope.blankServiceInput();
                            $scope.dashborad.servicesArray = success.data.business_service
                            $timeout(function() {
                                $scope.businessResponse.business_details[key].serviceSlickDisp = true
                            }, 100);
                            spinnerService.hide("html5spinner");
                            after_updating(update_type)
                            if($scope.service_id == null){
                                $scope.custom_dailog("Service Added",success.data.business_service[0]['id']);
                            }else{
                                $scope.custom_dailog("Service Details Changed");
                            }
                            $scope.service_text = '+ Add Service'
                            $scope.service_id = null;
                                // confirm(success.data.Message);
                        }
                    }, function(error) {
                        spinnerService.hide("html5spinner");
                        // console.log('Error:' + JSON.stringify(error));
                    });
                }
            }
            /******* Add Service end  ************************/
            /********* Remove Service  ******************/
        $scope.removeServiceAPI = function(){
            apiService.getData('a_createbusiness_service_remove/' + $scope.removeServiceID + "/", {}, 'get').then(function(success) {
                    if (success.data.status == 500) {
                        $scope.dashborad.ServiceApiErr = success.data.Message;
                    } else {
                        $scope.businessResponse.business_details[key].serviceSlickDisp = false
                        for (i = 0; i < $scope.dashborad.servicesArray.length; i++) {
                            if ($scope.dashborad.servicesArray[i].id == $scope.removeServiceID) {
                                $scope.dashborad.servicesArray.splice(i, 1)
                            }
                        }
                        $timeout(function() {
                            $scope.businessResponse.business_details[key].serviceSlickDisp = true
                        }, 100);
                        $scope.custom_dailog("Service Removed");
                    }
                }, function(error) {});

        }
        $scope.removeService = function(id,service_name) {
            $scope.removeServiceID = id
            complete_registration_pop_up("Are you sure you wish to remove "+service_name+" as a service provided by your business", $scope.removeServiceAPI);
            return;
            }
            /*********** Remove Service end  ******************/
            /************* Edit Service  *******************/
        $scope.editService = function(id) {
            $scope.service_text = 'Save Changes'
                for (i = 0; i < $scope.dashborad.servicesArray.length; i++) {
                    if ($scope.dashborad.servicesArray[i].id == id) {
                        $('#service_name input[type="search"]:eq(0)').val($scope.dashborad.servicesArray[i].service_name);
                        $('#category_name input[type="search"]:eq(0)').val($scope.dashborad.servicesArray[i].category_name);
                        $scope.dashborad.service_length = $scope.dashborad.servicesArray[i].length_of_service;
                        $scope.dashborad.prac_provide_service = $scope.dashborad.servicesArray[i].service_practitioner;
                        $scope.dashborad.service_price = '$' + $scope.dashborad.servicesArray[i].price;
                        $scope.dashborad.service_discount = '$' + $scope.dashborad.servicesArray[i].discount;
                        $scope.service_id = id;
                    }
                }
            }
            /******* Add Service end  ****************************/
            /********** Function for clean the input fields  *************/
        $scope.blankServiceInput = function() {
                $('#service_name input[type="search"]:eq(0)').val(undefined)
                $('#category_name input[type="search"]:eq(0)').val(undefined)
                $scope.dashborad.service_length = undefined
                $scope.dashborad.service_price = undefined
                $scope.dashborad.service_discount = undefined
            }
            /********  modal for selcting the photo  *******************/
        $scope.openPhotoModal = function(type, business_photo) {

            $scope.shomMyImage = false;
            $scope.myImage = '';
            $scope.photoModel = $uibModal.open({
                templateUrl: 'static/templates/photoModal.html',
                controller: 'photo_Ctrl',
                scope: $scope,
            });
            $scope.type = type;
            $scope.photoModel.rendered.then(function(success) {
                $scope.myCroppedImage = '';
                var handleFileSelect = function(evt) {
                    var file = evt.currentTarget.files[0];
                    var reader = new FileReader();
                    reader.onload = function(evt) {
                        $scope.$apply(function($scope) {
                            $scope.myImage = evt.target.result;
                            $scope.shomMyImage = true;
                        });
                    };
                    reader.readAsDataURL(file);
                };
                angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
            }, function(error) {})
        }
        $scope.$on("photoChoosen", function(evt, data) {
            spinnerService.show("html5spinner");
            logo_names = data.name;
            type = data.type;
            data = {
                image: data.img,
                business: localStorage.business_id,
                name: logo_names,
                type_of_url: type,
            }
            apiService.getData('a_createbusiness_photo/', data, 'post').then(function(success) {
                // console.log("Success..." + JSON.stringify(success.data))
                if (success.data.status == 500) {
                    $scope.dashborad.business_photoErr = success.data.Error;
                } else {
                    $scope.dashborad.business_photoErr = null
                    $scope.dashborad.businessPhotoArray.push({
                        id: success.data.Business_Photo['id'],
                        business: success.data.Business_Photo['business'],
                        correct_image: success.data.Business_Photo['correct_image'],
                        name: success.data.Business_Photo['name'],
                        type_of_url: success.data.Business_Photo['type_of_url'],
                        thumb_image: success.data.Business_Photo['type_of_url'] == 'Image' ? success.data.Business_Photo['thumb_image'] : apiService.getThumb(success.data.Business_Photo['correct_image'], 'small')
                    })
                    spinnerService.hide("html5spinner");
                    after_updating()
                }
            }, function(error) {
                spinnerService.hide("html5spinner");
            })

        })
        $scope.$on("logoChoosen", function(evt, data) {
            $scope.dashborad.business_logoErr = null;
            $scope.dashborad.logo_image = data.img;
            $scope.dashborad.logo_name = data.name;
        })
        $scope.$on("practitionerlogoChoosen", function(evt, data) {
            $scope.dashborad.practitionerImageErr = null;
            $scope.dashborad.practitioner_logo_image = data.img;
            $scope.dashborad.practitioner_logo_name = data.name;
        })
        $scope.dashborad.removeLogo = function() {
            $scope.dashborad.logo_image = null;
            $scope.dashborad.logo_name = null;
            $scope.dashborad.business_logoErr = "Please choose a logo for your business page.";
        }
        $scope.removePractitionerLogo = function() {
            $scope.dashborad.practitioner_logo_image = null;
            $scope.dashborad.practitioner_logo_name = null;
            $scope.dashborad.practitionerImageErr = "Please choose a picture for your practitioner.";
        }
        $scope.removeBusinessPhoto = function(id) {
            apiService.getData('a_createbusiness_photo_remove/' + id + "/", {}, 'get').then(function(success) {
                if (success.data.status == 500) {
                    $scope.dashborad.ServiceApiErr = success.data.Message;
                } else {
                    for (i = 0; i < $scope.dashborad.businessPhotoArray.length; i++) {
                        if ($scope.dashborad.businessPhotoArray[i].id == id) {
                            $scope.dashborad.businessPhotoArray.splice(i, 1)
                        }
                    }
                }
            }, function(error) {});
        }
        $scope.showTimePicker = function(ev, day, type) {
                if (type == 'start') {
                    $mdpTimePicker(new Date(2016, 10, 14, 00, 00), {
                        targetEvent: ev
                    }).then(function(selectedDate) {
                        day.start_timing = $filter('date')(selectedDate, 'hh:mm a');
                    });
                } else {
                    $mdpTimePicker(new Date(2016, 10, 14, 00, 00), {
                        targetEvent: ev
                    }).then(function(selectedDate) {
                        day.end_timing = $filter('date')(selectedDate, 'hh:mm a');
                    });
                }
                $scope.dashborad.timingError = null
                $scope.dashborad.prac_timeErr = null
            }
            /*********** Step 2 Validation and API call *****************/
        $scope.validatebusinesstiming = function() {
            $scope.timing_count = 0;
            for (i = 0; i < $scope.dashborad.days.length; i++) {
                if ($scope.dashborad.days[i].day_status == "Open") {
                    if ($scope.dashborad.days[i].start_timing != "00:00" && $scope.dashborad.days[i].end_timing != "00:00") {
                        $scope.timing_count++;
                    }
                }
            }
            if ($scope.timing_count == 0) {
                $scope.dashborad.timingError = "Please select at least one day for open hours."
            } else {
                $scope.dashborad.timingError = null
            }
        }
        $scope.validatebusinessService = function() {
            if ($scope.dashborad.servicesArray.length <= 0) {
                $scope.dashborad.ServiceApiErr = "Please add at least one service for your business."
            } else {
                $scope.dashborad.ServiceApiErr = null
            }
        }
        $scope.validatebookingMode = function() {
            if ($scope.dashborad.booking_mode == '' || $scope.dashborad.booking_mode == undefined || $scope.dashborad.booking_mode == null) {
                $scope.dashborad.bookingModeErr = "Please select a booking mode you use for your business.";
            } else {
                $scope.dashborad.bookingModeErr = null;
            }
        }
        $scope.validatebusinessProfile = function() {
            if ($scope.dashborad.business_profile == '' || $scope.dashborad.business_profile == undefined || $scope.dashborad.business_profile == null) {
                $scope.dashborad.business_profileErr = "Please enter a short description of your business.";
            } else {
                $scope.dashborad.business_profileErr = null;
            }
        }

        $scope.validatebusinessPhotoArray = function() {
            if ($scope.dashborad.businessPhotoArray.length <= 0) {
                $scope.dashborad.business_photoErr = "Please choose at least one photo for your business page.";
            } else {
                $scope.dashborad.business_photoErr = null;
            }
        }
        $scope.validatebusinessLogoImage = function() {
            if ($scope.dashborad.logo_name == '' || $scope.dashborad.logo_name == undefined || $scope.dashborad.logo_name == null) {
                $scope.dashborad.business_logoErr = "Please choose a logo for your business page.";
            } else {
                $scope.dashborad.business_logoErr = null;
            }
        }
        $scope.validateCancellation = function() {
            if ($scope.dashborad.cancellation_policy == '' || $scope.dashborad.cancellation_policy == undefined || $scope.dashborad.cancellation_policy == null) {
                $scope.dashborad.cancellation_policyErr = "Please select your minimum cancellation time.";
            } else {
                $scope.dashborad.cancellation_policyErr = null;
            }
        }
        $scope.validateleadTime = function() {
            if ($scope.dashborad.lead_time == '' || $scope.dashborad.lead_time == undefined || $scope.dashborad.lead_time == null) {
                $scope.dashborad.lead_timeErr = "Please select a minimum lead time.";
            } else {
                $scope.dashborad.lead_timeErr = null;
            }
        }
        $scope.validateScheduling = function() {
            if ($scope.dashborad.Scheduled_month == '' || $scope.dashborad.Scheduled_month == undefined || $scope.dashborad.Scheduled_month == null) {
                $scope.dashborad.Scheduled_monthErr = "Please select a maximum lead time for scheduling.";
            } else {
                $scope.dashborad.Scheduled_monthErr = null;
            }
        }
        $scope.validateWebsite = function() {
            if ($scope.dashborad.website != '' && $scope.dashborad.website != undefined && $scope.dashborad.website != null) {
                if (!websiteRegex.test($scope.dashborad.website)) {
                    $scope.dashborad.websiteErr = "Please enter a valid website."
                } else {
                    $scope.dashborad.websiteErr = null;
                }
            } else {
                $scope.dashborad.websiteErr = null;
            }
        }

        $scope.validateFacebook = function() {
            if ($scope.dashborad.facebook != '' && $scope.dashborad.facebook != undefined && $scope.dashborad.facebook != null) {
                if (!websiteRegex.test($scope.dashborad.facebook)) {
                    $scope.dashborad.facebookErr = "Please enter a valid Facebook page."
                } else {
                    $scope.dashborad.facebookErr = null;
                }
            } else {
                $scope.dashborad.facebookErr = null;
            }
        }
        $scope.step2 = function() {
            $scope.validatebusinesstiming();
            $scope.validatebusinessService();
            $scope.validatebookingMode();
            $scope.validatebusinessProfile();
            $scope.validatebusinessPhotoArray();
            $scope.validatebusinessLogoImage();
            $scope.validateCancellation();
            $scope.validateleadTime();
            $scope.validateScheduling();
            $scope.validateWebsite();
            $scope.validateFacebook();
            if ($scope.dashborad.timingError == null && $scope.dashborad.ServiceApiErr == null && $scope.dashborad.bookingModeErr == null && $scope.dashborad.business_profileErr == null && $scope.dashborad.business_logoErr == null && $scope.dashborad.cancellation_policyErr == null && $scope.dashborad.lead_timeErr == null && $scope.dashborad.Scheduled_monthErr == null && $scope.dashborad.websiteErr == null && $scope.dashborad.facebookErr == null) {
                spinnerService.show("html5spinner");
                data = {
                    id: $scope.dashborad.step2Status,
                    Business_timing: $scope.dashborad.days,
                    booking_mode: $scope.dashborad.booking_mode,
                    business_profile: $scope.dashborad.business_profile,
                    logo_image: $scope.dashborad.logo_image,
                    logo_name: $scope.dashborad.logo_name,
                    business_cliniko_api: $scope.dashborad.cliniko_api,
                    cancelation_policy: $scope.dashborad.cancellation_policy,
                    max_lead_time: $scope.dashborad.lead_time,
                    max_feature_time: $scope.dashborad.Scheduled_month,
                    reviews_active: $scope.dashborad.reviews_active,
                    website: $scope.dashborad.website,
                    facebook_link: $scope.dashborad.facebook,
                    business_telephone: $scope.dashborad.business_telephone,
                    business: localStorage.business_id
                }
                apiService.getData('a_createbusiness_all/', data, 'post').then(function(success) {
                    // console.log(JSON.stringify(success.data))
                    if (success.data.status == 500) {
                        spinnerService.hide("html5spinner");
                        $scope.dashborad.step2ApiErr = success.data.Error
                    } else {
                        spinnerService.hide("html5spinner");
                        after_updating("Business_detail_update");
                        $scope.custom_dailog("Provider Page and Scheduling Information Changed");
                    }
                }, function(error) {
                    spinnerService.hide("html5spinner");
                });
            }
        }



        $scope.validateABN = function() {
            if ($scope.dashborad.abn == '' || $scope.dashborad.abn == undefined || $scope.dashborad.abn == null) {
                $scope.dashborad.abnErr = "Please enter your Australian Business Number (ABN).";
            } else if (!numRegex.test($scope.dashborad.abn)) {
                $scope.dashborad.abnErr = "Please enter only numbers.";
            } else if ($scope.dashborad.abn.length != 11) {
                $scope.dashborad.abnErr = "Please type your 11 digit ABN without any spaces.";
            } else {
                $scope.dashborad.abnErr = null;
            }
        }


        $scope.validate_bank_name = function() {
            if ($scope.dashborad.bnkName == null || $scope.dashborad.bnkName == undefined || $scope.dashborad.bnkName == '') {
                $scope.dashborad.bnkNameErr = "Please enter your bank name."
            } else {
                $scope.dashborad.bnkNameErr = null
            }
        }


        $scope.validate_account_holder_name = function() {
            if ($scope.dashborad.accHolderName == null || $scope.dashborad.accHolderName == undefined || $scope.dashborad.accHolderName == '') {
                $scope.dashborad.accHolderNameErr = "Please enter the name associated with this account."
            } else {
                $scope.dashborad.accHolderNameErr = null
            }
        }

        $scope.validate_bank_routing_number = function() {
            if ($scope.dashborad.RoutingName == null || $scope.dashborad.RoutingName == undefined || $scope.dashborad.RoutingName == '') {
                $scope.dashborad.RoutingErr = "Please enter your BSB without any spaces."
            } else if (isNaN($scope.dashborad.RoutingName)) {
                $scope.dashborad.RoutingErr = "Please use numbers only; no dashes or spaces."
            } else if ($scope.dashborad.RoutingName.length != 6) {
                $scope.dashborad.RoutingErr = "Please enter a valid BSB."
            } else {
                $scope.dashborad.RoutingErr = null
            }
        }

        $scope.validate_account_number = function() {
            if ($scope.dashborad.accountNumber == null || $scope.dashborad.accountNumber == undefined || $scope.dashborad.accountNumber == '') {
                $scope.dashborad.accountNumberErr = "Please enter your account number without spaces."
            } else if (isNaN($scope.dashborad.accountNumber)) {
                $scope.dashborad.accountNumberErr = "Please use numbers only; no dashes or spaces."
            } else if (7 < $scope.dashborad.accountNumber.length > 10) {
                $scope.dashborad.accountNumberErr = "Please enter a valid account number."
            } else {
                $scope.dashborad.accountNumberErr = null
            }
        }

        var complete_registration_pop_up = function(message, func) {
            $mdDialog.show({
                templateUrl: 'static/templates/alertPopUp.html',
                clickOutsideToClose: true,
                controller: 'alertPopUpCtrl',
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {
                    "Heading": "",
                    "Message": message,
                    'type': true,
                    "next_Step": "",
                    "current_Step": "",
                    callback: func,
                    scope : $scope
                }
            });
            $timeout(function() {
                $mdDialog.hide()
            }, 5000)
        }
        $scope.acconutVerification = function() {
            $scope.validateABN()
            $scope.validate_bank_name()
            $scope.validate_account_holder_name()
            $scope.validate_bank_routing_number()
            $scope.validate_account_number()
            if ($scope.dashborad.abnErr == null && $scope.dashborad.bnkNameErr == null && $scope.dashborad.accHolderNameErr == null && $scope.dashborad.accountNumberErr == null && $scope.dashborad.RoutingErr == null) {
                spinnerService.show("html5spinner");
                data = {
                    first_name: $scope.dashborad.contact_name,
                    business_address: {
                        city: $scope.dashborad.city,
                        line1: $scope.dashborad.address,
                        postal_code: $scope.dashborad.postal_code,
                        state: $scope.dashborad.state,
                        country: "AU"
                    },
                    external_account: {
                        object: "bank_account",
                        bank_name: $scope.dashborad.bnkName,
                        account_number: $scope.dashborad.accountNumber,
                        account_holder_name: $scope.dashborad.accHolderName,
                        routing_number: $scope.dashborad.RoutingName,
                        country: "AU",
                        currency: "aud",

                    },
                    business: localStorage.business_id,
                    business_abn: $scope.dashborad.abn,
                    business_name: $scope.dashborad.businessName,
                    business_email: $scope.dashborad.email,
                    transfer_schedule: {
                        monthly_anchor: 28,
                        interval: "monthly"
                    },
                }
                apiService.getData('a_step4/', data, 'post').then(function(success) {
                    // console.log("Success..." + JSON.stringify(success.data))
                    if (success.data.status == 500) {
                        $scope.dashborad.step4ApiErr = success.data.Message;
                    } else {
                        after_updating("step-4")
                        // complete_registration_pop_up()
                        $scope.custom_dailog("Bank Account Details Changed");
                    }
                    spinnerService.hide("html5spinner");
                }, function(error) {
                    spinnerService.hide("html5spinner");
                });
            }
        }




        // calendar Section
        $scope.events = [{
            title: '',
            start: new Date(0, 0, 0, 0, 0),
            end: new Date(0, 0, 0, 0, 0),
        }]
        $scope.eventSources = [$scope.events];
        $scope.SelectedEvent = null;
        $scope.uiConfig = {
            calendar: {
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                defaultDate: new Date(),
                defaultView: 'agendaWeek',
                height: 1200,
                editable: true,
                firstHour: 9,
                firstDay: 1,
                displayEventTime: false,
                eventStartEditable: true,
                slotDuration: "00:30:00",
                slotMinutes: 1,
                minTime: "05:00:00",
                maxTime: "24:00:00",
                timezone: 'local',
                columnFormat: 'ddd D/M',
                timeFormat: 'hh:mm a',
                selectable: false,
                selectHelper: true,
                eventLimit: true,
                allDay: true,
                eventClick: function(event) {
                    $scope.SelectedEvent = event;
                    if ($scope.SelectedEvent.type == 'block_time') {
                        $scope.update_block_time($scope.SelectedEvent)
                    } else if ($scope.SelectedEvent.type == 'new_appointment') {
                        $scope.update_new_Appointment($scope.SelectedEvent)
                    } else {
                        alert("This appointment has been booked through Avaana. To reschedule the appointment, email providers@avaana.com.au. Rescheduling fees may apply.")
                    }
                },
                dayClick: function(date, jsEvent, view) {
                    if ($scope.calendar_practitioner) {
                        $scope.new_Appointment('', $scope.dashborad.servicesArray, $scope.dashborad.PractitionerList, $scope.calendar_index, $scope.calendar_practitioner.id, date)
                    } else {
                        $scope.new_Appointment('', $scope.dashborad.servicesArray, $scope.dashborad.PractitionerList, "", "", date)
                    }

                },

                eventRender: function(event, element, view) {
                    if (event.customer_name) {
                        element.find(".fc-content").append("<div class='customer_name'>" + " " + event.customer_name + "</div>");
                    }
                    if (event.description) {
                        element.find(".fc-content").append("<div>" + event.description + "</div>");
                    }
                    if (event.ranges) {
                        return (event.ranges.filter(function(range) {
                            return (event.start.isBefore(range.end) && event.end.isAfter(range.start));
                        }).length) > 0;
                    }

                },
                eventResizeStop: function(event, jsEvent, ui, view) {
                    $scope.SelectedEvent = event;
                    if ($scope.SelectedEvent.type == 'block_time') {
                        $scope.noPromptUpdateBlockedTime($scope.SelectedEvent, view)
                    } else if ($scope.SelectedEvent.type == 'new_appointment') {
                        $scope.noPromptUpdateNewAppointmentTime($scope.SelectedEvent, view)
                    }
                },
                eventDrop: function(event, jsEvent, ui, view) {
                    $scope.SelectedEvent = event;
                    if ($scope.SelectedEvent.type == 'block_time') {
                        $scope.noPromptUpdateBlockedTime($scope.SelectedEvent, view)
                    } else if ($scope.SelectedEvent.type == 'new_appointment') {
                        $scope.noPromptUpdateNewAppointmentTime($scope.SelectedEvent, view)
                    }
                },
                select: function(start, end, jsEvent, view) {
                    if (end.diff(start) > 2000000) {
                        $scope.noPromptCreateBlockedTime(start, end)
                    }
                }
            }
        }




        $scope.uiConfig1 = {
            calendar: {
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                defaultDate: new Date(),
                defaultView: 'agendaWeek',
                height: 1200,
                editable: true,
                firstHour: 9,
                firstDay: 1,
                displayEventTime: false,
                eventStartEditable: true,
                slotDuration: "00:30:00",
                slotMinutes: 1,
                minTime: "05:00:00",
                maxTime: "24:00:00",
                timezone: 'local',
                columnFormat: 'ddd D/M',
                timeFormat: 'hh:mm a',
                selectable: true,
                selectHelper: true,
                eventLimit: true,
                allDay: true,
                eventClick: function(event) {
                    $scope.SelectedEvent = event;
                    if ($scope.SelectedEvent.type == 'block_time') {
                        $scope.update_block_time($scope.SelectedEvent)
                    } else if ($scope.SelectedEvent.type == 'new_appointment') {
                        $scope.update_new_Appointment($scope.SelectedEvent)
                    } else {
                        alert("This appointment has been booked through Avaana. To reschedule the appointment, email providers@avaana.com.au. Rescheduling fees may apply.")
                    }
                },
                dayClick: function(date, jsEvent, view) {
                    if ($scope.calendar_practitioner) {
                        $scope.new_Appointment('', $scope.dashborad.servicesArray, $scope.dashborad.PractitionerList, $scope.calendar_index, $scope.calendar_practitioner.id, date)
                    } else {
                        $scope.new_Appointment('', $scope.dashborad.servicesArray, $scope.dashborad.PractitionerList, "", "", date)
                    }

                },

                eventRender: function(event, element, view) {
                    if (event.customer_name) {
                        element.find(".fc-content").append("<div class='customer_name'>" + " " + event.customer_name + "</div>");
                    }
                    if (event.description) {
                        element.find(".fc-content").append("<div>" + event.description + "</div>");
                    }
                    if (event.ranges) {
                        return (event.ranges.filter(function(range) {
                            return (event.start.isBefore(range.end) && event.end.isAfter(range.start));
                        }).length) > 0;
                    }

                },
                eventResizeStop: function(event, jsEvent, ui, view) {
                    $scope.SelectedEvent = event;
                    if ($scope.SelectedEvent.type == 'block_time') {
                        $scope.noPromptUpdateBlockedTime($scope.SelectedEvent, view)
                    } else if ($scope.SelectedEvent.type == 'new_appointment') {
                        $scope.noPromptUpdateNewAppointmentTime($scope.SelectedEvent, view)
                    }
                },
                eventDrop: function(event, jsEvent, ui, view) {
                    $scope.SelectedEvent = event;
                    if ($scope.SelectedEvent.type == 'block_time') {
                        $scope.noPromptUpdateBlockedTime($scope.SelectedEvent, view)
                    } else if ($scope.SelectedEvent.type == 'new_appointment') {
                        $scope.noPromptUpdateNewAppointmentTime($scope.SelectedEvent, view)
                    }
                },
                select: function(start, end, jsEvent, view) {
                    if (end.diff(start) > 2000000) {
                        $scope.noPromptCreateBlockedTime(start, end)
                    }
                }
            }
        }
        $scope.selectedDate = function(selectedDate) {
            $('#calendar_' + localStorage.business_id).fullCalendar('gotoDate', selectedDate)
        }


        $scope.new_Appointment = function(ev, serviceArray, practitionerArray, calendar, prac_id, pre_populate) {
            $mdDialog.show({
                controller: 'new_AppointmentCtrl',
                templateUrl: 'static/templates/new_Appointment.html',
                locals: {
                    service: serviceArray,
                    practitioner: practitionerArray,
                    prac_id: prac_id,
                    events: $scope.events,
                    existing_events: $scope.businessResponse.business_details[key].business_non_avaana_user_appointments,
                    calendar: calendar !== '' ? "calendar_" + localStorage.business_id + "_" + calendar : "calendar_" + localStorage.business_id,
                    pre_populate_data: pre_populate ? pre_populate : ''
                },
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }


        $scope.update_new_Appointment = function(event) {
            $mdDialog.show({
                controller: 'update_new_appointmentCtrl',
                templateUrl: 'static/templates/update_new_appointment.html',
                locals: {
                    event: event,
                    events: $scope.events,
                    existing_events: $scope.businessResponse.business_details[key].business_non_avaana_user_appointments,
                    practitioner: $scope.dashborad.PractitionerList,
                    calendar: $scope.calendar_index !== '' ? "calendar_" + localStorage.business_id + "_" + $scope.calendar_index : "calendar_" + localStorage.business_id
                },
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }




        $scope.noPromptUpdateNewAppointmentTime = function(event) {
            spinnerService.show("html5spinner");
            apiService.getDataWithToken('a_calendar_appointment_detail/', {
                id: event.id,
                type: event.type
            }, 'post').then(function(success) {
                // console.log(JSON.stringify(success.data.appointment_details))
                var start_time_value;
                var end_time_value;
                var start = event.start._d;
                start_time_value = moment(start).format("hh:mm A").toString();
                var end = event.end._d;
                // console.log()
                end_time_value = moment(end).format("hh:mm A").toString();
                data = {
                        business: localStorage.business_id,
                        blocked_practitioner: event.prac_ID,
                        appointment_date: start,
                        appointment_start_time: start_time_value,
                        appointment_end_time: end_time_value,
                        id: event.id,
                        type: 'new_appointment',
                        customer_name: success.data.appointment_details.customer_name,
                        customer_email: success.data.appointment_details.customer_email,
                        customer_phone: success.data.appointment_details.customer_phone,
                        service_name: success.data.appointment_details.service_name,
                        service_id: success.data.appointment_details.service_id,
                        appointment_price: success.data.appointment_details.appointment_price,
                        comment: success.data.appointment_details.comment,

                    }
                    // console.log(JSON.stringify(data))
                apiService.getDataWithToken('a_update_calendar_appointment/', data, 'post').then(function(success) {
                    // console.log(JSON.stringify(success.data))
                    if (success.data.status == 200) {
                        console.log(JSON.stringify($scope.businessResponse.business_details[key].business_block_time))
                        angular.forEach($scope.businessResponse.business_details[key].business_non_avaana_user_appointments, function(obj, index) {
                            if (obj.id == success.data.new_Appointment_data.id) {
                                $scope.businessResponse.business_details[key].business_non_avaana_user_appointments.splice(index, 1);
                            }
                        });
                        $scope.businessResponse.business_details[key].business_non_avaana_user_appointments.push(success.data.new_Appointment_data)
                        angular.forEach($scope.dashborad.PractitionerList, function(obj, key) {
                            if (obj.id == success.data.new_Appointment_data.business_practitioner) {
                                $scope.update_new_business_appointment = obj.practitioner_new_appointments;
                                angular.forEach(obj.practitioner_new_appointments, function(value, key) {
                                    if (value.id == success.data.new_Appointment_data.id) {
                                        obj.practitioner_new_appointments.splice(key, 1);
                                    }
                                });
                            }
                        });
                        $scope.update_new_business_appointment.push(success.data.new_Appointment_data)
                        spinnerService.hide("html5spinner");
                    }
                });
            })

        }


        $scope.noPromptUpdateBlockedTime = function(event) {
            spinnerService.show("html5spinner");
            apiService.getDataWithToken('a_calendar_appointment_detail/', {
                id: event.id,
                type: event.type
            }, 'post').then(function(success) {
                var start_time_value;
                var end_time_value;
                var start = event.start._d;
                start_time_value = moment(start).format("hh:mm A").toString();
                var end = event.end._d;
                // console.log(end)
                end_time_value = moment(end).format("hh:mm A").toString();
                data = {
                        business: localStorage.business_id,
                        blocked_practitioner: event.prac_ID,
                        blocked_date: start,
                        blocked_start_time: start_time_value,
                        blocked_end_time: end_time_value,
                        id: event.id,
                        type: 'block_time'
                    }
                    // console.log(JSON.stringify(data))
                apiService.getDataWithToken('a_update_calendar_appointment/', data, 'post').then(function(success) {
                    // console.log(JSON.stringify(success.data))
                    if (success.data.status == 200) {
                        console.log(JSON.stringify($scope.businessResponse.business_details[key].business_block_time))
                        angular.forEach($scope.businessResponse.business_details[key].business_block_time, function(obj, index) {
                            if (obj.id == success.data.block_appointment.id) {
                                $scope.businessResponse.business_details[key].business_block_time.splice(index, 1);
                            }
                        });
                        $scope.businessResponse.business_details[key].business_block_time.push(success.data.block_appointment)
                        angular.forEach($scope.dashborad.PractitionerList, function(obj, key) {
                            if (obj.id == success.data.block_appointment.blocked_practitioner) {
                                $scope.practitioner_block_appointments = obj.practitioner_block_times;
                                angular.forEach(obj.practitioner_block_times, function(value, key) {
                                    if (value.id == success.data.block_appointment.id) {
                                        obj.practitioner_block_times.splice(key, 1);
                                    }
                                });
                            }
                        });
                        $scope.practitioner_block_appointments.push(success.data.block_appointment)
                        spinnerService.hide("html5spinner");
                    }
                });
            });
        }
        $scope.noPromptCreateBlockedTime = function(start, end) {
            spinnerService.show("html5spinner");
            $(this).data('event', {
                title: "Blocked Time"
            })
            var start_time_value;
            var end_time_value;
            var start_date;
            start_time_value = moment(start).format("hh:mm A").toString();
            end_time_value = moment(end).format("hh:mm A").toString();
            start_date = start;
            data = {
                business: $scope.business_id,
                blocked_practitioner: $scope.calendar_practitioner.id,
                blocked_date: start_date,
                blocked_start_time: start_time_value,
                blocked_end_time: end_time_value,
                comment: "Blocked Time",
                type: 'block_time',
            }
            apiService.getDataWithToken('a_block_time/', data, 'post').then(function(success) {
                // console.log(JSON.stringify(success.data))
                $('#calendar_' + localStorage.business_id + "_" + $scope.calendar_index).fullCalendar('removeEvents')
                $('#calendar_' + localStorage.business_id + "_" + $scope.calendar_index).fullCalendar('refetchEvents');
                var date = new Date(success.data.block_appointment.blocked_date);
                start_hours = apiService.convertHours_Minutes(success.data.block_appointment.blocked_start_time, "start_hours")
                start_min = apiService.convertHours_Minutes(success.data.block_appointment.blocked_start_time, "start_min")
                end_hours = apiService.convertHours_Minutes(success.data.block_appointment.blocked_end_time, "end_hours")
                end_min = apiService.convertHours_Minutes(success.data.block_appointment.blocked_end_time, "end_min")

                $scope.events.push({
                    title: success.data.block_appointment.comment,
                    practitioner_name: "",
                    start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                    end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                    color: '#E74C3C',
                    comment_icon: "comment-o",
                    practitioner_icon: "heartbeat",
                    type: "block_time",
                    prac_ID: success.data.block_appointment.blocked_practitioner,
                    id: success.data.block_appointment.id
                })
                $('#calendar_' + localStorage.business_id + "_" + $scope.calendar_index).fullCalendar('addEventSource', $scope.events);
                $('#calendar_' + localStorage.business_id + "_" + $scope.calendar_index).fullCalendar('refetchEvents');
                $scope.events = $scope.events;
                $scope.businessResponse.business_details[key].business_block_time.push(success.data.block_appointment)
                $scope.calendar_practitioner.practitioner_block_times.push(success.data.block_appointment)
                spinnerService.hide("html5spinner");
            });
        }

        $scope.update_block_time = function(event) {
            $mdDialog.show({
                controller: 'update_block_timeCtrl',
                templateUrl: 'static/templates/update_block_time.html',
                locals: {
                    event: event,
                    events: $scope.events,
                    existing_events: $scope.businessResponse.business_details[key].business_block_time,
                    practitioner: $scope.dashborad.PractitionerList,
                    calendar: $scope.calendar_index !== '' ? "calendar_" + localStorage.business_id + "_" + $scope.calendar_index : "calendar_" + localStorage.business_id
                },
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }


        $scope.block_Time = function(ev, practitionerArray, prac_id, calendar, start, end) {
            start_time = start;
            if (start != "") {

            }
            $mdDialog.show({
                templateUrl: 'static/templates/block_time.html',
                controller: 'block_timeCtrl',
                locals: {
                    practitioner: practitionerArray,
                    prac_id: prac_id,
                    events: $scope.events,
                    existing_events: $scope.businessResponse.business_details[key].business_block_time,
                    calendar: calendar !== '' ? "calendar_" + localStorage.business_id + "_" + calendar : "calendar_" + localStorage.business_id
                },
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }

        $scope.showAdvanced = function(ev, location) {
            $scope.location = location
            $scope.photoModel = $uibModal.open({
                templateUrl: 'static/templates/Auto_map.html',
                controller: 'mapCtrl',
                scope: $scope
            });
        };


        $scope.readWelcomePack = function(event) {
            $mdDialog.show({
                templateUrl: 'static/templates/welcome_pack.html',
                clickOutsideToClose: true,
                // controller: '',
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {
                    "Message": "Here are some guidelines and ground rules to help you get going :)",
                    'type': 'welcome',
                    "next_Step": "",
                    "current_Step": "",
                }
            });
        }
        $scope.terms = function() {
            $mdDialog.show({
                templateUrl: 'static/templates/terms.html',
                clickOutsideToClose: true,
                // controller: 'alertPopUpCtrl',
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {
                    "Message": "avaana terms and conditions",
                    'type': 'welcome',
                    "next_Step": "",
                    "current_Step": "",
                }
            });

        }
        $scope.guidelines = function() {
            $mdDialog.show({
                templateUrl: 'static/templates/guidelines.html',
                clickOutsideToClose: true,
                // controller: 'alertPopUpCtrl',
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {
                    "Message": "avaana community guidelines",
                    'type': 'welcome',
                    "next_Step": "",
                    "current_Step": "",
                }
            });

        }
        $scope.providerterms = function() {
            $mdDialog.show({
                templateUrl: 'static/templates/providerterms.html',
                clickOutsideToClose: true,
                // controller: 'alertPopUpCtrl',
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {
                    "Message": "avaana community guidelines",
                    'type': 'welcome',
                    "next_Step": "",
                    "current_Step": "",
                }
            });
        }


        function autocompleteMethod(id) {
            var autocomplete;
            var componentForm = {
                locality: 'long_name', //Equals to City
                administrative_area_level_1: 'long_name', //Equals to State
                postal_code: 'short_name'
            };
            autocomplete = new google.maps.places.Autocomplete((document.getElementById(id)), {
                types: ['geocode']
            });
            autocomplete.addListener('place_changed', fillInAddress);
            var geolocation = {
                lat: 25.2744,
                lng: 133.7751
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: 2
            });
            autocomplete.setBounds(circle.getBounds());

            function fillInAddress() {
                var place = autocomplete.getPlace();
                for (var component in componentForm) {
                    $scope.dashborad.address = ''
                    $scope.dashborad.state = ''
                    $scope.dashborad.postal_code = ''
                    $scope.dashborad.city = ''
                }
                $scope.dashborad.address = place['name']
                for (var i = 0; i < place.address_components.length; i++) {
                    var addressType = place.address_components[i].types[0];
                    if (componentForm[addressType]) {
                        if (addressType == "administrative_area_level_1") {
                            console.log("allStateList",allStateList)
                            if(!allStateList.includes(place.address_components[i][componentForm[addressType]])){
                                $scope.dashborad.State.push({
                                    'state': place.address_components[i][componentForm[addressType]]
                                })
                                allStateList.push(place.address_components[i][componentForm[addressType]])
                            }
                            $scope.dashborad.state = place.address_components[i][componentForm[addressType]];
                        } else if (addressType == "postal_code") {
                            $scope.dashborad.postal_code = place.address_components[i][componentForm[addressType]]
                        } else if (addressType == "locality") {
                            $scope.dashborad.city = place.address_components[i][componentForm[addressType]]
                        }
                    }
                    document.getElementById("locality").focus()
                    $timeout(function() {
                        document.getElementById(id).blur();
                    }, 200)
                }
            }
        }
    })
