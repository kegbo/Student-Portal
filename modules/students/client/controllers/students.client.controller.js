(function () {
  'use strict';

  angular
    .module('students')
    .controller('StudentsController', StudentsController);

  StudentsController.$inject = ['$scope', '$state', 'studentsResolve', 'Authentication'];

  function StudentsController($scope, $state, students, Authentication) {
    var vm = this;

    vm.students = students;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing students
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.students.$remove($state.go('students.list'));
      }
    }

    // Saves tudents
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.studentsForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.students._id) {
        vm.students.$update(successCallback, errorCallback);
      } else {
        vm.students.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('students.view', {
          studentsId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
