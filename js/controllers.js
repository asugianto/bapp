'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('BoggleCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

      var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      //var alphabet = ["A", "A", "C"];
      var initial = [
            { col: ['', '', '', ''] },
            { col: ['', '', '', ''] },
            { col: ['', '', '', ''] },
            { col: ['', '', '', ''] }
      ];


      $scope.test = "test";
      $scope.initialBoard = generateRandomizedBoard(alphabet);
      $scope.submittedWord = "";
      $scope.wordsInputted = [];
      $scope.totalPoints = 0;
      $scope.invalidInput = false;

      $scope.minute = 0;
      $scope.timer = 180; //3 minutes
      $scope.second = 0;
      

      startTimer();

      function generateRandomizedBoard(alphabet) {


          for (var i = 0; i < 16; i++) {
              var randomLetter = alphabet[Math.floor((Math.random() * 25) + 1)];

              //check if it has the same letter on duplicates
              if (checkDuplicates(randomLetter, i)) {
                  if (i > 0) {
                      i--;
                  }
                  else {
                      i = 0;
                  }
              }
              else {
                  //push data to two dimensional array
                  for (var j = 0; j < initial.length; j++) {
                      var duplicate = false;
                      for (var k = 0; k < initial[j].col.length; k++) {
                          console.log(initial[j].col.length);
                          if (initial[j].col[k] == '') {
                              initial[j].col[k] = randomLetter;
                              duplicate = true;
                              break;
                          }

                      }
                      if (duplicate) {
                          break;
                      }
                  }
              }
              //console.log(initial);
          }

          return initial;
      }

      function checkDuplicates(randomLetter, i) {

          for (var j = 0; j < initial.length; j++) {
              for (var k = 0; k < initial[j].col.length; k++) {
                  if (initial[j].col[k] == randomLetter) {
                      return true;
                  }
              }
          }

          return false;
      }

      $scope.submitWord = function () {
          //check if every letter within array
          var submittedWord = $scope.submittedWord;
          var validWordLength = 0;

          if (submittedWord.length > 0 && $scope.timer > 0) {
              for (var i = 0; i < submittedWord.length; i++) {
                  for (var j = 0; j < initial.length; j++) {
                      var skipWord = false;
                      for (var k = 0; k < initial[j].col.length; k++) {
                          if (submittedWord[i] == initial[j].col[k]) {
                              validWordLength++;
                              skipWord = true;
                              break;
                          }
                      }
                      if (skipWord) {
                          break;
                      }
                      else {
                          $scope.invalidInput = true;
                      }
                  }
              }

              if (validWordLength > 2 && (validWordLength == submittedWord.length) /*&& checkAdjacent(submittedWord)*/) {
                  calculatePoints(submittedWord, validWordLength)
              }
              else {
                  console.log('invalidInput');
                  $scope.invalidInput = true;
              }
              $scope.invalidInput = false;
          }
          else {
              $scope.invalidInput = true;
          }

          $scope.submittedWord = "";
      }

      function checkAdjacent(submittedWord) {
          var xAxis = 0;
          var yAxis = 0;
          var letterFound = false;
          for (var i = 0; i < submittedWord.length; i++) {
              for (var j = 0; j < initial.length; j++) {
                  for (var k = 0; k < initial[j].col.length; k++) {
                      if (submittedWord[i] == initial[j].col[k]) {
                          xAxis = [j];
                          yAxis = [k];

                          letterFound = true;
                          break;
                      }
                  }
                  if (letterFound) {
                      break;
                  }
              }

              if (letterFound) {

                  if (submittedWord[i] == initial[yAxis+1].col[xAxis] ||
                      submittedWord[i] == initial[yAxis-1].col[xAxis] ||
                      submittedWord[i] == initial[yAxis].col[xAxis+1] ||
                      submittedWord[i] == initial[yAxis].col[xAxis-1] ||
                      submittedWord[i] == initial[yAxis+1].col[xAxis+1] ||
                      submittedWord[i] == initial[yAxis+1].col[xAxis-1]) {
                      return true;
                  }
                  //function to check adjacent
              }
          }
          return true;
      }
      function calculatePoints(submittedWord, validWordLength) {
          console.log(validWordLength);
          var points = 0;
          if (validWordLength < 5) {
              points = 1;
          }
          else if (validWordLength < 6) {
              points = 2;
          }
          else if (validWordLength < 7) {
              points = 3;
          }
          else if (validWordLength < 8) {
              points = 5;
          }
          else {
              points = 11;
          }

          $scope.totalPoints += points;
          $scope.wordsInputted.push({ word: submittedWord, points: points });
      }

      function startTimer() {

          var countDown = setInterval(function () {
             
              $scope.timer--;
              $scope.$apply();
              $scope.minute = Math.floor($scope.timer / 60) % 60;
              $scope.second = $scope.timer % 60;        

              if ($scope.timer <= 0) {
                  clearInterval(countDown);
              }
          }, 1000);
         
      }
          
  }]);