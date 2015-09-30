<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script type="text/javascript" src="<c:url value="/resources/js/angular/angular.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/resources/js/angular/angular-route.js"/>"></script>
    <link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/bootstrap/bootstrap.css"/>">
    <script type="text/javascript" src="<c:url value="/resources/js/bootstrap/bootstrap.min.js"/>"></script>
    <link rel="stylesheet" type="text/css" href="<c:url value="/resources/css/customstyles.css"/>">
    <script type="text/javascript" src="<c:url value="/resources/js/crud.js"/>"></script>
    <meta name="_csrf" content="${_csrf.token}"/>
    <meta name="_csrf_header" content="${_csrf.headerName}"/>
</head>
<body>
<div id="header">
    <%@ include file="header.jspf" %>
</div>
<br>
<br>
<br>
<br>
<br>

<div class="container">
    <div class="panel panel-default">
        <div class="panel-heading">
            <div class="panel-title">Your note</div>
        </div>
        <div class="panel-body" ng-app="crud">
            <div ng-controller="crudController">
                <form name="crudForm" novalidate>
                    <button class="btn btn-success" id="addNote" ng-click="crudForm.$valid && createNote()">Add note</button>
                    <button class="btn btn-warning" id="editNote" ng-disabled="currentNote==null" ng-click="crudForm.$valid && updateNote()">Save changes</button>
                    <button class="btn btn-info" id="switcherNote" style="float: right;">Show all notes</button>
                    <br>
                    <br>
                    <input hidden id="selectedNote"/>
                    <input hidden id="switcher" value="last"/>
                    <textarea class="form-control custom-control" id="noteText" rows="3" style="resize:vertical"
                              placeholder="Enter your note (maximum length 1000 characters)" ng-maxlength="1000" ng-model="textareaText" required></textarea>
                </form>
                <br>
                <br>
                <br>
                <table class="table table-striped table-bordered" id="noteTable">
                    <thead>
                    <tr>
                        <th>Note</th>
                        <th width="200">Date of modify</th>
                        <th width="50">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr ng-repeat="tmp in notes">
                        <td>{{ tmp.note }}</td>
                        <td>{{ tmp.dateTimeCreate |  date:'dd-MM-yyyy HH:mm:ss' }}</td>
                        <td><button class="btn-xs transparent" ng-click="deleteNote(tmp.id)"><span class="glyphicon glyphicon-remove"></span></button>
                        <button class="btn-xs transparent" ng-click="readNote(tmp.id)"><span class="glyphicon glyphicon-pencil"></span></button></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
</body>
</html>
