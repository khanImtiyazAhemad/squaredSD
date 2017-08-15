angular.module("avaanaController").controller("searchResultCtrl", function(spinnerService, $scope, $state, authService, apiService, $mdDialog, $filter, $stateParams, $uibModal, $timeout) {
    var search_data = localStorage.getItem('search_obj')
    $stateParams.location = $stateParams.location.replace('-', ' ')
    $stateParams.service = $stateParams.service.replace('-', ' ')
    console.log($stateParams)
    $scope.firstTimeLocation = $stateParams.location;
    search_obj = JSON.parse(search_data)
    $scope.firstTime = true;

    $scope.count_change = 0;
    spinnerService.show("html5spinner");
    $scope.search = {}
    $scope.Math = Math
    var searcRequestData = {
        service: [$stateParams.service.replace('-', ' ')],
        cal_date: search_obj.cal_date ? search_obj.cal_date : null,
        locObj: search_obj.locObj != undefined ? [search_obj.locObj] : 0,
        min_price: null,
        max_price: null,
        serviceTimel: null
    }
    api_hit(searcRequestData)
    apiService.getData('a_get_service_cat/', {}, 'get').then(function(res) {
        $scope.ServiceResponse = {
            services: res.data.avaana_categories
        }
    })

    $scope.businesspage = function(data) {
        $state.go('app.provider', {
            "provider_name": data.slug,
            "subhurb":data.business_location.city.replace(' ', '-'),
        });
    }
    $scope.locationAccessDenied = true;
    navigator.permissions && navigator.permissions.query({
        name: 'geolocation'
    }).then(function(PermissionStatus) {
        if (PermissionStatus.state == 'granted') {
            $scope.locationAccessDenied = false;
        } else {
            $scope.locationAccessDenied = true;
        }
    })
    $scope.showMoreData = [];
    $scope.dataCount = 0;

    function api_hit(searcRequestData) {
        apiService.getData('a_search_result/', searcRequestData, "post").then(function(success) {
            if (success.data.status != 500) {
                $scope.search.allSearchData = success.data.search_data
                $scope.showMoreData = $scope.search.allSearchData
                $scope.slickDisp = true
                $scope.allLocation = []
                $scope.allLocation = success.data.NearSubHurbs
                $scope.searching_city = success.data.searching_city;

                // searcRequestData
                searcRequestData.locObj.forEach(function(loc_obj) {
                    inside_sevice_nearSubhurbs = false
                    $scope.allLocation.forEach(function(location) {
                        if (loc_obj['city'] == location['city']) {
                            inside_sevice_nearSubhurbs = true
                        }
                    })
                    if (!inside_sevice_nearSubhurbs) {
                        $scope.allLocation.push(loc_obj)
                    }
                })

                $timeout(function() {
                    $scope.search.locationName = $scope.searching_city
                }, 200);

            } else {
                $timeout($scope.obj.failureErr = "Oops, unknown search error.", 500);
            }
            $scope.showAllData = true;
            spinnerService.hide("html5spinner");
        }, function(error) {
            spinnerService.hide("html5spinner");
        });
    }


    $scope.myPagingFunction = function() {
        // console.log($scope.showMoreData);
        if ($scope.search.allSearchData.length != $scope.showMoreData.length && $scope.search.allSearchData.length > $scope.showMoreData.length) {
            spinnerService.show("html5spinner");
            length = $scope.search.allSearchData.length >= 2 ? 2 : 1
            for (var i = $scope.showMoreData.length; i < $scope.search.allSearchData.length; i++) {
                $scope.showMoreData.push($scope.search.allSearchData[i]);

            }
            $timeout(function() {
                spinnerService.hide("html5spinner");
            }, 2000)

        }

    };
    $scope.search.buyNow = function(details, slug) {
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
            "key": details.id,
            "slug": slug,
            "date": null
        })
    }


    $scope.search.bookNow = function(details, slug) {
            $state.go('app.booking', {
                "key": details.id,
                "slug": slug,
                "date": search_obj.cal_date
            })
        }
        //MAp DIALOG
    $scope.showAdvanced = function(ev, loc) {
        $scope.location = loc
        $scope.photoModel = $uibModal.open({
            templateUrl: 'static/templates/Auto_map.html',
            controller: 'mapCtrl',
            scope: $scope
        });
    };

    $scope.search.calenderDate = function() {
        searcRequestData.cal_date = $filter('date')($scope.search.cal_date, 'yyyy-MM-dd');
    }
    $scope.search.minimumPrice = function() {
        if (parseInt($scope.search.min_price) > parseInt($scope.search.max_price)) {
            $scope.PriceErr = "Minimum price should be lower than maximum price."
            return;
        } else {
            $scope.PriceErr = null
        }
        searcRequestData.min_price = $scope.search.min_price;
    }
    $scope.search.maximumPrice = function() {
        if (parseInt($scope.search.min_price) > parseInt($scope.search.max_price)) {
            $scope.PriceErr = "Maximum price should be higher than maximum price."
            return;
        } else {
            $scope.PriceErr = null
        }
        searcRequestData.max_price = $scope.search.max_price;
    }

    $scope.changeLocation = function(e) {


        if ($scope.count_change > e) {
            $scope.firstTime = false;
        }
        $scope.count_change++;
        // if ($scope.search.locationName.length == 0) {
        //     $scope.LocationErr = "Please select a location."
        // } else {
        //     $scope.LocationErr = null
        // }
    }

    $scope.changeService = function() {
        if ($scope.search.service_name.length == 0) {
            $scope.ServiceErr = "Please select one or more services or categories."
        } else {
            $scope.ServiceErr = null
        }
    }

    $scope.creatingValue = function(loc) {
        return {
            "city": loc.city,
            "state": loc.state,
            'postal_code': loc.postal_code,
            "Loclat": loc.Loclat,
            "Loclng": loc.Loclng,
        }
    }

    $scope.priceFliter = function(data) {
        console.log(data)
    }

    $scope.search.updateSearch = function() {
        spinnerService.show("html5spinner");
        $('.res_up_serch').hide()
        for (var i = 0; i < $scope.search.location.length; i++) {
            $('#' + $scope.search.location[i]).show();
        }
        console.log($scope.search.max_price, $scope.search.min_price)

        $('.price-ul-row').each(function() {
            var prcId = $(this).attr('id');
            console.log(prcId)
            if (prcId != undefined) {
                console.log(Number(prcId.split('prc')[1]), Number($scope.search.max_price))
                console.log(Number(prcId.split('prc')[1]) > Number($scope.search.max_price))
                if (Number(prcId.split('prc')[1]) != undefined) {
                    if (Number(prcId.split('prc')[1]) <= Number($scope.search.min_price) || Number(prcId.split('prc')[1]) >= Number($scope.search.max_price)) {
                        //$('.price-ul-row').hide();
                        $('#' + prcId).hide();
                    }
                }
            }
        })
        if ($scope.ServiceErr != null || $scope.LocationErr != null || $scope.PriceErr != null) {
            $scope.updateErr = "Please correct the above errors."
            return;
        } else {
            $scope.updateErr = null
        }
        searcRequestData.service = $scope.search.service_name;
        location_Array_obj = []
        $scope.allLocation.forEach(function(location) {
            if ($scope.search.locationName.includes(location['city'])) {
                location_Array_obj.push(location)
            }
        })
        searcRequestData.locObj = location_Array_obj;
        // api_hit(searcRequestData)
        spinnerService.hide("html5spinner");
    }

    $scope.search.updateSearch_im = function() {
        spinnerService.show("html5spinner");
        console.log($scope.search.allSearchData.length)
        $scope.slickDisp = false
        $scope.updateSearchData = []
        // $scope.business_Array = []
        $scope.showMoreData.forEach(function(obj) {
            if ($scope.search.location.includes(obj['business_location']['city'])) {
                $scope.updateSearchData.push(obj)
                // $scope.business_Array.push(obj.id)
            }
        })
        $scope.showMoreData = $scope.updateSearchData
        if($scope.search.min_price!=undefined && $scope.search.max_price!=undefined && $scope.PriceErr==null){
            $scope.updateSearchData = []
           $scope.showMoreData.forEach(function(obj) {
                obj.business_service.forEach(function(object) {
                    if($scope.search.min_price < object.price && object.price < $scope.search.max_price){
                        $scope.updateSearchData.push(obj)
                        // $scope.business_Array.push(obj.id)
                    }
                })
            })
            $scope.showMoreData = $scope.updateSearchData 
        }
        console.log($scope.search.serviceTimel)
        if($scope.search.serviceTimel!=undefined){
            $scope.updateSearchData = []
           $scope.showMoreData.forEach(function(obj) {
                obj.business_service.forEach(function(object) {
                    if($scope.search.serviceTimel.includes($filter('timeformat')(object.length_of_service))){
                        $scope.updateSearchData.push(obj)
                        // $scope.business_Array.push(obj.id)
                    }
                })
            })
            $scope.showMoreData = $scope.updateSearchData 
        }
        
        $timeout(function() {
            $scope.slickDisp = true
            spinnerService.hide("html5spinner")
        }, 100)
        
    }
    if ($stateParams.service) {
        $scope.search.service_name = [$stateParams.service]
        $timeout(function() {
            $('#category-bar input[type="search"]:eq(0)').val($stateParams.service)
        }, 2000)
    }
    if ($stateParams.location) {
        // var city_Array = []
        // $scope.app.allLocation.distinctCities.forEach(function(obj){
        //     city_Array.push(obj.city)
        // })
        // if(!city_Array.includes(search_obj.locObj.city)){
             
        // }

        // $scope.app.allLocation.distinctCities.push({
        //         "city": search_obj.locObj.city,
        //         "state": search_obj.locObj.state,
        //         "post_code":search_obj.locObj.post_code,
        //         "lat": search_obj.locObj.Loclat,
        //         "lng": search_obj.locObj.Loclng
        //     })
        $timeout(function() {
            $('#location-bar-4 input[type="search"]:eq(0)').val($stateParams.location+", "+search_obj.locObj.state)
            $('#location-bar-5 input[type="search"]:eq(0)').val($stateParams.location+", "+search_obj.locObj.state)
        }, 2000)
    }
    if (search_obj.cal_date) {
        $scope.app.SearchDate = new Date(search_obj.cal_date)
        $scope.search.cal_date = new Date(search_obj.cal_date);
    }

})