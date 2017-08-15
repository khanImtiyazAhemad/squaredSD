angular.module("avaanaController").controller("blogCtrl", function(spinnerService,apiService, $scope, $state, $stateParams) {
    $scope.blog = {}
    spinnerService.show("html5spinner");
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $scope.blog.blogDetails = function(blog) {
        $state.go('app.blogDetail',{
            blog_slug : blog.slug
        })
    }
    $scope.blog.subscriptionActive = true;
    if($stateParams.tag){
        // $stateParams.tag = $stateParams.tag.replace('-',' ')
        action = 'a_blog/'+$stateParams.tag+'/'
    }else{
        action = 'a_blog/'
    }
    apiService.getData(action, {}, 'get').then(function(success) {
        console.log(JSON.stringify(success.data))
        if (success.data.status == 200) {
            $scope.blog.blog_data = success.data.blog_detail
        }
        spinnerService.hide("html5spinner");
    }, function(error) {
        spinnerService.hide("html5spinner");
    });


    $scope.categoryClick = function(category){
        // apiService.getData('a_blog/'+category+'/', {}, 'get').then(function(success) {
        //     if (success.data.status == 200) {
        //         $scope.blog.blog_data = success.data.blog_detail
        //     }
        // }, function(error) {
        // });
        $state.go('app.blog',{
            "tag":category.replace(' ','-')
        })
    }

    apiService.getData('a_blog_all_category/', {}, 'get').then(function(success) {
        console.log("success.data.blog_category"+JSON.stringify(success.data.blog_category))
        if (success.data.status == 200) {
            $scope.blog_all_category = success.data.blog_category
        }
    }, function(error) {
    });

    $scope.blog.emailValidation = function() {
        if ($scope.blog.email == '' || $scope.blog.email == undefined || $scope.blog.email == null) {
            $scope.blog.emailErr = "Please enter a valid email.";
        } else if (!emailRegex.test($scope.blog.email)) {
            $scope.blog.emailErr = "Please enter a valid email.";
        } else {
            $scope.blog.emailErr = null;
        }
    }
    $scope.blog.emailRegistration = function() {
        $scope.blog.emailValidation()
        console.log($scope.blog.emailErr)
        if ($scope.blog.emailErr == null) {
            data = {
                subscriber_email: $scope.blog.email
            }
            apiService.getData('a_subscriber_request/', data, 'post').then(function(success) {
                if (success.data.status == 200) {
                        $scope.blog.subscriptionActive = false
                        $scope.apiMessage = success.data.Message
                }
            }, function(error) {
            });
        }
    }
    $scope.providerPage = function(business_slug,subhurb) {
        $state.go('app.provider', {
            "provider_name": business_slug,
            "subhurb":subhurb.replace(' ', '-'),
        });
    }

    
});