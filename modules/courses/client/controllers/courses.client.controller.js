(function () {
  'use strict';

  angular
    .module('courses')
    .controller('CoursesController', CoursesListController);

  CoursesController.$inject = ['$scope', '$state', 'coursesResolve', 'Authentication' 'Co'];

  function CoursesController($scope, $state, courses, Authentication) {
    var vm = this;

    vm.courses = courses;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing courses
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.courses.$remove($state.go('courses.list'));
      }
    }

    // Save Courses
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.coursesForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.courses._id) {
        vm.courses.$update(successCallback, errorCallback);
      } else {
        vm.courses.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('courses.view', {
          coursesId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
