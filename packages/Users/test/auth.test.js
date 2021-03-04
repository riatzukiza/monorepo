import { expect, server, BASE_URL } from './setup';
import { Users } from '../src/models/models'

describe('Test auth routes', () => {
  it('can login and provide a token', async () => {
    const userData = {
      email: 'prettyLittleClouds@gmail.com',
      password:"HappyLittleAccidents"
    };
    const res = await server
          .post(`${BASE_URL}/auth/login`)
          .send(userData)
          .expect(200);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');

    const user = await Users.findOne({ email: userData.email });

    expect(user.token).to.equal(res.body.token);
  });

  it('can signup', async () => {
    const userData = {
      email: "birdman@SebbenAndSebben.org",
      password:"BatsAreNotBirds",
      firstName: "Harvey",
      lastName:"BirdMan"
    }
    const res = await server
          .post(`${BASE_URL}/auth/signup`)
          .send(userData)
          .expect(200);

    await Users.deleteOne({email:userData.email});
    expect(res.status).to.equal(200);

  });

  it('can logout',async  () => {

    const userData = {
      email: 'prettyLittleClouds@gmail.com',
      password:"HappyLittleAccidents"
    };
    const loginRes = await server
          .post(`${BASE_URL}/auth/login`)
          .send(userData)
          .expect(200);

    expect(loginRes.status).to.equal(200);
    expect(loginRes.body).to.have.property('token');


    const logoutRes = await server
          .post(`${BASE_URL}/auth/logout`)
          .send({token:loginRes.body.token})
          .expect(200);

    const user = await Users.findOne({ email: userData.email });

    expect(logoutRes.status).to.equal(200);
    expect(user.token).to.be.null;
  });

  it('can view authorized pages after login', async () => {
    const userData = {
      email: 'prettyLittleClouds@gmail.com',
      password:"HappyLittleAccidents"
    };
    const loginRes = await server
          .post(`${BASE_URL}/auth/login`)
          .send(userData)
          .expect(200);

    expect(loginRes.status).to.equal(200);
    expect(loginRes.body).to.have.property('token');

    const userProfileRes = await server
          .get(`${BASE_URL}/user/profile`)
          .set('authorization',`Basic ${loginRes.body.token}`)
          .expect(200)

    expect(userProfileRes.status).to.equal(200);
  });
});
