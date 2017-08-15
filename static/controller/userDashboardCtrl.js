angular.module("avaanaController").controller("userDashboardCtrl", function(spinnerService, apiService, $scope, $window, uiCalendarConfig, $uibModal, $mdDialog, $rootScope, $sce) {
    $scope.profile = {}
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/
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
    $scope.appointmentStep = "Edit";
    $scope.profileStep = "Edit";
    $scope.OpenMethod = function(obj) {
            if (obj == 1) {
                if ($scope.appointmentStep == "Edit") {
                    $scope.appointmentStep = 'Close'
                    return
                }
                $scope.appointmentStep = 'Edit'
            } else if (obj == 2) {
                if ($scope.profileStep == "Edit") {
                    $scope.profileStep = 'Close'
                    return
                }
                $scope.profileStep = 'Edit'
            }
        }
        // User Appointment
    apiService.getDataWithToken('a_user_apointments/', {}, 'get').then(function(success) {
        if (success.data.status == 200) {
            $scope.profile.appointment = success.data.Appointments
            $scope.userProfileData = success.data.user_Detail;
            $scope.profile.practitionerAppointments = success.data.practitioner_Appointments;
            user_data();
        } else if (success.data.status == 500) {}
    }, function(error) {});
    var user_data = function() {
            $scope.convertImgToDataURLviaCanvas($scope.userProfileData.correct_image, function(base64Img) {
                $scope.profile.logo_image = base64Img;
                $scope.$apply()
            });
            $scope.profile.first_name = $scope.userProfileData.first_name
            $scope.profile.last_name = $scope.userProfileData.last_name == '.' ? '' : $scope.userProfileData.last_name
            $scope.profile.email = $scope.userProfileData.email
            $scope.profile.phone_no = $scope.userProfileData.phone_no


            $('#calendar').fullCalendar('removeEvents')
            $('#calendar').fullCalendar('refetchEvents');

            $scope.events = []
            for (i = 0; i < $scope.profile.practitionerAppointments.length; i++) {
                var date = new Date($scope.dashborad.practitionerAppointments[i].appointment_date);
                start_hours = convertHours_Minutes($scope.dashborad.practitionerAppointments[i].appointment_start_time, "start_hours")
                start_min = convertHours_Minutes($scope.dashborad.practitionerAppointments[i].appointment_start_time, "start_min")
                end_hours = convertHours_Minutes($scope.dashborad.practitionerAppointments[i].appointment_end_time, "end_hours")
                end_min = convertHours_Minutes($scope.dashborad.practitionerAppointments[i].appointment_end_time, "end_min")
                $scope.events.push({
                    title: $scope.dashborad.practitionerAppointments[i].service_name,
                    start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), start_hours, start_min),
                    end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), end_hours, end_min),
                    color: '#00bd71',
                })
            }
            $('#calendar').fullCalendar('addEventSource', $scope.events);
            $('#calendar').fullCalendar('refetchEvents');
            $scope.events = $scope.events;
        }
        // Validation of Profile Update Section
    $scope.validateFirstName = function() {
        if ($scope.profile.first_name == "" || $scope.profile.first_name == undefined || $scope.profile.first_name == null) {
            $scope.profile.FirstNameErr = "Please enter your first name.";
        } else {
            $scope.profile.FirstNameErr = null
        }
    }
    $scope.validateLastName = function() {
        if ($scope.profile.last_name == "" || $scope.profile.last_name == undefined || $scope.profile.last_name == null) {
            $scope.profile.LastNameErr = "Please enter your last name.";
        } else {
            $scope.profile.LastNameErr = null
        }
    }
    $scope.validateEmail = function() {
        if ($scope.profile.email == "" || $scope.profile.email == undefined || $scope.profile.email == null) {
            $scope.profile.EmailErr = "Please enter a valid email.";
        } else if (!emailRegex.test($scope.profile.email)) {
            $scope.profile.EmailErr = "Please enter a valid email.";
        } else {
            $scope.profile.EmailErr = null;
        }
    }
    $scope.validatephone = function() {
            if ($scope.profile.phone_no == "" || $scope.profile.phone_no == undefined || $scope.profile.phone_no == null) {
                $scope.profile.phone_noErr = "Please enter your phone number.";
            } else if (!phoneRegex.test($scope.profile.phone_no)) {
                $scope.profile.phone_noErr = "Please enter a valid phone number.";
            } else {
                $scope.profile.phone_noErr = null;
            }
        }
        // Profile Update Button Click Listener
    $scope.UpdateProfile = function() {
            $scope.validateFirstName();
            $scope.validateLastName();
            $scope.validateEmail();
            $scope.validatephone();
            if ($scope.profile.FirstNameErr == null && $scope.profile.LastNameErr == null && $scope.profile.EmailErr == null && $scope.profile.phone_noErr == null) {
                spinnerService.show("html5spinner");
                data = {
                    avatar: $scope.profile.logo_image != undefined ? $scope.profile.logo_image : '',
                    first_name: $scope.profile.first_name,
                    last_name: $scope.profile.last_name,
                    email: $scope.profile.email,
                    phone_no: $scope.profile.phone_no,
                }
                apiService.getDataWithToken('a_update_profile/', data, 'post').then(function(success) {
                    if (success.data.status == 200) {
                        spinnerService.hide("html5spinner");
                        localStorage.UserObject = JSON.stringify(success.data.User_Detail);
                        $scope.$emit("loggedIn");
                    } else if (success.data.status == 500) {
                        spinnerService.hide("html5spinner");
                    }
                }, function(error) {
                    spinnerService.hide("html5spinner");
                });
            }
        }
        /******************************* Contact Details end  ******************************************************/
    $scope.openPhotoModal = function(type) {
        $scope.photoModel = $uibModal.open({
            templateUrl: 'static/templates/photoModal.html',
            controller: 'photo_Ctrl',
            scope: $scope
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
                        // alert("$scope.myImage "+JSON.stringify($scope.myImage));
                    });
                };
                reader.readAsDataURL(file);
            };
            angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
        }, function(error) {})
    }
    $scope.$on("logoChoosen", function(evt, data) {
            $scope.profile.logo_image = data.img;
        })
        // Change Passwrod Section
    $scope.validateCurrentpassword = function() {
        if ($scope.profile.current_password == "" || $scope.profile.current_password == undefined || $scope.profile.current_password == null) {
            $scope.profile.current_passwordErr = "Please enter your current password.";
        } else {
            $scope.profile.current_passwordErr = null
        }
    }
    $scope.validateNewPassword = function() {
        if ($scope.profile.new_password == "" || $scope.profile.new_password == undefined || $scope.profile.new_password == null) {
            $scope.profile.new_passwordErr = "Please enter your new password.";
        } else {
            $scope.profile.new_passwordErr = null
        }
    }
    $scope.validateConfirmPassword = function() {
        if ($scope.profile.confirm_password == "" || $scope.profile.confirm_password == undefined || $scope.profile.confirm_password == null) {
            $scope.profile.confirm_passwordErr = "Please re-enter your new password.";
        } else if ($scope.profile.confirm_password != $scope.profile.new_password) {
            $scope.profile.confirm_passwordErr = "Passwords do not match.";
        } else {
            $scope.profile.confirm_passwordErr = null
        }
    }
    $scope.UpdatePassword = function() {
        $scope.validateCurrentpassword();
        $scope.validateNewPassword();
        $scope.validateConfirmPassword();
        if ($scope.profile.current_passwordErr == null && $scope.profile.new_passwordErr == null && $scope.profile.confirm_passwordErr == null) {
            spinnerService.show("html5spinner");
            data = {
                current_password: $scope.profile.current_password,
                new_password: $scope.profile.new_password,
                confirm_password: $scope.profile.confirm_password
            }
            apiService.getDataWithToken('a_change_password/', data, 'post').then(function(success) {
                if (success.data.status == 200) {
                    spinnerService.hide("html5spinner");
                    $scope.profile.apiError = success.data.Message
                    $scope.profile.current_password = '';
                    $scope.profile.new_password = '';
                    $scope.profile.confirm_password = '';
                } else if (success.data.status == 500) {
                    spinnerService.hide("html5spinner");
                    $scope.profile.apiError = success.data.Message
                }
            }, function(error) {
                spinnerService.hide("html5spinner");
            });
        }
    }
    $scope.showAdvanced = function(ev, location) {
        $scope.location = location
        $scope.photoModel = $uibModal.open({
            templateUrl: 'static/templates/Auto_map.html',
            controller: 'mapCtrl',
            scope: $scope
        });
    };
    $scope.showRating = function(ev, appointment) {
        $mdDialog.show({
            controller: "ratingCtrl",
            templateUrl: 'static/templates/rating.html',
            clickOutsideToClose: true,
            locals: {
                appointment: appointment
            },
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    };


    $scope.events = [{
        title: '',
        start: new Date(0, 0, 0, 0, 0),
        end: new Date(0, 0, 0, 0, 0),
    }]
    $scope.eventSources = [$scope.events];
    $scope.SelectedEvent = null;
    $scope.uiConfig = {
        calendar: {
            defaultDate: new Date(),
            defaultView: 'agendaWeek',
            height: 1200,
            editable: true,
            firstHour: 9,
            firstDay: 1,
            displayEventTime: false,
            eventStartEditable: false,
            slotDuration: "00:15:00",
            minTime: "09:00:00",
            maxTime: "24:00:00",
            timezone: 'local',
            selectable: true,
            selectHelper: true,
            editable: true,
            eventLimit: true,
            allDay: true,

            eventClick: function(event) {
                $scope.SelectedEvent = event;
            }
        }
    }
    $scope.selectedDate = function(selectedDate) {
        $('#calendar').fullCalendar('gotoDate', selectedDate)
    }
})