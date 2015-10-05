var mainModule = angular.module('mainModule', ['ngRoute']);

mainModule.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/notes', {
                controller: 'crudController',
                templateUrl: 'pages/notes'
            }).
            when('/registration',{
                controller: 'registrationController',
                templateUrl: 'pages/registration'
            }).
            when('/sign',{
                templateUrl: 'pages/sign'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);

mainModule.service('crudService',
    ['$http', function ($http) {

        this.getNotes = function (url) {
            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'MimeType': 'application/json; charset=utf-8'
                }
            });
        };

        this.createNote = function (note) {
            var json = {"note": note};
            return $http({
                method: 'POST',
                url: "notes/addNote",
                data: JSON.stringify(json),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'MimeType': 'application/json; charset=utf-8'
                }
            });
        };

        this.readNote = function (id) {
            var json = {"id": id};
            return $http({
                method: 'POST',
                url: "notes/getNote",
                data: JSON.stringify(json),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'MimeType': 'application/json; charset=utf-8'
                }
            })
        };

        this.updateNote = function (id,note) {
            var json = {"id": id, "note": note};
            return $http({
                method: 'PUT',
                url: "notes/editNote",
                data: JSON.stringify(json),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'MimeType': 'application/json; charset=utf-8'
                }
            })
        };

        this.deleteNote = function (id) {
            var json = {"id": id};
            return $http({
                method: 'DELETE',
                url: "notes/deleteNote",
                data: JSON.stringify(json),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'MimeType': 'application/json; charset=utf-8'
                }
            })
        };

    }]
);

mainModule.controller('crudController' ,['$scope','crudService','alertFactory',

    function ($scope, crudService,alertFactory) {

        $scope.notes;
        $scope.textareaText = "";
        $scope.currentNote = null;
        $scope.url = "notes/getLastNotes";
        $scope.name = 'Show all notes';
        getNotes();

        function getNotes() {
            crudService.getNotes($scope.url).success(function (notes) {
                $scope.notes = notes;
            }).error(function (jqXHR, textStatus, errorThrown) {
                alert("error: " +  errorThrown);
            });
        }

        $scope.createNote = function () {
            var note = $scope.textareaText;
            crudService.createNote(note).success(function (data) {
                if(data.status==="Ok"){
                    $scope.currentNote = null;
                    $scope.textareaText = null;
                    $scope.notes.unshift(data.object);
                    alertFactory.success("Note successfully added");
                }else{
                    alertFactory.error(data.errorMessage);
                }
            }).error(function (jqXHR, textStatus, errorThrown) {
                alert("error: " +  errorThrown);
            });
        };

        $scope.readNote = function (id) {
            crudService.readNote(id).success(function (data) {
                if(data.status==="Ok"){
                    $scope.textareaText = data.object.note;
                    $scope.currentNote = data.object.id;
                }else{
                    getNotes();
                    alertFactory.error(data.errorMessage);
                }
            }).error(function (jqXHR, textStatus, errorThrown) {
                alert("error: " +  errorThrown);
            });
        };

        $scope.updateNote = function () {
            var note = $scope.textareaText;
            var id = $scope.currentNote;
            crudService.updateNote(id,note).success(function (data) {
                $scope.textareaText = null;
                $scope.currentNote = null;
                if(data.status==="Ok"){
                    for (i in $scope.notes) {
                        if ($scope.notes[i].id == data.object.id) {
                            $scope.notes[i] = data.object;
                        }
                    }
                }else{
                    getNotes();
                    alertFactory.error(data.errorMessage);
                }

            }).error(function (jqXHR, textStatus, errorThrown) {
                alert("error: " +  errorThrown);
            });
        };

        $scope.deleteNote = function (id) {
            crudService.deleteNote(id).success(function (data) {
                $scope.textareaText = null;
                $scope.currentNote = null;
                if(data.status==="Ok"){
                    for (i in $scope.notes) {
                        if ($scope.notes[i].id == id) {
                            $scope.notes.splice(i, 1);
                        }
                    }
                }else{
                    getNotes();
                    alertFactory.error(data.errorMessage);
                }
            }).error(function (jqXHR, textStatus, errorThrown) {
                alert("error: " +  errorThrown);
            });
        };

        $scope.switcherNote = function(){
            if($scope.url === "notes/getAllNotes"){
                $scope.url = "notes/getLastNotes";
                $scope.name = "Show all notes";
            }else{
                $scope.name = "Show last notes";
                $scope.url = "notes/getAllNotes";
            }
            getNotes();
        }
    }
]);

mainModule.controller('scrollController',['$scope', '$location', '$anchorScroll',
    function ($scope, $location, $anchorScroll) {
        $scope.gotoNoteText = function() {
            $location.hash('top');
            $anchorScroll();
        };
}]);

mainModule.service('registrationService',
    ['$http', function ($http) {
        this.registrationUser = function (user) {
            return $http({
                method: 'POST',
                url: "registrationUser",
                data: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'MimeType': 'application/json; charset=utf-8'
                }
            });
        };
    }]
);

mainModule.controller('registrationController' ,['$scope','$location','registrationService', 'alertFactory',

    function ($scope, $location, registrationService,alertFactory) {

        $scope.username;
        $scope.password;
        $scope.confirmPassword;

        $scope.registrationUser = function () {
            var username = $scope.username;
            var password = $scope.password;
            var confirmPassword = $scope.confirmPassword;
            var user = {"username": username, "password":password, "confirmPassword": confirmPassword};
            registrationService.registrationUser(user).success(function (data) {
                if(data==="Ok"){
                    $location.path('/notes').replace();
                }else{
                    alertFactory.error(data);
                }
            }).error(function (jqXHR, textStatus, errorThrown) {
                alert("error: " +  errorThrown);
            });
        };
    }

]);

mainModule.factory('alertFactory', function() {
    return {
        status: null,
        message: null,
        success: function(msg) {
            this.status = 'success';
            this.message = msg;
        },
        error: function(msg) {
            this.status = 'danger';
            this.message = msg;
        },
        clear: function() {
            this.status = null;
            this.message = null;
        }
    }
});

mainModule.directive('alert', function() {
    return {
        restrict: 'E',
        scope: {},
        replace: true,
        controller: function($scope, alertFactory) {
            $scope.show = false;
            $scope.api = alertFactory;

            $scope.$watch('api.status', toggledisplay)
            $scope.$watch('api.message', toggledisplay)

            $scope.hide = function() {
                $scope.show = false;
                $scope.api.clear();
            };

            function toggledisplay() {
                $scope.show = !!($scope.api.status && $scope.api.message);
            }
        },
        template: '<div class="alert alert-{{api.status}}" ng-show="show">' +
        '  <button type="button" class="close" ng-click="hide()">&times;</button>' +
        '  {{api.message}}' +
        '</div>'
    }
});











