angular.module("avaanaController").controller("blogDetailCtrl", function($state,spinnerService,apiService,$scope,$stateParams) {
spinnerService.show("html5spinner");
$scope.blog_details={}
apiService.getData('a_indiviual_blog/'+$stateParams.blog_slug+"/", {}, 'get').then(function(success) {
        if (success.data.status == 200) {
            $scope.blog_details.blog_data = success.data.blog_detail
        }
        spinnerService.hide("html5spinner");
    }, function(error) {
    	spinnerService.hide("html5spinner");
    });

apiService.getData('a_blog_all_category/', {}, 'get').then(function(success) {
        console.log("success.data.blog_category"+JSON.stringify(success.data.blog_category))
        if (success.data.status == 200) {
            $scope.blog_all_category = success.data.blog_category
        }
    }, function(error) {
    });


	$scope.providerPage = function(business_slug,subhurb) {
        $state.go('app.provider', {
            "provider_name": business_slug,
            "subhurb":subhurb.replace(' ', '-'),
        });
    }

    $scope.blogClick = function(tag) {
        $state.go('app.blog',{
            "tag":tag.replace(' ','-')
        })
    }

    // $scope.categoryClick = function(category){
    //     apiService.getData('a_blog/'+category+'/', {}, 'get').then(function(success) {
    //         if (success.data.status == 200) {
    //             $scope.blog.blog_data = success.data.blog_detail
    //         }
    //     }, function(error) {
    //     });
    // }
});