var mainModule = angular.module('mainModule', ['ngRoute']);

mainModule.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/', {
            controller: 'crudController',
            templateUrl: '/notes'
        }).otherwise({redirectTo: '/'});
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

mainModule.controller('crudController' ,['$scope','crudService',

    function ($scope, crudService) {

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

            });
        }

        $scope.createNote = function () {
            var note = $scope.textareaText;
            crudService.createNote(note).success(function (data) {
                $scope.currentNote = null;
                $scope.textareaText = null;
                $scope.notes.unshift(data);
            }).error(function (jqXHR, textStatus, errorThrown) {

            });
        };

        $scope.readNote = function (id) {
            crudService.readNote(id).success(function (data) {
                $scope.textareaText = data.note;
                $scope.currentNote = data.id;
            }).error(function (jqXHR, textStatus, errorThrown) {

            });
        };

        $scope.updateNote = function () {
            var note = $scope.textareaText;
            var id = $scope.currentNote;
            crudService.updateNote(id,note).success(function (data) {
                $scope.textareaText = null;
                $scope.currentNote = null;
                for (i in $scope.notes) {
                    if ($scope.notes[i].id == data.id) {
                        $scope.notes[i] = data;
                    }
                }
            }).error(function (jqXHR, textStatus, errorThrown) {

            });
        };

        $scope.deleteNote = function (id) {
            crudService.deleteNote(id).success(function (data) {
                $scope.textareaText = null;
                $scope.currentNote = null;
                for (i in $scope.notes) {
                    if ($scope.notes[i].id == id) {
                        $scope.notes.splice(i, 1);
                    }
                }
            }).error(function (jqXHR, textStatus, errorThrown) {

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








