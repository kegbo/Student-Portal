'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Staff = mongoose.model('Staff'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, staff;

/**
 * Staff routes tests
 */
describe('Staff CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Staff
    user.save(function () {
      staff = {
        name: 'Staff name'
      };

      done();
    });
  });

  it('should be able to save a Staff if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Staff
        agent.post('/api/staffs')
          .send(staff)
          .expect(200)
          .end(function (staffSaveErr, staffSaveRes) {
            // Handle Staff save error
            if (staffSaveErr) {
              return done(staffSaveErr);
            }

            // Get a list of Staffs
            agent.get('/api/staffs')
              .end(function (staffsGetErr, staffsGetRes) {
                // Handle Staff save error
                if (staffsGetErr) {
                  return done(staffsGetErr);
                }

                // Get Staffs list
                var staffs = staffsGetRes.body;

                // Set assertions
                (staffs[0].user._id).should.equal(userId);
                (staffs[0].name).should.match('Staff name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Staff if not logged in', function (done) {
    agent.post('/api/staffs')
      .send(staff)
      .expect(403)
      .end(function (staffSaveErr, staffSaveRes) {
        // Call the assertion callback
        done(staffSaveErr);
      });
  });

  it('should not be able to save an Staff if no name is provided', function (done) {
    // Invalidate name field
    staff.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Staff
        agent.post('/api/staffs')
          .send(staff)
          .expect(400)
          .end(function (staffSaveErr, staffSaveRes) {
            // Set message assertion
            (staffSaveRes.body.message).should.match('Please fill Staff name');

            // Handle Staff save error
            done(staffSaveErr);
          });
      });
  });

  it('should be able to update an Staff if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Staff
        agent.post('/api/staffs')
          .send(staff)
          .expect(200)
          .end(function (staffSaveErr, staffSaveRes) {
            // Handle Staff save error
            if (staffSaveErr) {
              return done(staffSaveErr);
            }

            // Update Staff name
            staff.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Staff
            agent.put('/api/staffs/' + staffSaveRes.body._id)
              .send(staff)
              .expect(200)
              .end(function (staffUpdateErr, staffUpdateRes) {
                // Handle Staff update error
                if (staffUpdateErr) {
                  return done(staffUpdateErr);
                }

                // Set assertions
                (staffUpdateRes.body._id).should.equal(staffSaveRes.body._id);
                (staffUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Staffs if not signed in', function (done) {
    // Create new Staff model instance
    var staffObj = new Staff(staff);

    // Save the staff
    staffObj.save(function () {
      // Request Staffs
      request(app).get('/api/staffs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Staff if not signed in', function (done) {
    // Create new Staff model instance
    var staffObj = new Staff(staff);

    // Save the Staff
    staffObj.save(function () {
      request(app).get('/api/staffs/' + staffObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', staff.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Staff with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/staffs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Staff is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Staff which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Staff
    request(app).get('/api/staffs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Staff with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Staff if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Staff
        agent.post('/api/staffs')
          .send(staff)
          .expect(200)
          .end(function (staffSaveErr, staffSaveRes) {
            // Handle Staff save error
            if (staffSaveErr) {
              return done(staffSaveErr);
            }

            // Delete an existing Staff
            agent.delete('/api/staffs/' + staffSaveRes.body._id)
              .send(staff)
              .expect(200)
              .end(function (staffDeleteErr, staffDeleteRes) {
                // Handle staff error error
                if (staffDeleteErr) {
                  return done(staffDeleteErr);
                }

                // Set assertions
                (staffDeleteRes.body._id).should.equal(staffSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Staff if not signed in', function (done) {
    // Set Staff user
    staff.user = user;

    // Create new Staff model instance
    var staffObj = new Staff(staff);

    // Save the Staff
    staffObj.save(function () {
      // Try deleting Staff
      request(app).delete('/api/staffs/' + staffObj._id)
        .expect(403)
        .end(function (staffDeleteErr, staffDeleteRes) {
          // Set message assertion
          (staffDeleteRes.body.message).should.match('User is not authorized');

          // Handle Staff error error
          done(staffDeleteErr);
        });

    });
  });

  it('should be able to get a single Staff that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Staff
          agent.post('/api/staffs')
            .send(staff)
            .expect(200)
            .end(function (staffSaveErr, staffSaveRes) {
              // Handle Staff save error
              if (staffSaveErr) {
                return done(staffSaveErr);
              }

              // Set assertions on new Staff
              (staffSaveRes.body.name).should.equal(staff.name);
              should.exist(staffSaveRes.body.user);
              should.equal(staffSaveRes.body.user._id, orphanId);

              // force the Staff to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Staff
                    agent.get('/api/staffs/' + staffSaveRes.body._id)
                      .expect(200)
                      .end(function (staffInfoErr, staffInfoRes) {
                        // Handle Staff error
                        if (staffInfoErr) {
                          return done(staffInfoErr);
                        }

                        // Set assertions
                        (staffInfoRes.body._id).should.equal(staffSaveRes.body._id);
                        (staffInfoRes.body.name).should.equal(staff.name);
                        should.equal(staffInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Staff.remove().exec(done);
    });
  });
});
