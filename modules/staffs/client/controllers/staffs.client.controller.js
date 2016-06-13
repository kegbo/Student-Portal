(function () {
  'use strict';

  // Staffs controller
  angular
    .module('staffs')
    .controller('StaffsController', StaffsController);

  StaffsController.$inject = ['$scope', '$filter','CoursesService','$state', 'Authentication', 'staffResolve'];

  function StaffsController ($scope,$filter,CoursesService,$state, Authentication, staff) {
    var vm = this;

    vm.authentication = Authentication;
    vm.staff = staff;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    //get staff courses object to get course title
    $scope.staffCourses = [];
    if(vm.staff.courses!= undefined){
    for ( var i = 0; i < vm.staff.courses.length; i++) { 
           $scope.staffCourses[i] = CoursesService.get({ courseId: vm.staff.courses[i] });
    }
  } 
    // Remove existing Staff
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        if($scope.staffCourses != undefined){

          for(var i = 0; i < $scope.staffCourses.length; i++){
          var index = $scope.staffCourses[i].staff.indexOf(vm.staff._id);
          $scope.staffCourses[i].staff.splice(index,1);
          var temp = $scope.staffCourses[i];
          var id = vm._id
          CoursesService.update({id:id},temp);
          }
        }
        vm.staff.$remove($state.go('staffs.list'));
      }
    }
    // Save Staff
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.staffForm');
        return false;
      }
   
      if (vm.staff._id) {
        vm.staff.$update(successCallback, errorCallback);
      } else {
        vm.staff.$save(successCallback, errorCallback);
      }
      function successCallback(res) {
        $state.go('staffs.view', {
          staffId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
