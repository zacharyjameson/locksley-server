
const app = require("../src/app");

describe("App", () => {
  it('GET / responds with 200 containing "Hello there....General Kenobi!"', () => {
    return supertest(app).get("/").expect(200, "Hello there....General Kenobi!");
  });
});
