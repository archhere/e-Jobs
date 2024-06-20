import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { expect } from "chai";


async function validateSample(sample) {
    try {
      await sample.validate();
      return true;
    } catch (error) {
      return false;
    }
  }


describe('Testing models', () => {

    let userVal;
    beforeEach(() => {
        userVal = {
          username: "test",
          password: "test",
          email: "test",
          phone: "test",
          country: "US"
        };
      });
  
    it('it should throw an error due to missing fields in message model', async () => {
      const message = new Message();
      const resp = await validateSample(message)
      expect(resp).to.equal(false);
    });

    it('it should return successful validation incase of correct data in message model', async () => {
        const message = new Message({
            conversationId: 'test',
            userId: "test",
            desc: "test"
          });
        const resp = await validateSample(message)
        expect(resp).to.equal(true);
        
      });

      it('it should throw an error if we add unexpected values in message model', async () => {
        const message = new Message({
            conversationId: 'test',
            userId: "test",
            desc: null
          });
        const resp = await validateSample(message)
        expect(resp).to.equal(false);
        
      });

      it('it should throw an error due to missing fields in user model', async () => {
        const user = new User();
        const resp = await validateSample(user)
        expect(resp).to.equal(false);
      });
  
      it('it should return successful validation incase of correct data in user model', async () => {
          const user = new User(userVal);
          const resp = await validateSample(user)
          expect(resp).to.equal(true);
          
        });
  
        it('it should throw an error if we add unexpected values in user model', async () => {
          userVal.country = null;
          const message = new User(userVal);
          const resp = await validateSample(message)
          expect(resp).to.equal(false);
          
        });
    });