import {expect} from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Tests de Sessions", () => {

  let token;

  it("Debe registrar un usuario correctamente", async () => {
    const userMock = {
      first_name: "Test",
      last_name: "User",
      email: `test${Date.now()}@gmail.com`,
      age: 30,
      password: "123456"
    };

    const res = await requester
      .post("/api/users/register")
      .send(userMock);

    expect(res.status).to.equal(201);
    expect(res.body.status).to.equal("success");
  });



    it("Debe loguear al usuario y devolver un token", async () => {
    const loginMock = {
      email: "maxi@test.com", // usuario existente
      password: "123456"
    };

    const res = await requester
      .post("/api/sessions/login")
      .send(loginMock);

    expect(res.status).to.equal(200);
    expect(res.body.payload.token).to.be.a("string");

    token = res.body.payload.token;
  });


    it("Debe devolver el usuario actual con JWT válido", async () => {
    const res = await requester
      .get("/api/sessions/current")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.payload).to.have.property("email");
    expect(res.body.payload).to.not.have.property("password");
  });

});


it("Debe fallar si no se envía token", async () => {
  const res = await requester.get("/api/sessions/current");
  expect(res.status).to.equal(401);
});


