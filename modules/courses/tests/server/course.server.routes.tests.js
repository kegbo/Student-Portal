'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Course = mongoose.model('Course'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, course;

/**
 * Course routes tests
 */
describe('Course CRUD tests', function () {

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

    // Save a user to the test db and create new Course
    user.save(function () {
      course = {
        name: 'Course name'
      };

      done();
    });
  });

  it('should be able to save a Course if logged in', function (done) {
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

        // Save a new Course
        agent.post('/api/courses')
          .send(course)
          .expect(200)
          .end(function (courseSaveErr, courseSaveRes) {
            // Handle Course save error
            if (courseSaveErr) {
              return done(courseSaveErr);
            }

            // Get a list of Courses
            agent.get('/api/courses')
              .end(function (coursesGetErr, coursesGetRes) {
                // Handle Course save error
                if (coursesGetErr) {
                  return done(coursesGetErr);
                }

                // Get Courses list
                var courses = coursesGetRes.body;

                // Set assertions
                (courses[0].user._id).should.equal(userId);
                (courses[0].name).should.match('Course name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Course if not logged in', function (done) {
    agent.post('/api/courses')
      .send(course)
      .expect(403)
      .end(function (courseSaveErr, courseSaveRes) {
        // Call the assertion callback
        done(courseSaveErr);
      });
  });

  it('should not be able to save an Course if no name is provided', function (done) {
    // Invalidate name field
    course.name = '';

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

        // Save a new Course
        agent.post('/api/courses')
          .send(course)
          .expect(400)
          .end(function (courseSaveErr, courseSaveRes) {
            // Set message assertion
            (courseSaveRes.body.message).should.match('Please fill Course name');

            // Handle Course save error
            done(courseSaveErr);
          });
      });
  });

  it('should be able to update an Course if signed in', function (done) {
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

        // Save a new Course
        agent.post('/api/courses')
          .send(course)
          .expect(200)
          .end(function (courseSaveErr, courseSaveRes) {
            // Handle Course save error
            if (courseSaveErr) {
              return done(courseSaveErr);
            }

            // Update Course name
            course.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Course
            agent.put('/api/courses/' + courseSaveRes.body._id)
              .send(course)
              .expect(200)
              .end(function (courseUpdateErr, courseUpdateRes) {
                // Handle Course update error
                if (courseUpdateErr) {
                  return done(courseUpdateErr);
                }

                // Set assertions
                (courseUpdateRes.body._id).should.equal(courseSaveRes.body._id);
                (courseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Courses if not signed in', function (done) {
    // Create new Course model instance
    var courseObj = new Course(course);

    // Save the course
    courseObj.save(function () {
      // Request Courses
      request(app).get('/api/courses')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Course if not signed in', function (done) {
    // Create new Course model instance
    var courseObj = new Course(course);

    // Save the Course
    courseObj.save(function () {
      request(app).get('/api/courses/' + courseObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', course.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Course with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/courses/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Course is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Course which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Course
    request(app).get('/api/courses/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Course with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Course if signed in', function (done) {
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

        // Save a new Course
        agent.post('/api/courses')
          .send(course)
          .expect(200)
          .end(function (courseSaveErr, courseSaveRes) {
            // Handle Course save error
            if (courseSaveErr) {
              return done(courseSaveErr);
            }

            // Delete an existing Course
            agent.delete('/api/courses/' + courseSaveRes.body._id)
              .send(course)
              .expect(200)
              .end(function (courseDeleteErr, courseDeleteRes) {
                // Handle course error error
                if (courseDeleteErr) {
                  return done(courseDeleteErr);
                }

                // Set assertions
                (courseDeleteRes.body._id).should.equal(courseSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Course if not signed in', function (done) {
    // Set Course user
    course.user = user;

    // Create new Course model instance
    var courseObj = new Course(course);

    // Save the Course
    courseObj.save(function () {
      // Try deleting Course
      request(app).delete('/api/courses/' + courseObj._id)
        .expect(403)
        .end(function (courseDeleteErr, courseDeleteRes) {
          // Set message assertion
          (courseDeleteRes.body.message).should.match('User is not authorized');

          // Handle Course error error
          done(courseDeleteErr);
        });

    });
  });

  it('should be able to get a single Course that has an orphaned user reference', function (done) {
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

          // Save a new Course
          agent.post('/api/courses')
            .send(course)
            .expect(200)
            .end(function (courseSaveErr, courseSaveRes) {
              // Handle Course save error
              if (courseSaveErr) {
                return done(courseSaveErr);
              }

              // Set assertions on new Course
              (courseSaveRes.body.name).should.equal(course.name);
              should.exist(courseSaveRes.body.user);
              should.equal(courseSaveRes.body.user._id, orphanId);

              // force the Course to have an orphaned user reference
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

                    // Get the Course
                    agent.get('/api/courses/' + courseSaveRes.body._id)
                      .expect(200)
                      .end(function (courseInfoErr, courseInfoRes) {
                        // Handle Course error
                        if (courseInfoErr) {
                          return done(courseInfoErr);
                        }

                        // Set assertions
                        (courseInfoRes.body._id).should.equal(courseSaveRes.body._id);
                        (courseInfoRes.body.name).should.equal(course.name);
                        should.equal(courseInfoRes.body.user, undefined);

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
      Course.remove().exec(done);
    });
  });
});
