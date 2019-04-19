const mongoose = require('mongoose');
const app = require('../../lib/app');
const request = require('supertest');
const ActorSchema = require('../../lib/models/ActorSchema');
const chance = require('chance')();

const anyString = expect.any(String);

function createActor() {
  return ActorSchema
    .create({
      name: chance.name(),
      dob: chance.date(),
      pob: chance.city()
    });
}

describe('tests actor routes', () => {
  beforeAll(() => {
    return mongoose.connect('mongodb://localhost:27017/warehouse', {
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true
    });
  });
  
  afterAll(() => {
    return mongoose.connection.close();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  
  it('creates an actor', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({
        name: chance.name(),
        dob: chance.date(),
        pob: chance.city()
      })
      .then(res => {
        expect(res.body).toEqual({
          name: anyString,
          dob: anyString,
          pob: anyString,
          __v: 0,
          _id: anyString
        });
      });
  });

  it('find all actors', () => {
    return createActor()
      .then(() => {
        return request(app)
          .get('/api/v1/actors');
      })
      .then(res => {
        expect(res.body).toHaveLength(1);
        expect(res.body).toEqual([{
          name: anyString,
          _id: anyString
        }]);
      });
  });
  it('gets actor by id', () => {
    return createActor()
      .then(createdActor => {
        return request(app)
          .get(`/api/v1/actors/${createdActor._id}`);
      })
      .then(res => {
        expect(res.body).toEqual({     
          name: anyString,
          dob: anyString,
          pob: anyString,
          __v: 0,
          _id: anyString 
        });
      });
  });

  it('updates actor by id', () => {
    return createActor()
      .then(createdActor => {
        return request(app)
          .put(`/api/v1/actors/${createdActor._id}`)
          .send({
            name: 'billy',
            dob: '1989-06-14T11:19:54.184Z',
            pob: 'sherwood forest'
            // _id: createdActor._id
          });
      })
      .then(res => {
        expect(res.body).toEqual({    
          name: 'billy',
          dob: '1989-06-14T11:19:54.184Z',
          pob: 'sherwood forest',
          _id: expect.any(String)
        });
      });
  });

  it('delete an actor by id ', () => {
    return createActor()
      .then(createdActor => {
        return request(app)
          .delete(`/api/v1/actors/${createdActor._id}`);
      })
      .then(res => {
        expect(res.body).toEqual({
          name: anyString,
          dob: anyString,
          pob: anyString,
          _id: anyString
        });
      });
  });
});
