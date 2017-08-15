angular.module("squaredSDController").controller("loginCtrl", function($scope, $state, $mdDialog, page, apiService,$rootScope) {
    $scope.obj = {};
    $scope.landingPage = false;
    $scope.loginPage = false;
    $scope.registerPage = false;
    $scope.forgotPage = false;
    $scope.page = page
    if ($scope.page == "login") {
        $scope.loginPage = true;
        reminderValue = localStorage.getItem('reminderData')
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

                    $scope.not_send = false;
                    $scope.notification = true;
                    $scope.forgotLinkSend = true
                } else if (success.data.status != 200) {

                    $scope.obj.failureErr = success.data.Message;
                }
            }, function(error) {
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
    $scope.obj.fullNameValidation = function() {
        if ($scope.obj.full_name == "" || $scope.obj.full_name == undefined || $scope.obj.full_name == null) {
            $scope.obj.fullnameErr = "Please enter your first name";
        } else if (!nameRegex.test($scope.obj.full_name))
            $scope.obj.fullnameErr = "Please enter a valid Full name. A name should not contain special characters or numbers and is between 2-32 characters."
        else {
            $scope.obj.fullnameErr = null;
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
    

    //**Validate button Listener ********
    $scope.obj.signup = function() {
        $scope.obj.fullNameValidation()
        $scope.obj.emailValidation()
        $scope.obj.passwordValidation()
        if ($scope.obj.signupEmailErr == null && $scope.obj.signupPasswordErr == null && $scope.obj.fullnameErr == null) {
            data = {
                full_name: $scope.obj.full_name,
                email: $scope.obj.signupEmail,
                password: $scope.obj.signupPassword,
                is_active: true
            }
            console.log(JSON.stringify(data))
            apiService.getData('signup', data, 'post').then(function(success) {
                // console.log(JSON.stringify(success))
                if (success.status == 201) {
                    localStorage.auth_token = success.data.token;
                    localStorage.setItem('UserObject', JSON.stringify(success.data.userData));
                    $rootScope.$broadcast('loggedIn');
                    $mdDialog.hide()
                    $scope.obj.signupEmailErr = null;
                } else if (success.data.status != 201) {
                    
                }
            }, function(error) {
                error_key = Object.keys(error.data);
                    if (error_key[0] === 'email') {
                        $scope.obj.signupEmailErr = "Email address already exists.";
                    } else if (error_key[0] === 'password') {
                        $scope.obj.signupPasswordErr = "Password is too short.";
                    } else {
                        $scope.obj.phoneErr = success.data.Error;
                    }
            });
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
            data = {
                email: $scope.obj.email,
                password: $scope.obj.password
            }
            apiService.getData('login', data, 'post').then(function(success) {
                if (success.status == 200) {
                    // console.log(JSON.stringify(success))
                    localStorage.auth_token = success.data.token;
                    localStorage.setItem('UserObject', JSON.stringify(success.data.userData));
                    $rootScope.$broadcast('loggedIn');
                    $mdDialog.hide()
                    $scope.obj.loginErr = null;
                }
            }, function(error) {
                // console.log(JSON.stringify(error))
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
    
})