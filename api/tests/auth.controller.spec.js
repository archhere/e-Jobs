import {  register , login, logout } from "../controllers/auth.controller.js";
import sinon from "sinon"
import User from "../models/user.model.js";
import { expect } from "chai";
import httpMocks from 'node-mocks-http';
import { EventEmitter } from "events";
import bcrypt from "bcrypt";



describe('Auth controller', () => {
    let userVal = {_id: "abc", isSeller: true, _doc: {password: "$2b$05$WHqiSpEowezJvzzV9Q7rj.VUNk97jmiXcsaVlP7vb2jsDSBIKpkSy"}};
    const sandbox = sinon.createSandbox();
    const next = sinon.spy();

    it('should successfully register user', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/users/123',
            params: {
                id: 123
            },
            userId: "abc",
            body: {
                password: "123"
            }
        });
        var response = httpMocks.createResponse({
            eventEmitter: EventEmitter,
            req : req
        })
        const saveStub = sinon.stub(User.prototype, 'save');
        await register(req, response, next)
        expect(saveStub.calledOnce).to.equal(true);
        sandbox.restore();
        User.prototype.save.restore();
      })

      it('should successfully login user', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/users/123',
            params: {
                id: 123
            },
            userId: "abc",
            body: {
                username: "123",
                password: "123"
            },
        });
        var response = httpMocks.createResponse({
            eventEmitter: EventEmitter,
            req : req
        })
        const findOneStub = sandbox.stub(User, 'findOne').resolves(userVal);
        const bcryptStub = sandbox.stub(bcrypt, "compareSync").resolves(true);
        await login(req, response, next)
        expect(findOneStub.calledOnce).to.equal(true);
        expect(bcryptStub.calledOnce).to.equal(true);
        sandbox.restore();
      })

      it('should successfully logout user', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/users/123',
            params: {
                id: 123
            },
            userId: "abc",
            body: {
                username: "123",
                password: "123"
            },
            headers: {
                Cookie: {"accessToken": "test"}
            }
        })
        var response = httpMocks.createResponse({
            eventEmitter: EventEmitter,
            req : req
        })
        await logout(req, response, next)
        sandbox.restore();
      })

});