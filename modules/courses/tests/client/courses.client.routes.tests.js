(function () {
  'use strict';

  describe('Courses Route Tests', function () {
    // Initialize global variables
    var $scope,
      CoursesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CoursesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CoursesService = _CoursesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('courses');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/courses');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CoursesController,
          mockCourse;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('courses.view');
          $templateCache.put('modules/courses/client/views/view-course.client.view.html', '');

          // create mock Course
          mockCourse = new CoursesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Course Name'
          });

          //Initialize Controller
          CoursesController = $controller('CoursesController as vm', {
            $scope: $scope,
            courseResolve: mockCourse
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:courseId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.courseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            courseId: 1
          })).toEqual('/courses/1');
        }));

        it('should attach an Course to the controller scope', function () {
          expect($scope.vm.course._id).toBe(mockCourse._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/courses/client/views/view-course.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CoursesController,
          mockCourse;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('courses.create');
          $templateCache.put('modules/courses/client/views/form-course.client.view.html', '');

          // create mock Course
          mockCourse = new CoursesService();

          //Initialize Controller
          CoursesController = $controller('CoursesController as vm', {
            $scope: $scope,
            courseResolve: mockCourse
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.courseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/courses/create');
        }));

        it('should attach an Course to the controller scope', function () {
          expect($scope.vm.course._id).toBe(mockCourse._id);
          expect($scope.vm.course._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/courses/client/views/form-course.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CoursesController,
          mockCourse;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('courses.edit');
          $templateCache.put('modules/courses/client/views/form-course.client.view.html', '');

          // create mock Course
          mockCourse = new CoursesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Course Name'
          });

          //Initialize Controller
          CoursesController = $controller('CoursesController as vm', {
            $scope: $scope,
            courseResolve: mockCourse
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:courseId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.courseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            courseId: 1
          })).toEqual('/courses/1/edit');
        }));

        it('should attach an Course to the controller scope', function () {
          expect($scope.vm.course._id).toBe(mockCourse._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/courses/client/views/form-course.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
