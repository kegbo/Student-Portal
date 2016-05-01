(function () {
  'use strict';

  angular
    .module('staff',['courses'])
    .controller('StaffController', StaffController);

  StaffController.$inject = ['$scope', '$state', 'staffResolve', 'Authentication', 'CoursesService'];

  function StaffController($scope, $state, staff, Authentication, CoursesService) {
    var vm = this;

    vm.staff = staff;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.allcourses = CoursesService.query();
    


   
  
    // Remove existing Staff
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.staff.$remove($state.go('staff.list'));
      }
    }

    // Save Staff
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.staffForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.staff._id) {
        vm.staff.$update(successCallback, errorCallback);
      } else {
        vm.staff.$save(successCallback, errorCallback);
      }

      function successCallback(res) {

        vm.staff.courses = vm.allcourses;
        $state.go('staff.view', {
          staffId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
