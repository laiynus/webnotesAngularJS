var crud = angular.module('crud', ['ngRoute']);

crud.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/', {
            controller: 'crudController',
            templateUrl: '/notes'
        }).otherwise({redirectTo: '/'});
    }
]);

angular.module('crud').service('crudService',
    ['$http', function ($http) {

        this.getNotes = function () {
            return $http({
                method: 'GET',
                url: "notes/getLastNotes",
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

angular.module('crud').controller('crudController', ['$scope', 'crudService',
    function ($scope, crudService) {

        $scope.notes;
        $scope.textareaText = "";
        $scope.currentNote = null;

        getNotes();

        function getNotes() {
            crudService.getNotes().success(function (notes) {
                $scope.notes = notes;
            }).error(function (error) {

            });
        }

        $scope.createNote = function () {
            var note = $scope.textareaText;
            crudService.createNote(note).success(function (data) {
                $scope.currentNote = null;
                $scope.textareaText = null;
                $scope.notes.unshift(data);
            }).error(function (error) {

            });
        };

        $scope.readNote = function (id) {
            crudService.readNote(id).success(function (data) {
                $scope.textareaText = data.note;
                $scope.currentNote = data.id;
            }).error(function (error) {

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
            }).error(function (error) {

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
            }).error(function (error) {

            });
        };
    }
]);







