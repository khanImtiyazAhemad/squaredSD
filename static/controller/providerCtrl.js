angular.module("avaanaController").controller("providerCtrl", function(spinnerService, $scope, $window, $stateParams, apiService, $state, $rootScope, $sce, $mdDialog, $filter, $uibModal) {
    spinnerService.show("html5spinner");
    $scope.provider = {
        serviceOpen: false,
        staffOpen: false,
        socialFieldOpen: false,
        sayingOpen: false
    }
    $scope.Math = Math
    $scope.compare_date = new Date()
    apiService.getData('a_get_provide_business/' + $stateParams.provider_name + "/", {}, 'get').then(function(success) {
        if (success.data.status == 200) {
            $scope.provider.business_name = success.data.Business_data.name;
            $scope.provider.name = success.data.Business_data.name;
            $scope.provider.profile = success.data.Business_data.business_detail.business_profile;
            $scope.provider.logo_image = success.data.Business_data.business_detail.correct_image;
            $scope.provider.locality = success.data.Business_data.business_location.address;
            $scope.provider.city = success.data.Business_data.business_location.city + ",  " + success.data.Business_data.business_location.state;
            $scope.provider.postal_code = success.data.Business_data.business_location.postal_code;
            $scope.lat = success.data.Business_data.business_location.lat;
            $scope.lng = success.data.Business_data.business_location.lng;
            $scope.provider.website = success.data.Business_data.website;
            $scope.provider.email = success.data.Business_data.email;
            $scope.BusinessTiming = success.data.Business_data.business_days
            $scope.BusinessPractitioner = success.data.Business_data.business_practitioner
            $scope.BusinessService = success.data.Business_data.business_service;
            $scope.service_images = success.data.Business_data.business_service_typeArray;
            $scope.business_rating = success.data.Business_data.business_rating;
            $scope.business_score = success.data.Business_data.business_score;
            $scope.business_review = success.data.Business_data.business_review;
            $scope.business_slug = success.data.Business_data.slug;
            for (var i = 0; i < success.data.Business_data.business_photos.length; i++) {
                $scope.addSlide(success.data.Business_data.business_photos[i]);
                $scope.imageyou = success.data.Business_data.business_photos[i].correct_image
            }
            spinnerService.hide("html5spinner");
            for (var i = 0; i < $scope.BusinessPractitioner.length; i++) {
                $scope.BusinessPractitioner[i].style = false;
                if ($scope.BusinessPractitioner.length % 2 == 0) {
                    if ($scope.BusinessPractitioner.length - 1 == i) {
                        $scope.BusinessPractitioner[i].style = true;
                        $scope.BusinessPractitioner[i - 1].style = true;
                    }
                } else {
                    if ($scope.BusinessPractitioner.length - 1 == i) {
                        $scope.BusinessPractitioner[i].style = true;
                    }
                }
            }
        } else {
            spinnerService.hide("html5spinner");
        }
    }).then(function(error) {
        spinnerService.hide("html5spinner");
    })

    $scope.provider.serviceToggle = function() {
        $scope.provider.serviceOpen = !$scope.provider.serviceOpen;
    }
    $scope.provider.staffToggle = function() {
        $scope.provider.staffOpen = !$scope.provider.staffOpen;
    }
    $scope.provider.socialToggle = function() {
        $scope.provider.socialFieldOpen = !$scope.provider.socialFieldOpen;
    }
    $scope.provider.sayingToggle = function() {
        $scope.provider.sayingOpen = !$scope.provider.sayingOpen;
    }
    $scope.provider.bookingClick = function(service_id) {
        $state.go('app.booking', {
            "key": service_id,
            "slug": $scope.business_slug,
            "date": $filter('date')(new Date(), 'yyyy-MM-dd')
        })
    }
    $scope.provider.buyClick = function(service_id) {
        localStorage.setItem('event_detail', JSON.stringify({
            "startTime": null,
            "endTime": null,
            "eventDate": null,
            "pracName": null,
            "practitioner_id": null,
            "event_yr": null,
            "cancel_date": null,
        }));
        $state.go('app.payment', {
            "key": service_id,
            "slug": $scope.business_slug,
            "date": null
        })
    }
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var slides = $scope.slides = [];
    var currIndex = 0;

    function getId(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return 'error';
        }
    }


    $scope.addSlide = function(image) {
        if (image.type_of_url == 'Video') {
            image.correct_image = "http://www.youtube.com/embed/" + getId(image.correct_image)
        }
        slides.push({
            image: $sce.trustAsResourceUrl(image.correct_image),
            id: currIndex++,
            type: image.type_of_url,
        });
    };
    //*******************MAp DIALOG***********

    $scope.provider.hoverIn = function(indx) {
        $scope.hoverImage = true;
        $scope.catNameImg = indx.category_image_name;
        console.log(JSON.stringify($scope.catNameImg));

    }
    $scope.provider.hoverOut = function(indx) {
        $scope.hoverImage = false;

    }


    $scope.showAdvanced = function(ev) {
        $scope.location = {
            lat: $scope.lat,
            lng: $scope.lng,
            bussi: $scope.provider.business_name,
            add: $scope.provider.locality,
            city: $scope.provider.city,
            postal: $scope.provider.postal_code
        }
        $scope.photoModel = $uibModal.open({
            templateUrl: 'static/templates/Auto_map.html',
            controller: 'mapCtrl',
            scope: $scope
        });
    };


    $scope.showProfileClick = function(ev, practitioner) {
        $mdDialog.show({
            controller: "staffProfileCtrl",
            templateUrl: 'static/templates/staffProfile.html',
            clickOutsideToClose: true,
            locals: {
                practitioner: practitioner,
                business_timing: $scope.BusinessTiming
            },
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    };

    function MapDialogController($scope, $rootScope, $mdDialog) {
        $scope.mapUrl = $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/place?key=AIzaSyBrZGfNWINENlWlFAsKN-nYaO5TDx4W7hs&q=" + $rootScope.latti + "," + $rootScope.longi + "&zoom=12");
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }
});