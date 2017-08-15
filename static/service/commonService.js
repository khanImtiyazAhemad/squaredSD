angular.module("squaredSDService",[]).service("apiService", function($q, $http, apiUrl) {
    this.getData = function(endpoint1, data, methodType) {
        var defer = $q.defer();
        var httpOptions = {
            url: apiUrl + endpoint1,
            method: methodType,
            data: data,
            Accept: 'application/json',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        $http(httpOptions).then(function(response) {
            defer.resolve(response);
        }, function(err) {
            defer.reject(err);
        });
        return defer.promise;
    }
    this.getDataWithToken = function(endpoint1, data, methodType) {
        var defer = $q.defer();
        var httpOptions = {
            url: apiUrl + endpoint1,
            method: methodType,
            data: data,
            Accept: 'application/json',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + localStorage.auth_token
            }
        };
        $http(httpOptions).then(function(response) {
            defer.resolve(response);
        }, function(err) {
            defer.reject(err);
        });
        return defer.promise;
    }


})
