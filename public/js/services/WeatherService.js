angular.module('WeatherService', []).factory('Search', ['$http', function($http) {

    return {
        // call to get all nerds
        get : function() {
            return $http.get('/api/search');
        }
    }

}]);
