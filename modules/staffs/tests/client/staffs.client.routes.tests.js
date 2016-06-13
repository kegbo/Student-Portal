(function () {
  'use strict';

  describe('Staffs Route Tests', function () {
    // Initialize global variables
    var $scope,
      StaffsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _StaffsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      StaffsService = _StaffsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('staffs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/staffs');
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
          StaffsController,
          mockStaff;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('staffs.view');
          $templateCache.put('modules/staffs/client/views/view-staff.client.view.html', '');

          // create mock Staff
          mockStaff = new StaffsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Staff Name'
          });

          //Initialize Controller
          StaffsController = $controller('StaffsController as vm', {
            $scope: $scope,
            staffResolve: mockStaff
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:staffId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.staffResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            staffId: 1
          })).toEqual('/staffs/1');
        }));

        it('should attach an Staff to the controller scope', function () {
          expect($scope.vm.staff._id).toBe(mockStaff._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/staffs/client/views/view-staff.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          StaffsController,
          mockStaff;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('staffs.create');
          $templateCache.put('modules/staffs/client/views/form-staff.client.view.html', '');

          // create mock Staff
          mockStaff = new StaffsService();

          //Initialize Controller
          StaffsController = $controller('StaffsController as vm', {
            $scope: $scope,
            staffResolve: mockStaff
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.staffResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/staffs/create');
        }));

        it('should attach an Staff to the controller scope', function () {
          expect($scope.vm.staff._id).toBe(mockStaff._id);
          expect($scope.vm.staff._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/staffs/client/views/form-staff.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          StaffsController,
          mockStaff;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('staffs.edit');
          $templateCache.put('modules/staffs/client/views/form-staff.client.view.html', '');

          // create mock Staff
          mockStaff = new StaffsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Staff Name'
          });

          //Initialize Controller
          StaffsController = $controller('StaffsController as vm', {
            $scope: $scope,
            staffResolve: mockStaff
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:staffId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.staffResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            staffId: 1
          })).toEqual('/staffs/1/edit');
        }));

        it('should attach an Staff to the controller scope', function () {
          expect($scope.vm.staff._id).toBe(mockStaff._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/staffs/client/views/form-staff.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
