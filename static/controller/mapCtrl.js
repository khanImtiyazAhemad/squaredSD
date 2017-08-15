angular.module('avaanaController').controller('mapCtrl', function($scope, $rootScope, $mdDialog, $sce, $uibModalInstance, $timeout) {

    // $scope.mapUrl = $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/place?key=AIzaSyBrZGfNWINENlWlFAsKN-nYaO5TDx4W7hs&q=" + $scope.location.lat + "," + $scope.location.lng + "&zoom=8");
    console.log($scope.location)
    var ad = $scope.location.address ? $scope.location.address : $scope.location.add;
    var postal = $scope.location.postal_code ? $scope.location.postal_code : $scope.location.postal
    var state = $scope.location.state ? $scope.location.state : '';
    $timeout(function() {
        var myCenter = new google.maps.LatLng($scope.location.lat, $scope.location.lng);
        var mapCanvas = document.getElementById("map");
        var mapOptions = {
            center: myCenter,
            zoom: 16
        };

        var map = new google.maps.Map(mapCanvas, mapOptions);

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng($scope.location.lat, $scope.location.lng)
        });
        marker.setMap(map);
        google.maps.event.addListener(marker, 'click', function() {

            var infowindow = new google.maps.InfoWindow({
                /*$scope.location.business+" "+*/
                content: ad + " , " + $scope.location.city + " " + state
                    //content: ad
            });
            infowindow.open(map, marker);
            console.log($scope.location);
        });
    }, 1000)


    $scope.closepopUp = function() {
        $uibModalInstance.dismiss('cancel')
    }
});