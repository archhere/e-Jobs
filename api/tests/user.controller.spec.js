import {  getUser, deleteUser, updateProfile  } from "../controllers/user.controller.js";
import sinon from "sinon"
import User from "../models/user.model.js";
import { expect } from "chai";
import httpMocks from 'node-mocks-http';
import { EventEmitter } from "events";



describe('User controller', () => {
    let userVal = {_id: "abc"};
    const sandbox = sinon.createSandbox();
    const next = sinon.spy();

    it('should successfully get user details', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/users/123',
            params: {
                id: 123
            },
            userId: "abc"
        });
        var response = httpMocks.createResponse({
            eventEmitter: EventEmitter,
            req : req
        });
        const findOneStub = sandbox.stub(User, 'findById').resolves(userVal);
        await getUser(req, response, next)
        expect(findOneStub.calledOnce).to.equal(true);
        sandbox.restore();
      })

    it("should delete table incase of delete request", async() => {
        const req = httpMocks.createRequest({
            method: 'DELETE',
            url: '/users/123',
            params: {
                id: 123
            },
            userId: "abc"
        });
        var response = httpMocks.createResponse({
            eventEmitter: EventEmitter,
            req : req
        });
        const findOneStub = sandbox.stub(User, 'findById').resolves(userVal);
        const deleteOneStub = sandbox.stub(User, 'findByIdAndDelete').resolves(userVal);
        await deleteUser(req, response, next);
        expect(findOneStub.calledOnce).to.equal(true);
        expect(deleteOneStub.calledOnce).to.equal(true);
        sandbox.restore();
    })

    it("should update table incase of update request", async() => {
        const req = httpMocks.createRequest({
            method: 'PUT',
            url: '/users/123',
            params: {
                id: 123
            },
            userId: "abc",
            body: {}
        });
        var response = httpMocks.createResponse({
            eventEmitter: EventEmitter,
            req : req
        });
        const findByIdAndUpdateStub = sandbox.stub(User, 'findByIdAndUpdate').resolves(userVal);
        await updateProfile (req, response, next);
        expect(findByIdAndUpdateStub.calledOnce).to.equal(true);
        sandbox.restore();
    })
});