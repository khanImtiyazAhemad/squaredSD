angular.module("avaanaController").controller("paymentCtrl", function(spinnerService, $scope, apiService, $state, $stateParams, $mdDialog) {
    $scope.payment = {};
    $scope.more='Show more'
    $scope.promo_button = true
    $scope.promo_value = ''
    data = {
        lat: localStorage.lat,
        lng: localStorage.lng,
    }
    $scope.$watch('app.isLogin', function() {
        console.log($scope.app.isLogin)
        if ($scope.app.isLogin) {
            user_detail_data = localStorage.getItem('UserObject')
            if (user_detail_data != null) {
                user_detail = JSON.parse(user_detail_data)
                $scope.payment.firstName = user_detail.first_name;
                $scope.payment.lastName = user_detail.last_name;
                $scope.payment.email = user_detail.email;
                $scope.payment.phone = user_detail.phone_no;
            }
        }
    });
    
    apiService.getData('a_get_indiviual_business_offer/' + $stateParams.key + "/", data, 'post').then(function(res) {
        $scope.payment_details = res.data.Offers_Data
        $scope.payment_details.price = $scope.payment_details.discount == 0 ? $scope.payment_details.price : $scope.payment_details.discount
        $scope.payment_details.actual_price = $scope.payment_details.discount == 0 ? $scope.payment_details.price : $scope.payment_details.discount
    })
    event = localStorage.getItem('event_detail')
    if (event != null) {
        $scope.event_detals = JSON.parse(event)
    } else {
        $scope.event_detals = ''
    }

    // var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var emailRegex = (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/);
    var phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/

    $scope.payment.signUpClick = function() {
        $mdDialog.show({
            templateUrl: 'static/templates/newlogin.html',
            controller: 'loginCtrl',
            locals: {
                page: "signup"
            },
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    }
    $scope.payment.loginClick = function() {
        $mdDialog.show({
            templateUrl: 'static/templates/newlogin.html',
            controller: 'loginCtrl',
            locals: {
                page: "login"
            },
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    }
    $scope.payment.validateFirstName = function() {
        if ($scope.payment.firstName == "" || $scope.payment.firstName == undefined || $scope.payment.firstName == null) {
            $scope.payment.firstNameErr = "Please enter your first name.";
        } else {
            $scope.payment.firstNameErr = null;
        }
    }
    $scope.payment.validateLastName = function() {
        if ($scope.payment.lastName == "" || $scope.payment.lastName == undefined || $scope.payment.lastName == null) {
            $scope.payment.lastNameErr = "Please enter your last name.";
        } else {
            $scope.payment.lastNameErr = null;
        }
    }
    $scope.payment.validateEmail = function() {
        if ($scope.payment.email == "" || $scope.payment.email == undefined || $scope.payment.email == null) {
            $scope.payment.emailErr = "Please enter your email address";
        } else if (!emailRegex.test($scope.payment.email)) {
            $scope.payment.emailErr = "Please enter a valid email address."
        } else {
            $scope.payment.emailErr = null;
        }
    }
    $scope.payment.validPhone = function() {
        if ($scope.payment.phone == "" || $scope.payment.phone == undefined || $scope.payment.phone == null) {
            $scope.payment.phoneErr = "Please enter your mobile number.";
        } else if (!phoneRegex.test($scope.payment.phone)) {
            $scope.payment.phoneErr = "Please use numbers only; no dashes or spaces."
        } else {
            $scope.payment.phoneErr = null;
        }
    }
    $scope.payment.validCardSelect = function() {
        if ($scope.payment.cardSelect == "" || $scope.payment.cardSelect == undefined || $scope.payment.cardSelect == null) {
            $scope.payment.cardSelectErr = "Please select a payment type.";
        } else {
            $scope.payment.cardSelectErr = null;
        }
    }
    $scope.payment.validCardType = function() {
        if ($scope.payment.cardType == "" || $scope.payment.cardType == undefined || $scope.payment.cardType == null) {
            $scope.payment.cardTypeErr = "Please select a card type.";
        } else {
            $scope.payment.cardTypeErr = null;
        }
    }
    $scope.payment.validCardNo = function() {
        if ($scope.payment.cardno == "" || $scope.payment.cardno == undefined || $scope.payment.cardno == null) {
            $scope.payment.cardnoErr = "Please enter a credit card number.";
        }
        else {
            $scope.payment.cardnoErr = null;
        }
    }
    $scope.payment.validateSequirityCode = function() {
        if ($scope.payment.sequirityCode == "" || $scope.payment.sequirityCode == undefined || $scope.payment.sequirityCode == null) {
            $scope.payment.sequirityCodeErr = "Please enter the credit card's security/CVV number.";
        }
        else {
            $scope.payment.sequirityCodeErr = null;
        }
    }
    $scope.payment.validateCardHolder = function() {
        if ($scope.payment.cardHolder == "" || $scope.payment.cardHolder == undefined || $scope.payment.cardHolder == null) {
            $scope.payment.cardHolderErr = "Please enter the cardholder's name.";
        } else {
            $scope.payment.cardHolderErr = null;
        }
    }
    $scope.payment.validateExpiryDate = function() {
        if ($scope.payment.expiryDate == "" || $scope.payment.expiryDate == undefined || $scope.payment.expiryDate == null) {
            $scope.payment.expiryDateErr = "Please enter the credit card's expiry date.";
        } else {
            $scope.payment.expiryDateErr = null;
        }
        // else if(!Stripe.card.validateExpiry($scope.payment.expiryDate.getMonth() + 1, $scope.payment.expiryDate.getFullYear())) {
        //   $scope.payment.expiryDateErr = "Please enter valid expiry date."
        // }
    }
    $scope.payment.validatePromoCardName = function() {
        if ($scope.payment.promocardName == "" || $scope.payment.promocardName == undefined || $scope.payment.promocardName == null) {
            $scope.payment.promocardNameErr = "Please enter a valid promo code.";
        } else {
            $scope.payment.promocardNameErr = null;
        }
    }
    $scope.payment.placeOrder = function() {
        $scope.payment.validateFirstName();
        $scope.payment.validateLastName();
        $scope.payment.validateEmail();
        $scope.payment.validPhone();
        if ($scope.payment.cardSelect != 'Cash on arrival') {
            $scope.payment.validCardType();
            $scope.payment.validCardNo();
            $scope.payment.validateSequirityCode();
            $scope.payment.validateCardHolder();
            $scope.payment.validateExpiryDate();
        } else {
            $scope.payment.cardTypeErr = null;
            $scope.payment.cardnoErr = null;
            $scope.payment.sequirityCodeErr = null;
            $scope.payment.cardHolderErr = null;
            $scope.payment.expiryDateErr = null;
        }
        $scope.payment.validatePromoCardName();
        if ($scope.payment.firstNameErr == null && $scope.payment.lastNameErr == null && $scope.payment.emailErr == null && $scope.payment.phoneErr == null && $scope.payment.cardTypeErr == null && $scope.payment.cardnoErr == null && $scope.payment.sequirityCodeErr == null && $scope.payment.cardHolderErr == null && $scope.payment.expiryDateErr == null) {
            spinnerService.show("html5spinner");
            expiry_Date = $scope.payment.expiryDate.split('/')
            data = {
                first_name: $scope.payment.firstName,
                last_name: $scope.payment.lastName,
                email: $scope.payment.email,
                phone: $scope.payment.phone,
                seen_practitioner: $scope.payment.seen_prac,
                comment: $scope.payment.comment,
                promotional_news: $scope.payment.promotional_news,
                payment_type: $scope.payment.cardSelect,
                card_type: $scope.payment.cardType,
                card_number: $scope.payment.cardno,
                cvc: $scope.payment.sequirityCode,
                cardHolder: $scope.payment.cardHolder,
                exp_month: parseInt(expiry_Date[0]),
                exp_year: parseInt(expiry_Date[1]),
                promocardName: $scope.payment.promocardName,
                amount: parseInt($scope.payment_details.price)*100,
                actual_price: parseInt($scope.payment_details.actual_price)*100,
                account_id: $scope.payment_details.business_data.acconut_id,
                currency: "aud",
            }
            var appointment_type = $scope.app.isLogin ? "AvaanaUser" : "Guest"
            if ($scope.event_detals.startTime == null) {
                appointment_type += ' Voucher'
            }
            appointment_data = {
                customer_name: $scope.payment.firstName,
                customer_last_name: $scope.payment.lastName,
                customer_email: $scope.payment.email,
                customer_phone: $scope.payment.phone,
                business_email: $scope.payment_details.business_data.email,
                business: $scope.payment_details.business_data.id,
                service_name: $scope.payment_details.service_name,
                service_id: $scope.payment_details.id,
                appointment_date: $scope.event_detals.eventDate, //"Wednesday, 07 December",
                appointment_start_time: $scope.event_detals.startTime, //"02:00 PM",
                appointment_end_time: $scope.event_detals.endTime, //"03:15 PM",
                business_practitioner: $scope.event_detals.practitioner_id,
                appointment_price: $scope.payment_details.price,
                event_year: $scope.event_detals.event_yr,
                temp_slug: $stateParams.appoint_slug,
                appointment_type: appointment_type,
                seen_practitioner: $scope.payment.seen_prac,
                comment: $scope.payment.comment,
                promotional_news: $scope.payment.promotional_news,
            }
            // console.log(JSON.stringify(appointment_data))
            if(data.amount!=0)
                place_order(data,appointment_data)
            else
                appointment_create(appointment_data)
        }
    }



    var place_order = function(data,appointment_data){
        apiService.getData("a_place_order/", data, 'post').then(function(res) {
            // console.log("Data"+JSON.stringify(res.data))
                if (res.data.status == 200) {
                    appointment_create(appointment_data)
                } else {
                    spinnerService.hide("html5spinner");
                    alert(res.data.Message)
                }
                // spinnerService.hide("html5spinner");
            }, function(error) {
                spinnerService.hide("html5spinner");
            });
    }


    var appointment_create = function(data){
        if ($scope.app.isLogin) {
            apiService.getDataWithToken("a_appointment_create/", data, 'post').then(function(res) {
                if (res.data.status == 200) {
                    spinnerService.hide("html5spinner");
                    $state.go("app.checkoutConfirm",{
                        "appointment_id":res.data.appointment_id
                    });
                }
            }, function(error) {
                spinnerService.hide("html5spinner");
                console.log('Error:' + JSON.stringify(error));
            });
        } else {
            apiService.getData("a_appointment_create/", data, 'post').then(function(res) {
                if (res.data.status == 200) {
                    spinnerService.hide("html5spinner");
                    $state.go("app.checkoutConfirm",{
                        "appointment_id":res.data.appointment_id
                    });
                }
            }, function(error) {
                spinnerService.hide("html5spinner");
            });
        }
    }

    $scope.terms = function () {
        $mdDialog.show({
            templateUrl: 'static/templates/terms.html',
            clickOutsideToClose:true,
            controller:'alertPopUpCtrl',
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
            locals:{
                "Message": "avaana terms and conditions",
                'type':'welcome',
                "next_Step":"",
                "current_Step":"",
            }
        });

    }
    $scope.guidelines = function () {
        $mdDialog.show({
            templateUrl: 'static/templates/guidelines.html',
            clickOutsideToClose:true,
            controller:'alertPopUpCtrl',
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
            locals:{
                "Message": "avaana community guidelines",
                'type':'welcome',
                "next_Step":"",
                "current_Step":"",
            }
        });

    }
    $scope.providerterms = function () {
        $mdDialog.show({
            templateUrl: 'static/templates/providerterms.html',
            clickOutsideToClose:true,
            controller:'alertPopUpCtrl',
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
            locals:{
                "Message": "avaana community guidelines",
                'type':'welcome',
                "next_Step":"",
                "current_Step":"",
            }
        });
    }


    $scope.payment.applyCode = function() {
        if ($scope.payment.promo_code == "" || $scope.payment.promo_code == undefined || $scope.payment.promo_code == null) {
            $scope.payment.promo_codeErr = "Please enter a valid promo code.";
        } else {
            $scope.payment.promo_codeErr = null;
        }
        if ($scope.payment.promo_codeErr == null) {
            apiService.getDataWithToken('a_promo_code_validation/' + $scope.payment.promo_code + "/", {}, 'get').then(function(res) {
                if (res.data.status == 200) {
                    $scope.promo_discount = res.data.Off_Percent
                    discount = ($scope.payment_details.price * $scope.promo_discount) / 100
                    $scope.payment_details.price = $scope.payment_details.price - discount;
                    $scope.promo_button = false
                    $scope.promo_value = $scope.payment.promo_code
                }
                $scope.payment.promo_codeErr = res.data.Message;
            })
        }
    }

    $scope.promoValidate = function(){
        if($scope.payment.promo_code==$scope.promo_value){
            $scope.promo_button = false
            $scope.payment.promo_codeErr = "Promo Code is Valid.";
        }else{
            $scope.promo_button = true
            $scope.payment.promo_codeErr = null;
        }
    }
})