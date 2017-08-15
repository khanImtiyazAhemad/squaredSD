angular.module("squaredSDController", []).controller("appCtrl", function($scope,apiService,$mdDialog, $state) {
    $scope.app = {}

    $scope.$on("loggedIn", function(event, data) {
        user_detail_data = localStorage.getItem('UserObject')
        if (user_detail_data != null) {
            user_detail = JSON.parse(user_detail_data)
            $scope.app.isLogin = true;
            $scope.app.EmailID = user_detail.email;
            $scope.app.name = user_detail.first_name;
        }
    })
    $scope.logout = function() {
        $scope.app.isLogin = false;
        localStorage.loginType = "none";
        localStorage.removeItem('auth_token');
        localStorage.removeItem('userId');
        localStorage.removeItem('UserObject')
        localStorage.userId = null
        $state.go("app.home");
    }

    if (localStorage.auth_token) {
        user_detail = JSON.parse(localStorage.getItem('UserObject'))
        if (user_detail) {
            $scope.app.isLogin = true;
            $scope.app.EmailID = user_detail.email;
            $scope.app.name = user_detail.first_name;
        }

    }

    $scope.login = function(page_name) {
        $mdDialog.show({
            templateUrl: 'static/templates/newlogin.html',
            controller: 'loginCtrl',
            locals: {
                page: '',
            },
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
    }
    
});

