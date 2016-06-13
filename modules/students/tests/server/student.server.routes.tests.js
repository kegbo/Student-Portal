'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Student = mongoose.model('Student'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, student;

/**
 * Student routes tests
 */
describe('Student CRUD tests', function () {

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

    // Save a user to the test db and create new Student
    user.save(function () {
      student = {
        name: 'Student name'
      };

      done();
    });
  });

  it('should be able to save a Student if logged in', function (done) {
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

        // Save a new Student
        agent.post('/api/students')
          .send(student)
          .expect(200)
          .end(function (studentSaveErr, studentSaveRes) {
            // Handle Student save error
            if (studentSaveErr) {
              return done(studentSaveErr);
            }

            // Get a list of Students
            agent.get('/api/students')
              .end(function (studentsGetErr, studentsGetRes) {
                // Handle Student save error
                if (studentsGetErr) {
                  return done(studentsGetErr);
                }

                // Get Students list
                var students = studentsGetRes.body;

                // Set assertions
                (students[0].user._id).should.equal(userId);
                (students[0].name).should.match('Student name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Student if not logged in', function (done) {
    agent.post('/api/students')
      .send(student)
      .expect(403)
      .end(function (studentSaveErr, studentSaveRes) {
        // Call the assertion callback
        done(studentSaveErr);
      });
  });

  it('should not be able to save an Student if no name is provided', function (done) {
    // Invalidate name field
    student.name = '';

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

        // Save a new Student
        agent.post('/api/students')
          .send(student)
          .expect(400)
          .end(function (studentSaveErr, studentSaveRes) {
            // Set message assertion
            (studentSaveRes.body.message).should.match('Please fill Student name');

            // Handle Student save error
            done(studentSaveErr);
          });
      });
  });

  it('should be able to update an Student if signed in', function (done) {
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

        // Save a new Student
        agent.post('/api/students')
          .send(student)
          .expect(200)
          .end(function (studentSaveErr, studentSaveRes) {
            // Handle Student save error
            if (studentSaveErr) {
              return done(studentSaveErr);
            }

            // Update Student name
            student.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Student
            agent.put('/api/students/' + studentSaveRes.body._id)
              .send(student)
              .expect(200)
              .end(function (studentUpdateErr, studentUpdateRes) {
                // Handle Student update error
                if (studentUpdateErr) {
                  return done(studentUpdateErr);
                }

                // Set assertions
                (studentUpdateRes.body._id).should.equal(studentSaveRes.body._id);
                (studentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Students if not signed in', function (done) {
    // Create new Student model instance
    var studentObj = new Student(student);

    // Save the student
    studentObj.save(function () {
      // Request Students
      request(app).get('/api/students')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Student if not signed in', function (done) {
    // Create new Student model instance
    var studentObj = new Student(student);

    // Save the Student
    studentObj.save(function () {
      request(app).get('/api/students/' + studentObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', student.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Student with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/students/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Student is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Student which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Student
    request(app).get('/api/students/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Student with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Student if signed in', function (done) {
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

        // Save a new Student
        agent.post('/api/students')
          .send(student)
          .expect(200)
          .end(function (studentSaveErr, studentSaveRes) {
            // Handle Student save error
            if (studentSaveErr) {
              return done(studentSaveErr);
            }

            // Delete an existing Student
            agent.delete('/api/students/' + studentSaveRes.body._id)
              .send(student)
              .expect(200)
              .end(function (studentDeleteErr, studentDeleteRes) {
                // Handle student error error
                if (studentDeleteErr) {
                  return done(studentDeleteErr);
                }

                // Set assertions
                (studentDeleteRes.body._id).should.equal(studentSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Student if not signed in', function (done) {
    // Set Student user
    student.user = user;

    // Create new Student model instance
    var studentObj = new Student(student);

    // Save the Student
    studentObj.save(function () {
      // Try deleting Student
      request(app).delete('/api/students/' + studentObj._id)
        .expect(403)
        .end(function (studentDeleteErr, studentDeleteRes) {
          // Set message assertion
          (studentDeleteRes.body.message).should.match('User is not authorized');

          // Handle Student error error
          done(studentDeleteErr);
        });

    });
  });

  it('should be able to get a single Student that has an orphaned user reference', function (done) {
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

          // Save a new Student
          agent.post('/api/students')
            .send(student)
            .expect(200)
            .end(function (studentSaveErr, studentSaveRes) {
              // Handle Student save error
              if (studentSaveErr) {
                return done(studentSaveErr);
              }

              // Set assertions on new Student
              (studentSaveRes.body.name).should.equal(student.name);
              should.exist(studentSaveRes.body.user);
              should.equal(studentSaveRes.body.user._id, orphanId);

              // force the Student to have an orphaned user reference
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

                    // Get the Student
                    agent.get('/api/students/' + studentSaveRes.body._id)
                      .expect(200)
                      .end(function (studentInfoErr, studentInfoRes) {
                        // Handle Student error
                        if (studentInfoErr) {
                          return done(studentInfoErr);
                        }

                        // Set assertions
                        (studentInfoRes.body._id).should.equal(studentSaveRes.body._id);
                        (studentInfoRes.body.name).should.equal(student.name);
                        should.equal(studentInfoRes.body.user, undefined);

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
      Student.remove().exec(done);
    });
  });
});
