angular.module("avaanaController")

.controller("loginCtrl", function(spinnerService, $scope, $window, $state, $http, authService, $timeout, $stateParams, apiService, $mdDialog, $rootScope, page) {
    $scope.obj = {};
    $scope.landingPage = false;
    $scope.loginPage = false;
    $scope.registerPage = false;
    $scope.forgotPage = false;
    $scope.page = page
    if ($scope.page == "login") {
        $scope.loginPage = true;
        reminderValue = localStorage.getItem('reminderData')
        // console.log(reminderValue)
        // console.log(typeof(reminderValue))
        if (reminderValue != null) {
            remin = JSON.parse(reminderValue)
            $scope.obj.email = remin.email;
            $scope.obj.password = remin.password;
        }
    } else if ($scope.page == "signup") {
        $scope.registerPage = true;
    } else if ($scope.page == "forgot") {
        $scope.forgotPage = true;
    } else {
        $scope.landingPage = true;
    }
    $scope.obj.loginClick = function() {
        $mdDialog.hide()
        $mdDialog.show({
            templateUrl: 'static/templates/newlogin.html',
            controller: 'loginCtrl',
            locals: {
                page: "login"
            },
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    }
    $scope.obj.signUpClick = function() {
        $mdDialog.hide()
        $mdDialog.show({
            templateUrl: 'static/templates/newlogin.html',
            controller: 'loginCtrl',
            locals: {
                page: "signup"
            },
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    }

    //***************Forgot Password ***********************

    $scope.obj.forgotClick = function() {
        $mdDialog.hide()
        $mdDialog.show({
            templateUrl: 'static/templates/newlogin.html',
            controller: 'loginCtrl',
            locals: {
                page: "forgot"
            },
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    }


    $scope.obj.forgotEventChange = function() {
        $scope.obj.failureErr = null
        if ($scope.obj.forgotEmail == null || $scope.obj.forgotEmail == undefined || $scope.obj.forgotEmail == '') {
            $scope.obj.forgotEmailErr = "Please enter Email to send forgot Password link";
        } else if (!emailRegex.test($scope.obj.forgotEmail)) {
            $scope.obj.forgotEmailErr = "Please enter valid Email to send forgot Password link";
        } else {
            $scope.obj.forgotEmailErr = null
        }

    }

    $scope.obj.forgotBtnClick = function() {
        $scope.obj.forgotEventChange()
        if ($scope.obj.forgotEmailErr == null) {
            spinnerService.show("html5spinner");
            data = {
                email: $scope.obj.forgotEmail
            }
            apiService.getData('a_forgot_password/', data, 'post').then(function(success) {
                if (success.data.status == 200) {
                    spinnerService.hide("html5spinner");
                    $scope.not_send = false;
                    $scope.notification = true;
                    $scope.forgotLinkSend = true
                } else if (success.data.status != 200) {
                    spinnerService.hide("html5spinner");
                    $scope.obj.failureErr = success.data.Message;
                }
            }, function(error) {
                spinnerService.hide("html5spinner");
                console.log('Error::::' + JSON.stringify(error));
            });
        }
        // }


    }

    //***************Forgot Password End***********************
    //*****************Register Section*************************
    // var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w)$/
    var emailRegex = (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/);
    var phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/
    var nameRegex = /^[a-zA-Z ]{2,32}$/
        //*********************Form VAlidation Start *************************//
    $scope.obj.firstNameValidation = function() {
        if ($scope.obj.first_name == "" || $scope.obj.first_name == undefined || $scope.obj.first_name == null) {
            $scope.obj.firstnameErr = "Please enter your first name";
        } else if (!nameRegex.test($scope.obj.first_name))
            $scope.obj.firstnameErr = "Please enter a valid first name. A name should not contain special characters or numbers and is between 2-32 characters."
        else {
            $scope.obj.firstnameErr = null;
        }
    }
    $scope.obj.lastNameValidation = function() {
        if ($scope.obj.last_name == "" || $scope.obj.last_name == undefined || $scope.obj.last_name == null) {
            $scope.obj.lastnameErr = "Please enter your last name";
        } else if (!nameRegex.test($scope.obj.last_name))
            $scope.obj.lastnameErr = "Please enter a valid last name. A name should not contain special characters or numbers and is between 2-32 characters."
        else {
            $scope.obj.lastnameErr = null;
        }

    }

    $scope.obj.emailValidation = function() {
        if ($scope.obj.signupEmail == "" || $scope.obj.signupEmail == undefined || $scope.obj.signupEmail == null) {
            $scope.obj.signupEmailErr = "Please enter your email address";
        } else if (!emailRegex.test($scope.obj.signupEmail)) {
            $scope.obj.signupEmailErr = "Please enter valid email address";
        } else if ($scope.obj.signupEmail.length > 150) {
            $scope.obj.signupEmailErr = "Please enter a shorter email, if one is available.  If not, please email hello@avaana.com.au for assistance.";
        } else {
            $scope.obj.signupEmailErr = null;
        }

    }
    $scope.obj.passwordValidation = function() {
        if ($scope.obj.signupPassword == "" || $scope.obj.signupPassword == undefined || $scope.obj.signupPassword == null) {
            $scope.obj.signupPasswordErr = "Please enter a password";
        } else if ($scope.obj.signupPassword.length > 50 || $scope.obj.signupPassword.length < 7) {
            $scope.obj.signupPasswordErr = "Please enter a password between 8 and 24 characters.";
        } else {
            $scope.obj.signupPasswordErr = null;
        }

    }
    $scope.obj.phoneValidation = function() {
        if ($scope.obj.phone == "" || $scope.obj.phone == undefined || $scope.obj.phone == null) {
            $scope.obj.phoneErr = "Please enter mobile Number";
        } else if (!phoneRegex.test($scope.obj.phone)) {
            $scope.obj.phoneErr = "Please use numbers only; no dashes or spaces.";
        } else {
            $scope.obj.phoneErr = null;
        }

    }

    //**Validate button Listener ********
    $scope.obj.signup = function() {
        $scope.obj.firstNameValidation()
        $scope.obj.lastNameValidation()
        $scope.obj.emailValidation()
        $scope.obj.passwordValidation()
            // $scope.obj.phoneValidation()
        if ($scope.obj.signupEmailErr == null && $scope.obj.signupPasswordErr == null && $scope.obj.firstnameErr == null && $scope.obj.lastnameErr == null) {
            spinnerService.show("html5spinner");
            data = {
                first_name: $scope.obj.first_name,
                last_name: $scope.obj.last_name,
                email: $scope.obj.signupEmail,
                password: $scope.obj.signupPassword,
                phone_no: $scope.obj.phone,
                provider: localStorage.loginType,
                u_id: $scope.obj.u_id,
                avatar: $scope.myImage,
                is_customer: true,
                is_owner: false,
                is_practitioner: false,
                is_active: true
            }
            apiService.getData('a_signup/', data, 'post').then(function(success) {
                if (success.data.status == 200) {
                    spinnerService.hide("html5spinner");
                    localStorage.userId = success.data.User_Detail.id;
                    localStorage.auth_token = success.data.auth_token;
                    localStorage.setItem('UserObject', JSON.stringify(success.data.User_Detail));
                    $rootScope.$broadcast('loggedIn');
                    $mdDialog.hide()
                    $scope.obj.signupEmailErr = null;
                } else if (success.data.status == 500) {
                    spinnerService.hide("html5spinner");
                    error_key = Object.keys(success.data.Message);
                    if (error_key[0] === 'email') {
                        $scope.obj.signupEmailErr = "Email address already exists.  Did you mean to log in instead?";
                    } else if (error_key[0] === 'password') {
                        $scope.obj.signupPasswordErr = "Password is too short.";
                    } else {
                        $scope.obj.phoneErr = success.data.Error;
                    }
                }
            }, function(error) {
                spinnerService.hide("html5spinner");
            });
        }
    }

    //*******************************End register Section*************************
    var authWindow;
    var googleapi = {
        authorize: function(options) {
            //Build the OAuth consent page URL
            var authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + $.param({
                client_id: options.client_id,
                redirect_uri: options.redirect_uri,
                response_type: 'token',
                scope: options.scope,
                // nonce:"DgkRrHXmyu3KLd0KDdfq"
            });
            window.location.href = authUrl;
        }
    }

    $scope.obj.login = function() {
        if ($scope.obj.email == "" || $scope.obj.email == undefined || $scope.obj.email == null) {
            $scope.obj.emailErr = "Please enter a valid email.";
        } else if (!emailRegex.test($scope.obj.email)) {
            $scope.obj.emailErr = "Please enter a valid email.";
        } else {
            $scope.obj.emailErr = null;
        }
        if ($scope.obj.password == "" || $scope.obj.password == undefined || $scope.obj.password == null) {
            $scope.obj.passwordErr = "Please enter a password.";
        } else {
            $scope.obj.passwordErr = null;
        }
        if ($scope.obj.emailErr == null && $scope.obj.passwordErr == null) {
            localStorage.loginType = "normal";
            spinnerService.show("html5spinner");

            data = {
                email: $scope.obj.email,
                password: $scope.obj.password
            }
            apiService.getData('a_login/', data, 'post').then(function(success) {

                if (success.data.status != 500) {
                    spinnerService.hide("html5spinner");
                    if ($scope.obj.remember == true) {
                        localStorage.setItem('reminderData', JSON.stringify(data));
                    } else {
                        localStorage.setItem('reminderData', JSON.stringify({
                            email: "",
                            password: ""
                        }));
                    }
                    localStorage.userId = success.data.user.id
                    localStorage.auth_token = success.data.auth_token
                    localStorage.setItem('UserObject', JSON.stringify(success.data.user));
                    $rootScope.$broadcast('loggedIn');
                    if ($stateParams.from == 'booking') {
                        $state.go('app.payment', {
                            key: $stateParams.key,
                            slug: $stateParams.slug,
                            appoint_slug: $stateParams.appoint_slug
                        })
                    } else {
                        $mdDialog.hide()
                    }

                    $scope.obj.loginErr = null;
                } else {
                    spinnerService.hide("html5spinner");
                    $timeout($scope.obj.failureErr = "Incorrect email or password.", 500);
                }
            }, function(error) {
                spinnerService.hide("html5spinner");
                $scope.obj.failureErr = "Oops, something went wrong: " + error.status;
            });
        }
    }
    $scope.obj.loginEmailValidate = function() {
        if ($scope.obj.email == "" || $scope.obj.email == undefined || $scope.obj.email == null) {
            $scope.obj.emailErr = "Please enter a valid email.";
        } else if (!emailRegex.test($scope.obj.email)) {
            $scope.obj.emailErr = "Please enter a valid email.";
        } else {
            $scope.obj.emailErr = null;
        }
    }

    $scope.obj.loginPasswordValidate = function() {
        if ($scope.obj.password == "" || $scope.obj.password == undefined || $scope.obj.password == null) {
            $scope.obj.passwordErr = "Please enter a password.";
        } else {
            $scope.obj.passwordErr = null;
        }
    }
    $scope.obj.closeClick = function() {
        $mdDialog.hide()
    }
    $scope.obj.googlePlusLogin = function() {
        localStorage.setItem('loginType', "google");

    }
    $scope.terms = function() {
        $mdDialog.show({
            templateUrl: 'static/templates/terms.html',
            clickOutsideToClose: true,
            controller: 'alertPopUpCtrl',
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
            controller: 'alertPopUpCtrl',
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
            locals: {
                "Message": "avaana community guidelines",
                'type': 'welcome',
                "next_Step": "",
                "current_Step": "",
            }
        });

    }

    //  var facebookapi = {
    //     authorize: function(options) {
    //         //Build the OAuth consent page URL
    //         var authUrl = 'https://www.facebook.com/dialog/oauth?' + $.param({
    //             client_id: options.client_id,
    //             redirect_uri: options.redirect_uri,
    //             response_type: 'token',
    //             scope: options.scope,
    //             // nonce:"DgkRrHXmyu3KLd0KDdfq"
    //         });

    //         window.location.href = authUrl;
    //     }
    // }

    // $scope.obj.facebookLogin = function() {
    //     localStorage.setItem('loginType',"facebook");
    //     facebookapi.authorize({
    //         client_id: '122732284980432',
    //         redirect_uri: 'http://avaana.com.au/',
    //         scope: 'public_profile email',
    //     })
    // }



    $scope.obj.facebookLogin = function() {
        localStorage.setItem('loginType', "facebook");
        FB.login(function(response) {
            if (response.authResponse) {
                console.log('Auth ' + JSON.stringify(response));
                FB.api('/me?fields=id,name,email,picture.type(large),first_name,last_name', function(response) {
                    console.log("facebook--->>>>" + JSON.stringify(response));
                    var data = {
                        email: response.email ? response.email : response.id + "@facebook.com",
                        first_name: response.first_name,
                        last_name: response.last_name,
                        avatar: response.picture.data.url,
                        u_id: response.id,
                        provider: localStorage.getItem('loginType')
                    }

                    console.log("reqdata-->>" + JSON.stringify(data))
                    apiService.getData('a_login_social_auth/', data, 'post').then(function(success) {
                            if (success.data.status != 500) {
                                localStorage.userId = success.data.user.id
                                localStorage.auth_token = success.data.auth_token
                                localStorage.setItem('UserObject', JSON.stringify(success.data.user));
                                $rootScope.$broadcast('loggedIn');
                                if ($stateParams.from == 'booking') {
                                    $state.go('app.payment', {
                                        key: $stateParams.key,
                                        slug: $stateParams.slug,
                                        appoint_slug: $stateParams.appoint_slug
                                    })
                                } else {
                                    $mdDialog.hide()
                                }

                                $scope.obj.loginErr = null;
                            } else {
                                $timeout($scope.obj.failureErr = "Incorrect email or password.", 500);
                            }
                        }, function(errObj) {
                            alert(JSON.stringify(errObj))
                        })
                        // $uibModalInstance.dismiss('cancel');
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        });
    }

})