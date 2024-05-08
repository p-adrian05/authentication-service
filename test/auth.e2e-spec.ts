//Integration test
//We are testing the whole application together to see if it works as expected
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'test@tescfvfcgtsdc.com';
    const password = 'passwprd';
    return request(app.getHttpServer())
      .post('/users/signup')
      .send({email, password})
      .expect(201)
      .then((res)=>{
        const {id, email,active,createdAt,roles} = res.body;
        expect(id).toBeDefined();
        expect(active).toBeTruthy();
        expect(createdAt).toBeDefined();
        expect(roles).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it("signup as a new user then login with the new user", async ()=>{
    const email = 'test@test.com';
    const password = 'asd';
    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send({email, password})
      .expect(201);

    request(app.getHttpServer())
      .post('/users/signin')
      .send({email, password})
      .expect(200)
      .then((res)=>{
        const {id} = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      })
  });

});
