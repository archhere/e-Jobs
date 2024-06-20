import authRouter from "../routes/auth.route.js";
import userRouter from "../routes/user.route.js";
import { expect } from "chai";

describe('Auth route', () => {
  it('it should have all the expected routes', async () => {
    const routes = [
      { path: '/register', method: 'post' },
      { path: '/login', method: 'post' },
      { path: '/logout', method: 'post' }
    ]
  
    routes.forEach((route) => {
      const match = authRouter.stack.find(
        (s) => s.route.path === route.path && s.route.methods[route.method]
      );
      expect(match).not.be.undefined;
    });
  });
});

describe('User route', () => {
  it('it should have all the expected routes', async () => {
    const routes1 = [
      { path: "/:id", method: 'delete' },
      { path: "/:id", method: 'get' },
      { path: '/update', method: 'put' }
    ]
    routes1.forEach((route) => {
      expect(
        userRouter.stack
          .some(
            (s) => {
              return s.route.path === route.path && s.route.methods[route.method];
            }
          )
      ).to.equal(true)
    });
  });
});



