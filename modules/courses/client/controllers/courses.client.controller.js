(function () {
  'use strict';

  // Courses controller
  angular
    .module('courses')
    .controller('CoursesController', CoursesController);

  CoursesController.$inject = ['$scope','StaffsService','StudentsService','$state','$filter', 'Authentication', 'courseResolve'];

  function CoursesController ($scope,StaffsService,StudentsService,$state,$filter, Authentication, course) {
    var vm = this;

    vm.authentication = Authentication;
    vm.course = course;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    //Array of filtered staff
   $scope.coursesStaff = []; 
    $scope.coursesStudent = [];
    $scope.liststaff = []; 
    //List of all   
    StaffsService.query(function(resource){
    $scope.liststaff = resource;
    for(var i = 0; i < $scope.liststaff.length; i++){
      if(vm.course.staff == undefined){
            vm.course.staff = [];
        }
    if(vm.course.staff.indexOf($scope.liststaff[i]._id) > -1){
      $scope.liststaff[i].checked = true;
        }
      }
    });
      
      
   
    //get staff courses object to get course title
   if(vm.course.staff!=undefined){
   for ( var i = 0; i < vm.course.staff.length; i++) { 
         $scope.coursesStaff[i] = StaffsService.get({ staffId: vm.course.staff[i] });     
      }
    }

    //Get list of students taking this course
     if(vm.course.student!=undefined){
      for ( var i = 0; i < vm.course.student.length; i++) { 
         $scope.coursesStudent[i] = StudentsService.get({ studentId: vm.course.student[i] }); 
        
      }
    }
    
  var temp = [];
   //Filter for assigning staff to this course
   $scope.selectedStaff = function () {
        temp = $filter('filter')($scope.liststaff,({checked: true}));    
  }
  
    // Remove existing Course
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        
        if($scope.coursesStudent != undefined){

          for(var i = 0; i < $scope.coursesStudent.length; i++){
          var index = $scope.coursesStudent[i].course.indexOf(vm.course._id);
          $scope.coursesStudent[i].course.splice(index,1);
          var temp = $scope.coursesStudent[i];
          var id = vm._id
          StudentsService.update({id:id},temp);
          }
        }
        
        if($scope.coursesStaff != undefined){

          for(var i = 0; i < $scope.coursesStaff.length; i++){
          var index = $scope.coursesStaff[i].courses.indexOf(vm.course._id);
          $scope.coursesStaff[i].courses.splice(index,1);
          var temp = $scope.coursesStaff[i];
          var id = vm._id
          StaffsService.update({id:id},temp);
          }
        }
        vm.course.$remove($state.go('courses.list'));
      }
    }

    // Save Course
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.courseForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.course._id) {
        vm.course.$update(successCallback, errorCallback);
      } else {
        vm.course.$save(successCallback, errorCallback);
      }

        for ( var i = 0; i < $scope.liststaff.length; i++) {  
        if($scope.liststaff[i].checked == true){    
          if(vm.course.staff == undefined){
            vm.course.staff = [];
          }
          if(vm.course.staff.indexOf($scope.liststaff[i]._id) == -1){
             
              vm.course.staff.push($scope.liststaff[i]._id); 
              var temp = $scope.liststaff[i];
              temp.courses.push(vm.course._id);
              var id = $scope.liststaff[i]._id;
              StaffsService.update({id:id},temp);
            }
           
          }
          //remove items tht were unchecked from parent object
          else{
            var index = vm.course.staff.indexOf($scope.liststaff[i]._id)
            if (index > -1) {
                vm.course.staff.splice(index, 1);
                var nuindex = $scope.liststaff[i].courses.indexOf(vm.course._id);
                $scope.liststaff[i].courses.splice(nuindex,1);
                var id = $scope.liststaff[i]._id;
                var temp = $scope.liststaff[i];
                StaffsService.update({id:id},temp);
            }

          } 
        }

      function successCallback(res) {
        $state.go('courses.view', {
          courseId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
