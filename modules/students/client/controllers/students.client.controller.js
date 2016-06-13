(function () {
  'use strict';

  // Students controller
  angular
    .module('students')
    .controller('StudentsController', StudentsController);

  StudentsController.$inject = ['$scope','CoursesService', '$state','$filter', 'Authentication', 'studentResolve'];

  function StudentsController ($scope, CoursesService,$state, $filter, Authentication, student) {
    var vm = this;

    vm.authentication = Authentication;
    vm.student = student;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

   $scope.listcourses = [];
   CoursesService.query(function (resource){
    $scope.listcourses = resource;
    for(var i = 0; i < $scope.listcourses.length; i ++){
      if(vm.student.course == undefined){
              vm.student.course = [];
          } 
      if(vm.student.course.indexOf($scope.listcourses[i]._id) > -1){
        $scope.listcourses[i].checked = true;
      }
    }
   });

   $scope.studentCourses = [];
   var temp = [];

   //Get courses by courses id and bind to scope for output
   if(vm.student.course != undefined) {
    for ( var i = 0; i < vm.student.course.length; i++) { 
           $scope.studentCourses[i] = CoursesService.get({ courseId: vm.student.course[i] });            
      }
   }     
    //Courses staff is incharge
    $scope.selectedCourses = function () {    
    temp = $filter('filter')($scope.listcourses,({checked: true}));      
  }
    // Remove existing Student
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
       
        if($scope.studentCourses != undefined){

          for(var i = 0; i < $scope.studentCourses.length; i++){
          var index = $scope.studentCourses[i].student.indexOf(vm.student._id);
          $scope.studentCourses[i].student.splice(index,1);
          var temp = $scope.studentCourses[i];
          var id = vm._id
          CoursesService.update({id:id},temp);
          }
      }
       vm.student.$remove($state.go('students.list'));
    }
  }

    // Save Student
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.studentForm');
        return false;
      }


      if (vm.student._id) {
        vm.student.$update(successCallback, errorCallback);
      } else {  
        vm.student.$save(successCallback, errorCallback);
      }

      //pass checked courses to array of student courses
     
      
        for ( var i = 0; i < $scope.listcourses.length; i++) {  
        if($scope.listcourses[i].checked == true){ 
          if(vm.student.course == undefined){
              vm.student.course = [];
          }    
           if(vm.student.course.indexOf($scope.listcourses[i]._id)== -1){
            vm.student.course.push($scope.listcourses[i]._id);
            var temp = $scope.listcourses[i];
            temp.student.push(vm.student._id);
            var id = $scope.listcourses[i]._id;
            CoursesService.update({id:id},temp);
           }
          }
          else{
              var index = vm.student.course.indexOf($scope.listcourses[i]._id)
              if (index > -1) {
                vm.student.course.splice(index, 1);
                var nuindex = $scope.listcourses[i].student.indexOf(vm.student._id);
                $scope.listcourses[i].student.splice(nuindex,1);
                var id = $scope.listcourses[i]._id;
                var temp = $scope.listcourses[i];
                CoursesService.update({id:id},temp);

          } 
        }
      }
      
    


     
      function successCallback(res) {
        $state.go('students.view', {
          studentId: res._id

        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
