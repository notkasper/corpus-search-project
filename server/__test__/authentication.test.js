const request = require('superagent');
import JWT from 'jsonwebtoken';


const user = { "username": "admin" };
const validSecret = "CHIHABSECRET";
const invalidSecret = "CHISECRET";

const validToken = JWT.sign(user, validSecret, { expiresIn: "24h" });
const invalidToken = JWT.sign(user, invalidSecret, { expiresIn: "24h" });

describe('/user/auth tests', async () => {

  beforeEach(() => {
    jest.setTimeout(10000);
  });

  test("A valid authentication should return status 200", async () => {
    const response = await request
      .get(`localhost:8080/user/auth`)
      .set("x-access-token", validToken)
      .send();

    expect(response.status).toEqual(200);
  });

  test("A invalid authentication should return status 401", async () => {
    let response;
    try {
      response = await request
        .get(`localhost:8080/user/auth`)
        .set("x-access-token", invalidToken)
        .send();
    }
    catch (error) {
      response = error.response;
    }

    expect(response.status).toEqual(401);
  });

  test("A authentication without a token should return status 401", async () => {
    let response;
    try {
      response = await request
        .get(`localhost:8080/user/auth`)
        .send();
    }
    catch (error) {
      response = error.response;
    }

    expect(response.status).toEqual(401);
  });

});
