angular.module("avaanaController").controller("photo_Ctrl", function(spinnerService, apiService, $scope, $uibModal) {

    $scope.closepopUp=function(){
        $scope.$close();
    }

    var videoRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    $scope.typeInfo = {};
    $scope.validateVideoLink = function() {
        if($scope.typeInfo.myVideo == '' || $scope.typeInfo.myVideo == undefined || $scope.typeInfo.myVideo == null) {
            $scope.videoLinkErr = null;
        } else if(!videoRegex.test($scope.typeInfo.myVideo)) {
            $scope.videoLinkErr = "Please enter a valid url.";
        } else {
            $scope.videoLinkErr = null;
            $scope.cropperImageErr = null;
            if($scope.type == "photo") {
                $scope.$emit("photoChoosen", {
                    img: $scope.typeInfo.myVideo,
                    name: $scope.typeInfo.video_Name,
                    type:"Video"
                })
            }

            $scope.$close();

        }
    }
    var image_ext =  /\.(gif|jpg|jpeg|png)$/i;
    $scope.validateImg=function() {
        if($scope.myImage == null || $scope.myImage == undefined || $scope.myImage == "") {
            if($scope.type == "logo" || $scope.type == "photo" || $scope.type == "practitioner_logo"){
                $scope.cropperImageErr = "Please select a valid image."
            }else{
                $scope.cropperImageErr = "Please select a valid image or provide a video link."
            }
        } else if(!image_ext.test(document.getElementById('fileInput').value)){
            $scope.cropperImageErr = "Please select a valid image."
        }else {
             var image_name = document.getElementById('fileInput').value.split(/^.*[\\\/]/);
            $scope.cropperImageErr = null;
            if($scope.type == "photo") {
                $scope.$emit("photoChoosen", {
                    img: $scope.myImage,
                    name: image_name[(image_name.length)-1],
                    type:"Image"
                })
            } else if($scope.type == "logo") {
                $scope.$emit("logoChoosen", {
                    img: $scope.myImage,
                    name: image_name[(image_name.length)-1]
                })
            } else if($scope.type == "practitioner_logo") {
                $scope.$emit("practitionerlogoChoosen", {
                    img: $scope.myCroppedImage,
                    name: image_name[(image_name.length)-1]
                })
            }
            $scope.$close();
        }
    }
    $scope.doneClick = function(Video,Image) {
        console.log($scope.type)
        if($scope.type == "logo"){
            $scope.validateImg();
            return;
        }
        if(Image != undefined && Image != '' && Image != null) {
            $scope.validateImg();
        }else if(Video!=undefined || Video != '') {
            $scope.validateVideoLink();
        }
    }
})