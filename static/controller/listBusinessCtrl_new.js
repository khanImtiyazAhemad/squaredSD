angular.module("avaanaController").controller("listBusinessCtrl_new", function(spinnerService, apiService, $scope, $window, $timeout, $uibModal, $timeout, $filter, $mdpTimePicker, $stateParams, $mdDialog,$anchorScroll,$rootScope) {
    $scope.business = {}
    $scope.dataLoaded = false;
    $scope.pract_text = "Save Practitioner"
    $scope.servicedataLoaded = false
    var numRegex = /^\d+$/;
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var websiteRegex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?")
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
        // $scope.bankAccountVerification=false
    var getThumb = function(url, size) {
        if (url === null) {
            return '';
        }
        size = (size === null) ? 'big' : size;
        results = url.match('[\\?&]v=([^&#]*)');
        video = (results === null) ? url : results[1];

        if (size === 'small') {
            return 'http://img.youtube.com/vi/' + video + '/2.jpg';
        }
        return 'http://img.youtube.com/vi/' + video + '/0.jpg';
    };
    apiService.getData('all_state/', {}, 'get').then(function(res) {
        $scope.business.State = res.data.state
    })
    apiService.getData('a_get_service_cat/', {}, 'get').then(function(res) {
        $scope.ServiceResponse = {
            services: res.data.avaana_services,
            avaana_category: res.data.avaana_categories
        }
    })

    var focus_function = function(location){
        console.log("Inside Focus Function"+location)
            $("#"+location).focus()
    }

    var animate_function = function(location){
    }

    $scope.length_of_the_service = apiService.lengthOfService
    $scope.business.booking_type = apiService.type_booking
    $scope.monthJson = [{val: 01, name: "Jan"}, {val: 02, name: "Feb"}, {val: 03, name: "Mar"}, {val: 04, name: "Apr"}, {val: 05, name: "May"}, {val: 06, name: "Jun"}, {val: 07, name: "Jul"}, {val: 08, name: "Aug"}, {val: 09, name: "Sep"}, {val: 10, name: "Oct"}, {val: 11, name: "Nov"}, {val: 12, name: "Dec"}];
    $scope.business.days = [{
        business_day: 'Monday',
        day_status: "Open",
        start_timing: "06:00 AM",
        end_timing: "05:30 PM",
        error: null
    }, {
        business_day: 'Tuesday',
        day_status: "Open",
        start_timing: "06:00 AM",
        end_timing: "05:30 PM",
        error: null
    }, {
        business_day: 'Wednesday',
        day_status: "Open",
        start_timing: "06:00 AM",
        end_timing: "05:30 PM",
        error: null
    }, {
        business_day: 'Thursday',
        day_status: "Open",
        start_timing: "06:00 AM",
        end_timing: "05:30 PM",
        error: null
    }, {
        business_day: 'Friday',
        day_status: "Open",
        start_timing: "06:00 AM",
        end_timing: "05:30 PM",
        error: null
    }, {
        business_day: 'Saturday',
        day_status: "Closed",
        start_timing: "06:00 AM",
        end_timing: "05:30 PM",
        error: null
    }, {
        business_day: 'Sunday',
        day_status: "Closed",
        start_timing: "06:00 AM",
        end_timing: "05:30 PM",
        error: null
    }]
    if ($stateParams.key) {
        apiService.getData('a_get_incomplete_business/' + $stateParams.key + "/", {}, 'get').then(function(res) {
            $scope.allBusinessServiceResponse = {
                    all_business: res.data.Business_data
                }
            $scope.business.status = {
                "key_contact":false,
                "about_card": $scope.allBusinessServiceResponse.all_business.about_business_check,
                "practitioner_card": $scope.allBusinessServiceResponse.all_business.about_practitioner_check,
                "payment_card": $scope.allBusinessServiceResponse.all_business.payment_gateway_check,
            }
                //********************** Set Contact Detail Data ***********************************************
            localStorage.business_id = $scope.allBusinessServiceResponse.all_business.id;
            $scope.business.step1Status = $scope.allBusinessServiceResponse.all_business.id;
            $scope.business.step2Status = $scope.allBusinessServiceResponse.all_business.id;
            $scope.business.businessName = $scope.allBusinessServiceResponse.all_business.name;
            $scope.business.address = $scope.allBusinessServiceResponse.all_business.business_location.address;
            $scope.business.city = $scope.allBusinessServiceResponse.all_business.business_location.city;
            $scope.business.state = $scope.allBusinessServiceResponse.all_business.business_location.state;
            $scope.business.postal_code = $scope.allBusinessServiceResponse.all_business.business_location.postal_code;
            $scope.business.email = $scope.allBusinessServiceResponse.all_business.email;
            $scope.business.contact_name = $scope.allBusinessServiceResponse.all_business.contact_name;
            $scope.business.telephone = $scope.allBusinessServiceResponse.all_business.tel_no;
            //********************* SET Service Detail Data ***********************************************
            if ($scope.allBusinessServiceResponse.all_business.business_days.length != 0) {
                $scope.business.days = $scope.allBusinessServiceResponse.all_business.business_days;
            }
            $scope.business.servicesArray = $scope.allBusinessServiceResponse.all_business.business_service;

            $timeout(function(){
                 $scope.servicedataLoaded = true;
            },100)
            $scope.business.businessPhotoArray = $scope.allBusinessServiceResponse.all_business.business_photos;
            $scope.business.BusinessHolidayArray = $scope.allBusinessServiceResponse.all_business.business_holidays;
            $scope.business.logo_name = $scope.allBusinessServiceResponse.all_business.business_detail.logo_name;
            $scope.convertImgToDataURLviaCanvas($scope.allBusinessServiceResponse.all_business.business_detail.thumb_image, function(base64Img) {
                $scope.business.logo_image = base64Img;
            });
            $scope.business.booking_mode = $scope.allBusinessServiceResponse.all_business.business_detail.booking_mode;
            $scope.business.business_profile = $scope.allBusinessServiceResponse.all_business.business_detail.business_profile;
            //********************* SET Practitioners Detail Data ***********************************************
            $scope.business.PractitionerList = $scope.allBusinessServiceResponse.all_business.business_practitioner
            $scope.business.BusinessAllPractitioner = $scope.allBusinessServiceResponse.all_business.business_practitioner;

            $timeout(function(){
                $scope.dataLoaded = true;
            },100)

            $scope.business.abn = $scope.allBusinessServiceResponse.all_business.abn;
            $scope.business.bnkName = $scope.allBusinessServiceResponse.all_business.business_stripe.bank_name;
            $scope.business.accHolderName = $scope.allBusinessServiceResponse.all_business.business_stripe.account_holder_name;
            $scope.business.RoutingName = $scope.allBusinessServiceResponse.all_business.business_stripe.routing_number;
            apiService.getData('a_get_business_services/' + localStorage.business_id + "/", {}, 'get').then(function(res) {
                $scope.business.businessServiceResponse = res.data.business_service
            })
        })
    } else {
        /****************Object and variable Intialisation*****************/
        $scope.business.status = {
            "key_contact":true,
            "practitioner_card": false,
            "about_card": false,
            "payment_card": false
        }
        $scope.business.step1Status = null
        $scope.business.step2Status = null
        $scope.business.practtionarArray = [];
        $scope.business.BusinessHolidayArray = [];
        $scope.business.servicesArray = []
        $scope.business.businessPhotoArray = []
        $scope.business.PractitionerList = []
        $scope.business.BusinessAllPractitioner = []
        $scope.logo_image = null
        $scope.business.practitioner_logo_image = null;
        $scope.business.step1Success = false
            /******************Object and Variable Intialisation End*************/
            /*** This Block excute when when are Logged In and want to add another Location of our Exsiting Business ******/
        if (localStorage.userId) {
            apiService.getDataWithToken('a_get_user/', {}, 'get').then(function(res) {
                $scope.business.email = res.data.User_detail.email;
                // console.log(JSON.stringify(res.data.Business_data))
                if (res.data.Business_data) {
                    $scope.business.businessName = res.data.Business_data[0].name;
                    $scope.business.contact_name = res.data.Business_data[0].contact_name;
                    $scope.business.telephone = res.data.Business_data[0].tel_no;
                }
            })
        }
        /******** Above if block Ends here ************/
    }
    /******************* Step 1Validation Method and API call ***********************/
    $scope.business.validateName = function() {
        if ($scope.business.businessName == '' || $scope.business.businessName == undefined || $scope.business.businessName == null) {
            $scope.business.businessNameErr = "Please enter your business name.";
        } else {
            $scope.business.businessNameErr = null;
        }
    }
    $scope.business.validateAddress = function() {
        if ($scope.business.address == '' || $scope.business.address == undefined || $scope.business.address == null) {
            $scope.business.addressErr = "Please enter your business address.";
        } else {
            $scope.business.addressErr = null;
        }
    }
    $scope.business.validateCity = function() {
        if ($scope.business.city == '' || $scope.business.city == undefined || $scope.business.city == null) {
            $scope.business.cityErr = "Please enter your suburb.";
        } else {
            $scope.business.cityErr = null;
        }
    }
    $scope.business.validateState = function() {
        if ($scope.business.state == '' || $scope.business.state == undefined || $scope.business.state == null) {
            $scope.business.stateErr = "Please enter your state.";
        } else {
            $scope.business.stateErr = null;
        }
    }
    $scope.business.validatePostal_code = function() {
        if ($scope.business.postal_code == '' || $scope.business.postal_code == undefined || $scope.business.postal_code == null) {
            $scope.business.postal_codeErr = "Please enter your post code.";
        } else {
            $scope.business.postal_codeErr = null;
        }
    }
    $scope.business.validateEmail = function() {
        if ($scope.business.email == '' || $scope.business.email == undefined || $scope.business.email == null) {
            $scope.business.emailErr = "Please enter your email.";
        } else if (!emailRegex.test($scope.business.email)) {
            $scope.business.emailErr = "Please enter a valid email address.";
        } else {
            $scope.business.emailErr = null;
        }
    }
    $scope.business.validateContactname = function() {
        if ($scope.business.contact_name == '' || $scope.business.contact_name == undefined || $scope.business.contact_name == null) {
            $scope.business.contact_nameErr = "Please enter the name of a representative of your business that we can reach out to.";
        } else {
            $scope.business.contact_nameErr = null;
        }
    }
    $scope.business.validateTelephone = function() {
        if ($scope.business.telephone == '' || $scope.business.telephone == undefined || $scope.business.telephone == null) {
            $scope.business.telephoneErr = "Please enter your business contact's number."
        } else if ($scope.business.telephone != '' && $scope.business.telephone != undefined && $scope.business.telephone != null) {
            if (!numRegex.test($scope.business.telephone)) {
                $scope.business.telephoneErr = "Please use numbers only; no dashes or spaces."
            }else {
                $scope.business.telephoneErr = null;
            }
        } else {
            $scope.business.telephoneErr = null;
        }
    }

    $scope.Step1 = function() {
        $scope.business.apiError = null;
        $scope.business.validateName();
        $scope.business.validateAddress();
        $scope.business.validateCity();
        $scope.business.validateState();
        $scope.business.validatePostal_code();
        $scope.business.validateEmail();
        $scope.business.validateContactname();
        $scope.business.validateTelephone();
        if ($scope.business.businessNameErr != null){
            focus_function('bussi_name');
        }else if ($scope.business.addressErr != null){
            focus_function('street_number');
        }else if ($scope.business.cityErr != null){
            focus_function('locality');
        }
        else if ($scope.business.postal_codeErr != null){
            focus_function('postal_code');
        }else if ($scope.business.emailErr != null){
            focus_function('email_id');
        }else if ($scope.business.contact_nameErr != null){
            focus_function('contact_name');
        }else if ($scope.business.telephoneErr != null){
            focus_function('tele_num');
        }else if ($scope.business.businessNameErr == null && $scope.business.addressErr == null && $scope.business.cityErr == null && $scope.business.stateErr == null && $scope.business.postal_codeErr == null && $scope.business.emailErr == null && $scope.business.contact_nameErr == null && $scope.business.telephoneErr == null) {
            spinnerService.show("html5spinner");
            var geocoder = new google.maps.Geocoder();
            var location_fetch = function() {
                geocoder.geocode({
                    'address': $scope.business.address+" "+$scope.business.city+" "+$scope.business.state+" "+$scope.business.postal_code
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        $scope.lat = results[0].geometry.location.lat();
                        $scope.lng = results[0].geometry.location.lng();
                        data = {
                                id: $scope.business.step1Status,
                                name: $scope.business.businessName,
                                location_data: {
                                    address: $scope.business.address,
                                    city: $scope.business.city,
                                    state: $scope.business.state,
                                    postal_code: $scope.business.postal_code,
                                    lat: $scope.lat,
                                    lng: $scope.lng
                                },
                                email: $scope.business.email,
                                contact_name: $scope.business.contact_name,
                                tel_no: $scope.business.telephone,
                            }
                            // console.log(JSON.stringify(data))
                        apiService.getData('a_createbusiness/', data, 'post').then(function(success) {
                            if (success.data.status == 500) {
                                $scope.business.apiError = success.data.Error;
                                error_key = Object.keys(success.data.Message);
                                if (error_key[0] === 'email') {
                                    $scope.register.emailErr = "Email address already exists.";
                                } else {
                                    $scope.register.addressErr = success.data.Error;
                                }
                            } else {
                                $scope.business.step1Status = success.data.Business_data.id;
                                $scope.business.status.key_contact =false;
                                $scope.business.status.practitioner_card = true;
                                $scope.business.step1Success = true
                                localStorage.business_id = success.data.Business_data.id;
                                $timeout(function() {focus_function('pract_name');}, 100);

                            }
                            spinnerService.hide("html5spinner");
                        }, function(error) {
                            spinnerService.hide("html5spinner");
                        });
                    } else {
                        spinnerService.hide("html5spinner");
                        alert("Geocode was not successful: " + status);
                    }
                });
            }
            location_fetch()
        }
    }


    // Practitioner Information Section
    $scope.business.validatePrac_name = function() {
        if ($scope.business.prac_name == '' || $scope.business.prac_name == undefined || $scope.business.prac_name == null) {
            $scope.business.prac_nameErr = "Please enter the name of your practitioner.";
        } else {
            $scope.business.prac_nameErr = null;
        }
    }
    $scope.business.validatePrac_Profile = function() {
        if ($scope.business.prac_profile == '' || $scope.business.prac_profile == undefined || $scope.business.prac_profile == null) {
            $scope.business.prac_profileErr = "Please enter a short bio for this practitioner (Maximum 600 characters).";
        } else {
            $scope.business.prac_profileErr = null;
        }
    }
    $scope.business.validatePractitioneremail = function() {
        if ($scope.business.prac_email == '' || $scope.business.prac_email == undefined || $scope.business.prac_email == null) {
            $scope.business.prac_emailErr = "Please enter this practitioner's email.";
        } else if (!emailRegex.test($scope.business.prac_email)) {
            $scope.business.prac_emailErr = "Please enter a valid email.";
        } else {
            $scope.business.prac_emailErr = null;
        }
    }
    $scope.removePractitioner = function(id) {
        apiService.getData('a_business_practitioner_remove/' + id + "/", {}, 'get').then(function(success) {
            if (success.data.status == 500) {} else {
                $scope.dataLoaded = false;
                $scope.business.PractitionerList= success.data.Business_all_practitioner;
                $timeout(function(){
                    $scope.dataLoaded = true;
                },100)
            }
        }, function(error) {
        });
    }
    $scope.editPractitioner = function(practitioner) {
        $scope.pract_text = "Save Changes"
        $scope.business.prac_name = practitioner.name
        $scope.myImage = practitioner.correct_image
        $scope.business.prac_profile = practitioner.profile
        $scope.business.prac_email = practitioner.email
        $scope.business.practitioner_logo_name = practitioner.logo_name
        $scope.prac_id = practitioner.id
        $scope.convertImgToDataURLviaCanvas(practitioner.correct_image, function(base64Img) {
            $scope.business.practitioner_logo_image = base64Img;
        });
    }


    $scope.prac_id = null
    $scope.business.step2 = function() {
        // if ($scope.business.practitioner_logo_name == undefined) {
        //     $scope.business.practitionerImageErr = 'Please choose a picture for your practitioner.'
        // } else {
        //     $scope.business.practitionerImageErr = null
        // }
        // && $scope.business.prac_profileErr == null && $scope.business.practitionerImageErr==null && && $scope.business.prac_emailErr == null
        $scope.business.validatePrac_name();
        // $scope.business.validatePrac_Profile();
        $scope.business.validatePractitioneremail();
        if ($scope.business.prac_nameErr != null){
            focus_function('pract_name');
        }else if ($scope.business.prac_emailErr != null){
            focus_function('pract_email');
        }else if ($scope.business.prac_nameErr == null) {
            spinnerService.show("html5spinner");
            data = {
                    id: $scope.prac_id,
                    name: $scope.business.prac_name,
                    logo_image: $scope.business.practitioner_logo_image,
                    logo_name: $scope.business.practitioner_logo_name,
                    profile: $scope.business.prac_profile,
                    email: $scope.business.prac_email,
                    business: localStorage.business_id
                }
            apiService.getData('a_createbusiness_practitioner/', data, 'post').then(function(success) {
                if (success.data.status == 500) {
                    $scope.business.step3ApiErr = success.data.Error
                } else {
                    $scope.business.BusinessAllPractitioner = success.data.Business_all_practitioner;
                    // console.log(JSON.stringify($scope.business.BusinessAllPractitioner))
                    $scope.dataLoaded = false;
                    $scope.prac_id = null;
                    $scope.business.PractitionerList = success.data.Business_all_practitioner;

                    $timeout(function(){
                        $scope.dataLoaded = true;
                        focus_function('pract_name');
                        spinnerService.hide("html5spinner");
                    },100)
                    blankPractitionerInput()
                    $scope.pract_text = "Save Practitioner"
                    $scope.business.step3ApiErr = null

                }
            }, function(error) {
                spinnerService.hide("html5spinner");
            });
        }
    }
    var blankPractitionerInput = function() {
        $scope.business.prac_name = undefined
        $scope.business.prac_profile = undefined
        $scope.business.prac_username = undefined
        $scope.business.prac_email = undefined
        $scope.business.prac_password = undefined
        $scope.business.practtionarArray = []
        $scope.business.practitioner_logo_image = null;
        $scope.business.practitioner_logo_name = null;
        $scope.business.practitionerImageErr = null;
    }

    $scope.continueStep2 = function(event) {
        $mdDialog.show({
            scope: $scope.$new(),
            templateUrl: 'static/templates/list_alertpopup.html',
            clickOutsideToClose:true,
            controller:'listalertPopUpCtrl',
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
            locals:{
                "Heading": "Ready to continue?",
                "Message":"Are you ready to continue to Step 3?",
                "type":true,
                "next_Step":"3",
                "current_Step":"2",
            }
        });
    }

    $scope.business.step2Continue = function() {
        if ($scope.business.PractitionerList.length <= 0) {
            $scope.business.step3ApiErr = "Please add at least one practitioner."
        } else if ($scope.business.step3ApiErr == null) {
            $scope.business.status.about_card = true;
            $scope.business.status.practitioner_card = false;
            $timeout(function() {focus_function('buss_prof');}, 100);
        }
    }




    /****************** Contact Details end  **********************/
    $scope.CategroySearchMethod = function(txt) {
            var resArr = $scope.ServiceResponse.avaana_category;
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
        // Ends Here

    $scope.ChangeCategoryItem = function(id) {
        for (i = 0; i < $scope.ServiceResponse.avaana_category.length; i++) {
            if ($scope.ServiceResponse.avaana_category[i].id == id) {
                $scope.ServiceResponse.services = $scope.ServiceResponse.avaana_category[i].category_serviceArray;
            }
        }
    }

    $scope.business.validatecategory = function() {
        if ($('#category_name input[type="search"]:eq(0)').val() == '' || $('#category_name input[type="search"]:eq(0)').val() == undefined || $('#category_name input[type="search"]:eq(0)').val() == null) {
            $scope.business.business_catgErr = "Please select a category for this service.";
        } else {
            $scope.business.business_catgErr = null;
        }
    }
    $scope.business.validateService = function() {
        if ($('#service_name input[type="search"]:eq(0)').val() == '' || $('#service_name input[type="search"]:eq(0)').val() == undefined || $('#service_name input[type="search"]:eq(0)').val() == null) {
            $scope.business.business_serviceErr = "Please enter a service.";
        } else {
            $scope.business.business_serviceErr = null;
        }
    }
    $scope.business.validateserviceLength = function() {
        if ($scope.business.service_length == '' || $scope.business.service_length == undefined || $scope.business.service_length == null) {
            $scope.business.service_lengthErr = "Please select a time duration for this service.";
        } else {
            $scope.business.service_lengthErr = null;
        }
    }

    $scope.business.validateprovidingService = function() {
            if ($scope.business.prac_provide_service == '' || $scope.business.prac_provide_service == undefined || $scope.business.prac_provide_service == null) {
                $scope.business.providing_serviceErr = "Please select at least one of your practitioners who is qualified to provide this service.";
            } else {
                $scope.business.providing_serviceErr = null;
            }
        }
        /*********To Add Prefix in the Begnning of Service Price nd Discounted Price *******/
    $scope.business.validateServicePrice = function() {

            if ($scope.business.service_price.length && $scope.business.service_price.indexOf('$') == -1) {
                $scope.business.service_price = "$" + $scope.business.service_price
            } else if ($scope.business.service_price == '$') {
                $scope.business.service_price = null;
            }

            if ($scope.business.service_price == '' || $scope.business.service_price == undefined || $scope.business.service_price == null) {
                $scope.business.service_priceErr = "Please enter a price.";
            } else {
                $scope.business.service_priceErr = null;
            }
        }
        /********* Ends Here ******/
    $scope.business.validateServiceDiscount = function() {


        if ($scope.business.service_discount == '' || $scope.business.service_discount == undefined || $scope.business.service_discount == null) {
            $scope.business.service_discountErr = null;
        } else if ($scope.business.service_discount != '' || $scope.business.service_discount != undefined || $scope.business.service_discount != null) {
            if ($scope.business.service_discount.length && $scope.business.service_discount.indexOf('$') == -1) {
                $scope.business.service_discount = "$" + $scope.business.service_discount
            } else if ($scope.business.service_discount == '$') {
                $scope.business.service_discount = null;
            }
            var price = $scope.business.service_price.indexOf('$') != -1 ? $scope.business.service_price.substring(1, $scope.business.service_price.length) : $scope.business.service_price;
            var discount = $scope.business.service_discount.indexOf('$') != -1 ? $scope.business.service_discount.substring(1, $scope.business.service_discount.length) : $scope.business.service_discount;
            if (parseInt(discount) > parseInt(price)) {
                $scope.business.service_discountErr = "Discounted price cannot be greater than the normal price.";
            } else {
                $scope.business.service_discountErr = null;
            }
        }
    }




    $scope.service_id = null;
    // API to call the Service of Business
    $scope.business.addService = function() {
            $scope.business.validateService();
            $scope.business.validatecategory();
            $scope.business.validateserviceLength();
            $scope.business.validateprovidingService();
            $scope.business.validateServicePrice();
            $scope.business.validateServiceDiscount();
            console.log($scope.business.business_serviceErr== null)
            console.log($scope.business.business_catgErr == null)
            console.log($scope.business.service_lengthErr == null)
            console.log($scope.business.providing_serviceErr == null)
            console.log($scope.business.service_priceErr == null)
            console.log($scope.business.service_discountErr == null)
            if ($scope.business.business_serviceErr != null){
                animate_function('category_name');
            }else if ($scope.business.business_serviceErr != null){
                animate_function('service_name');
            }else if ($scope.business.service_lengthErr != null){
                animate_function('service_length');
            }else if ($scope.business.providing_serviceErr != null){
                animate_function('pract_prov_serv');
            }else if ($scope.business.service_priceErr != null){
                focus_function('service_price');
            }else if ($scope.business.service_discountErr != null){
                focus_function('discounted_price');
            }else if ($scope.business.business_serviceErr == null && $scope.business.business_catgErr == null && $scope.business.service_lengthErr == null && $scope.business.providing_serviceErr == null && $scope.business.service_priceErr == null && $scope.business.service_discountErr == null) {
                spinnerService.show("html5spinner");
                data = {
                        business: localStorage.business_id,
                        service_name: $('#service_name input[type="search"]:eq(0)').val(),
                        category_name: $('#category_name input[type="search"]:eq(0)').val(),
                        length_of_service: $scope.business.service_length,
                        service_practitioner: $scope.business.prac_provide_service,
                        price: $scope.business.service_price.indexOf('$') != -1 ? $scope.business.service_price.substring(1, $scope.business.service_price.length) : $scope.business.service_price,
                        discount: $scope.business.service_discount == undefined ? $scope.business.service_discount : $scope.business.service_discount.indexOf('$') != -1 ? $scope.business.service_discount.substring(1, $scope.business.service_discount.length) : $scope.business.service_discount,
                        id: $scope.service_id
                    }
                apiService.getData('a_createbusiness_service/', data, 'post').then(function(success) {
                    if (success.data.status == 500) {
                        $scope.business.ServiceApiErr = success.data.Error;
                    } else {
                        $scope.business.businessServiceResponse = success.data.business_service
                        $scope.servicedataLoaded =false
                        if ($scope.service_id) {
                            for (i = 0; i < $scope.business.servicesArray.length; i++) {
                                if ($scope.business.servicesArray[i].id == success.data.Service_data.id) {
                                    $scope.service_id = null;
                                    $scope.business.ServiceApiErr = null;
                                    $scope.blankServiceInput();
                                    $scope.business.servicesArray[i].business = success.data.Service_data.business,
                                        $scope.business.servicesArray[i].service_name = success.data.Service_data.service_name,
                                        $scope.business.servicesArray[i].category_name = success.data.Service_data.category_name,
                                        $scope.business.servicesArray[i].length_of_service = success.data.Service_data.length_of_service,
                                        $scope.business.servicesArray[i].service_practitioner = success.data.Service_data.service_practitioner,
                                        $scope.business.servicesArray[i].price = success.data.Service_data.price,
                                        $scope.business.servicesArray[i].discount = success.data.Service_data.discount,
                                        $scope.business.servicesArray[i].id = success.data.Service_data.id
                                }
                            }
                        } else {
                            $scope.service_id = null;
                            $scope.business.ServiceApiErr = null;
                            $scope.blankServiceInput();
                            $scope.business.servicesArray.push({
                                business: success.data.Service_data.business,
                                service_name: success.data.Service_data.service_name,
                                category_name: success.data.Service_data.category_name,
                                length_of_service: success.data.Service_data.length_of_service,
                                service_practitioner: success.data.Service_data.service_practitioner,
                                price: success.data.Service_data.price,
                                discount: success.data.Service_data.discount,
                                id: success.data.Service_data.id
                            })
                        }
                        $timeout(function() {
                            animate_function('category_name');
                             $scope.servicedataLoaded =true
                              spinnerService.hide("html5spinner");
                        }, 100);
                    }
                }, function(error) {
                    spinnerService.hide("html5spinner");
                    console.log('Error:' + JSON.stringify(error));
                });
            }
        }
    /******************************* Add Service end  ******************************************************/
    /******************************* Remove Service  ******************************************************/
    $scope.removeService = function(id) {
            apiService.getData('a_createbusiness_service_remove/' + id + "/", {}, 'get').then(function(success) {
                console.log("Success..." + JSON.stringify(success.data))
                if (success.data.status == 500) {
                    $scope.business.ServiceApiErr = success.data.Message;
                } else {
                    $scope.servicedataLoaded =false
                    for (i = 0; i < $scope.business.servicesArray.length; i++) {
                        if ($scope.business.servicesArray[i].id == id) {
                            $scope.business.servicesArray.splice(i, 1)
                        }
                    }
                    $timeout(function() {
                         $scope.servicedataLoaded =true
                    }, 100);
                }
            }, function(error) {
                console.log('Error:' + JSON.stringify(error));
            });
        }
    /******************************* Remove Service end  ******************************************************/
    /******************************* Edit Service  ******************************************************/
    $scope.editService = function(id) {
            for (i = 0; i < $scope.business.servicesArray.length; i++) {
                if ($scope.business.servicesArray[i].id == id) {
                    $('#service_name input[type="search"]:eq(0)').val($scope.business.servicesArray[i].service_name);
                    $('#category_name input[type="search"]:eq(0)').val($scope.business.servicesArray[i].category_name);
                    $scope.business.service_length = $scope.business.servicesArray[i].length_of_service;
                    $scope.business.prac_provide_service = $scope.business.servicesArray[i].service_practitioner;
                    $scope.business.service_price = "$" + $scope.business.servicesArray[i].price;
                    $scope.business.service_discount = "$" + $scope.business.servicesArray[i].discount;
                    $scope.service_id = id;
                }
            }
        }
        /********** Function for clean the input fields of Add Service Section  ******************/
    $scope.blankServiceInput = function() {
            $('#service_name input[type="search"]:eq(0)').val(undefined)
            $('#category_name input[type="search"]:eq(0)').val(undefined)
            $scope.business.service_length = undefined
            $scope.business.service_price = undefined
            $scope.business.service_discount = undefined
        }
        /********************* Photo modal for selcting the photo  *************/
        // Modal of Photo
    $scope.openPhotoModal = function(type) {
            $scope.shomMyImage = false;
            $scope.photoModel = $uibModal.open({
                templateUrl: 'static/templates/photoModal.html',
                controller: 'photo_Ctrl',
                scope: $scope
            });
            $scope.type = type;
            $scope.photoModel.rendered.then(function(success) {
                $scope.myImage = '';
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
    // Fire Methon when Emit from Child Controller Of Photo Modal
    // When Photo Type is selected for Business Photo Array
    $scope.$on("photoChoosen", function(evt, data) {
            spinnerService.show("html5spinner");
            logo_name = data.name,
            type = data.type;
            data = {
                image: data.img,
                business: localStorage.business_id,
                name: logo_name,
                type_of_url: type,
            }
            apiService.getData('a_createbusiness_photo/', data, 'post').then(function(success) {
                if (success.data.status == 500) {
                    $scope.business.business_photoErr = success.data.Error;
                } else {
                    $scope.business.business_photoErr = null
                    $scope.business.businessPhotoArray.push({
                            id: success.data.Business_Photo['id'],
                            business: success.data.Business_Photo['business'],
                            correct_image: success.data.Business_Photo['correct_image'],
                            name: success.data.Business_Photo['name'],
                            type_of_url: success.data.Business_Photo['type_of_url'],
                            thumb_image: success.data.Business_Photo['type_of_url'] == 'Image' ? success.data.Business_Photo['thumb_image'] : getThumb(success.data.Business_Photo['correct_image'], 'small')
                        })
                        // console.log("Photo Array..." + JSON.stringify($scope.business.businessPhotoArray))
                }
                spinnerService.hide("html5spinner");
            }, function(error) {
                spinnerService.hide("html5spinner");
            })
        })
    // When Logo type choose for Business Logo
    $scope.$on("logoChoosen", function(evt, data) {
            $scope.business.business_logoErr = null;
            $scope.business.logo_image = data.img;
            $scope.business.logo_name = data.name;
        })
    // When Practitoner Type Choosen for Practitioner Logo
    $scope.$on("practitionerlogoChoosen", function(evt, data) {
            $scope.business.practitionerImageErr = null;
            $scope.business.practitioner_logo_image = data.img;
            $scope.business.practitioner_logo_name = data.name;
        })
        // To remove the Logo of Business
    $scope.business.removeLogo = function() {
            $scope.business.logo_image = null;
            $scope.businesslogo_name = null;
            $scope.business.business_logoErr = "Please choose a logo for your business page.";
        }
        // To remove the Business Photo
    $scope.removeBusinessPhoto = function(id) {
            apiService.getData('a_createbusiness_photo_remove/' + id + "/", {}, 'get').then(function(success) {
                if (success.data.status == 500) {
                    $scope.business.ServiceApiErr = success.data.Message;
                } else {
                    for (i = 0; i < $scope.business.businessPhotoArray.length; i++) {
                        if ($scope.business.businessPhotoArray[i].id == id) {
                            $scope.business.businessPhotoArray.splice(i, 1)
                        }
                    }
                }
            }, function(error) {
            });
        }
        // Time picker for Selecting the time it for all (Same for all)
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
        $scope.business.timingError = null
        $scope.business.prac_timeErr = null
    }


    $scope.startEndArr = apiService.timeArray

    $scope.startTimeClick = function(obj, type, index) {
        if (type == 'start') {
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
            obj.error = "Please select a valid time."
        } else {
            obj.error = null;
        }

    }


    $scope.availabltTimeClick = function(obj, type, index) {
        if (type == 'start') {
            $scope.startEndValidation(obj)
            obj.start_timing = $scope.startEndArr[index]
            $scope.startEndValidation(obj)

        } else if (type == 'end') {
            console.log(type)
            obj.end_timing = $scope.startEndArr[index]
            $scope.startEndValidation(obj)

        }
    }

    /********* Step 2 Validation and API Code*****************/
    $scope.business.validatebusinesstiming = function() {
        $scope.timing_count = 0;
        for (i = 0; i < $scope.business.days.length; i++) {
            if ($scope.business.days[i].day_status == "Open") {
                if ($scope.business.days[i].start_timing != "00:00" && $scope.business.days[i].end_timing != "00:00") {
                    $scope.timing_count++;
                }
            }
        }
        if ($scope.timing_count == 0) {
            $scope.business.timingError = "Please select at least one day for open hours."
        } else {
            $scope.business.timingError = null
        }
    }
    $scope.business.validatebusinessService = function() {
        if ($scope.business.servicesArray.length <= 0) {
            $scope.business.ServiceApiErr = "Please add at least one service for your business."
        } else {
            $scope.business.ServiceApiErr = null
        }
    }
    $scope.business.validatebookingMode = function() {
        if ($scope.business.booking_mode == '' || $scope.business.booking_mode == undefined || $scope.business.booking_mode == null) {
            $scope.business.bookingModeErr = "Please select a booking mode you use for your business.";
        } else {
            $scope.business.bookingModeErr = null;
        }
    }
    $scope.business.validatebusinessProfile = function() {
        if ($scope.business.business_profile == '' || $scope.business.business_profile == undefined || $scope.business.business_profile == null) {
            $scope.business.business_profileErr = "Please enter a short description for your business.";
        } else {
            $scope.business.business_profileErr = null;
        }
    }
    $scope.business.validatebusinessPhotoArray = function() {
        if ($scope.business.businessPhotoArray.length <= 0) {
            $scope.business.business_photoErr = "Please choose at least one photo for your business page.";
        } else {
            $scope.business.business_photoErr = null;
        }
    }


    $scope.continueStep3 = function(event) {
        $mdDialog.show({
            scope: $scope.$new(),
            templateUrl: 'static/templates/list_alertpopup.html',
            clickOutsideToClose:true,
            controller:'listalertPopUpCtrl',
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
            locals:{
                "Heading": "Thank you",
                // "Message":"Thank you for registering your business with Avaana. A community manager will be in touch shortly to finalise your registration. In the meantime, be well, feel good and smile a lot :)",
                "Message":"Apply to join Avaana",
                "type":true,
                "next_Step":"",
                "current_Step":"3",
            }
        }
        );
    }


    $scope.continue_again_with_step2 = function(){
        $scope.business.status.practitioner_card = true;
        $timeout(function() {focus_function('pract_name');}, 100);
    }

    $scope.step3 = function() {
            $scope.business.validatebusinesstiming();
            $scope.business.validatebusinessService();
            $scope.business.validatebusinessProfile();
            $scope.business.validatebusinessPhotoArray();
            if ($scope.business.business_profileErr != null){
                focus_function('buss_prof');
            }else if ($scope.business.timingError == null && $scope.business.ServiceApiErr == null && $scope.business.bookingModeErr == null && $scope.business.business_profileErr == null && $scope.business.business_photoErr == null) {
                spinnerService.show("html5spinner");
                data = {
                        id: $scope.business.step2Status,
                        Business_timing: $scope.business.days,
                        business_holidays: $scope.business.BusinessHolidayArray,
                        booking_mode: $scope.business.booking_mode,
                        business_profile: $scope.business.business_profile,
                        logo_image: $scope.business.logo_image,
                        logo_name: $scope.business.logo_name,
                        business: localStorage.business_id
                    }
                apiService.getData('a_createbusiness_all/', data, 'post').then(function(success) {
                    if (success.data.status == 500) {
                        $scope.business.step2ApiErr = success.data.Error
                    } else {
                        $scope.business.step2Status = success.data.About_business_data.business;
                        $scope.business.status.about_card = false;
                        $scope.business.status.payment_card = false;
                        complete_registration_pop_up()
                        // $timeout(function() {focus_function('buss_number');}, 100);
                    }
                    spinnerService.hide("html5spinner");
                }, function(error) {
                    console.log('Error:' + JSON.stringify(error));
                    spinnerService.hide("html5spinner");
                });
            }
        }
        /************* Step 3 Validation and API Call  *******************/
        /******** To add or remove the Practitioner Holiday *******/
    $scope.business.dateValue = function() {
        $scope.business.practtionarArray.push({
            "holiday_date": $filter('date')($scope.business.practionarholiday, 'yyyy-MM-dd'),
            id: null
        })
    }
    $scope.business.removepracHoliday = function(holiday) {
        if (holiday.id == null) {
            for (i = 0; i < $scope.business.practtionarArray.length; i++) {
                if ($scope.business.practtionarArray[i].id == null && $scope.business.practtionarArray[i].holiday_date == holiday.holiday_date) {
                    $scope.business.practtionarArray.splice(i, 1)
                }
            }
        } else {
            apiService.getData('a_practitioner_holiday_remove/' + holiday.id + "/", {}, 'get').then(function(success) {
                if (success.data.status == 500) {
                    $scope.business.ServiceApiErr = success.data.Message;
                } else {
                    for (i = 0; i < $scope.business.practtionarArray.length; i++) {
                        if ($scope.business.practtionarArray[i].id == id) {
                            $scope.business.practtionarArray.splice(i, 1)
                        }
                    }
                }
            }, function(error) {
            });
        }
    }

    $scope.validateABN = function() {
        if($scope.business.abn == '' || $scope.business.abn == undefined || $scope.business.abn == null) {
            $scope.business.abnErr = "Please enter your Australian Business Number (ABN).";
        } else if(!numRegex.test($scope.business.abn)) {
            $scope.business.abnErr = "Please enter only numbers.";
        } else if($scope.business.abn.length != 11) {
            $scope.business.abnErr = "Please type your 11 digit ABN without any spaces.";
        } else {
            $scope.business.abnErr = null;
        }
    }


    $scope.validate_bank_name = function() {
        if ($scope.business.bnkName == null || $scope.business.bnkName == undefined || $scope.business.bnkName == '') {
            $scope.business.bnkNameErr = "Please enter your bank name."
        } else {
            $scope.business.bnkNameErr = null
        }
    }


    $scope.validate_account_holder_name = function() {
        if ($scope.business.accHolderName == null || $scope.business.accHolderName == undefined || $scope.business.accHolderName == '') {
            $scope.business.accHolderNameErr = "Please enter the name associated with this account."
        } else {
            $scope.business.accHolderNameErr = null
        }
    }

    $scope.validate_bank_routing_number = function() {
        if ($scope.business.RoutingName == null || $scope.business.RoutingName == undefined || $scope.business.RoutingName == '') {
            $scope.business.RoutingErr = "Please enter your BSB without any spaces."
        }  else if (isNaN($scope.business.RoutingName)) {
            $scope.business.RoutingErr = "Please use numbers only; no dashes or spaces."
        } else if ($scope.business.RoutingName.length != 6) {
            $scope.business.RoutingErr = "Please enter a valid BSB."
        } else {
            $scope.business.RoutingErr = null
        }
    }

    $scope.validate_account_number = function() {
        if ($scope.business.accountNumber == null || $scope.business.accountNumber == undefined || $scope.business.accountNumber == '') {
            $scope.business.accountNumberErr = "Please enter your account number without spaces."
        } else if (isNaN($scope.business.accountNumber)) {
            $scope.business.accountNumberErr = "Please use numbers only; no dashes or spaces."
        } else if (7<$scope.business.accountNumber.length>10) {
            $scope.business.accountNumberErr = "Please enter a valid account number."
        } else {
            $scope.business.accountNumberErr = null
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

    var complete_registration_pop_up = function(event) {
        $mdDialog.show({
            templateUrl: 'static/templates/alertPopUp.html',
            clickOutsideToClose:true,
            // controller:'',
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
            locals:{
                "Message":"Thank you for registering your business with Avaana. A community manager will be in touch shortly to finalise your registration. In the meantime, be well, feel good and smile a lot :)",
                'type':false,
                "next_Step":"",
                "current_Step":"",
            }
        });
        $timeout(
            function(){
                $mdDialog.hide()
                apiService.getData('a_business_completion/' + localStorage.business_id + "/", {}, 'get').then(function(res) {
                    if(res.data.success==200)
                        $mdDialog.hide()
                })
        },5000)
    }





    $scope.acconutVerification = function() {
            $scope.validateABN()
            $scope.validate_bank_name()
            $scope.validate_account_holder_name()
            $scope.validate_bank_routing_number()
            $scope.validate_account_number()
            if ($scope.business.abnErr != null){
                focus_function('buss_number');
            }else if ($scope.business.bnkNameErr != null){
                focus_function('bank_name');
            }else if ($scope.business.accHolderNameErr != null){
                focus_function('acc_hold_name');
            }else if ($scope.business.RoutingErr != null){
                focus_function('_bsb');
            }else if ($scope.business.accountNumberErr != null){
                focus_function('acc_number');
            }else if ($scope.business.abnErr==null  && $scope.business.bnkNameErr == null && $scope.business.accHolderNameErr==null && $scope.business.accountNumberErr==null && $scope.business.RoutingErr == null) {
                spinnerService.show("html5spinner");
                data = {
                    first_name:$scope.business.contact_name,
                    business_address:{
                        city:$scope.business.city,
                        line1:$scope.business.address,
                        postal_code:$scope.business.postal_code,
                        state:$scope.business.state,
                        country:"AU"
                    },
                    external_account: {
                        object: "bank_account",
                        bank_name: $scope.business.bnkName,
                        account_number: $scope.business.accountNumber,
                        account_holder_name: $scope.business.accHolderName,
                        routing_number: $scope.business.RoutingName,
                        country: "AU",
                        currency: "aud",
                    },
                    business: localStorage.business_id,
                    business_abn: $scope.business.abn,
                    business_name:$scope.business.businessName,
                    business_email:$scope.business.email,
                    transfer_schedule:{
                        monthly_anchor:28,
                        interval:"monthly"
                    },
                }
                apiService.getData('a_step4/', data, 'post').then(function(success) {
                    console.log("Success..." + JSON.stringify(success.data))
                    if (success.data.status == 500) {
                        $scope.business.step4ApiErr = success.data.Message;
                    } else {
                        $scope.business.status.payment_card = false;
                        complete_registration_pop_up()
                    }
                    spinnerService.hide("html5spinner");
                }, function(error) {
                    spinnerService.hide("html5spinner");
                    console.log('Error:' + JSON.stringify(error));
                });
            }
        }
        /******** Ends Here ******/

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

        /***************** Please Assist Me **********************/
        $scope.assist_me = function(type){
            spinnerService.show("html5spinner");
            apiService.getData('a_assistme/', {"type":type,"id":$scope.business.step1Status}, 'post').then(function(success) {
                    if(success.data.status==200){
                        $scope.custom_dailog("Thank you for beginning listing your business on Avaana. A community manager will reach out shortly to help you complete your listing.")
                    }
                    spinnerService.hide("html5spinner");
            },function(error){
                spinnerService.hide("html5spinner");
            });
        }
        /***************************** Ends Here ****************/
        /******* Code to add Autocomplete on Address Field of Step 1******/
    var autocomplete;
    var componentForm = {
        locality: 'long_name', //Equals to City
        administrative_area_level_1: 'long_name', //Equals to State
        postal_code: 'short_name',
    };
    autocomplete = new google.maps.places.Autocomplete((document.getElementById('street_number')), {
        types: ['geocode'],
        componentRestrictions: {country: "au"}
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
            document.getElementById(component).value = '';
        }
        $scope.business.address = place['name']
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                if (addressType == "administrative_area_level_1") {
                    $scope.business.state = place.address_components[i][componentForm[addressType]];
                } else if (addressType == "postal_code") {
                    $scope.business.postal_code = place.address_components[i][componentForm[addressType]]
                } else if (addressType == "locality") {
                    $scope.business.city = place.address_components[i][componentForm[addressType]]
                }

            }
            document.getElementById("locality").focus()
        }
    }
})
