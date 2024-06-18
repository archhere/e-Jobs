import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { ERROR_CONVERSATION_NOT_FOUND } from "../utils/constants.js";
import { createError } from "../utils/helper.js";

export const getConversations = async (req, res, next) => {
    try {
        const {  userId } = req;
        const conversations = await Conversation.find({$or:[{user1: userId},{user2: userId}]}).sort({ updatedAt: -1 });
        res.status(200).send(conversations);
    } catch(err){
        next(err);
    }
}

export const createConversation = async (req, res, next) => {
    try {
        const {  userId, body: { user1, user2 } } = req;
        const newConversation = new Conversation({
           user1,
           user2,
           readByUser1: userId === user1,
           readByUser2: userId === user2
        });
        const savedConversation = await newConversation.save();
        const newMessage = new Message({
            conversationId: savedConversation?._id,
            userId,
            desc: "Hello!"
        });
        await newMessage.save();
        res.status(201).send(savedConversation);

    } catch(err){
        next(err);
    }
}

export const getSingleConversation = async (req, res, next) => {
    try {
        const {userId, params: { user1, user2 } } = req;
        const conversation1 = await Conversation.findOne({user1, user2});
        let conversation2;
        if(!conversation1) {
            conversation2 = await Conversation.findOne({user1 : user2, user2: user1});
        }
        if(!conversation1 && !conversation2) return next(createError(404, ERROR_CONVERSATION_NOT_FOUND));
        const newMessage = new Message({
            conversationId: (conversation1 || conversation2)?._id,
            userId,
            desc: "Hello!"
        });
        const savedMessage = await newMessage.save();
        res.status(200).send(conversation1 || conversation2);

    } catch(err){
        next(err);
    }
}

export const updateConversation = async (req, res, next) => {
    try {
        const {params: { id } } = req;
       const updatedConversation = await Conversation.findOneAndUpdate({id}, 
        {
            $set: {
                readByUser1: true,
                readByUser2: true
            }
        },
        {new: true}
       );
       res.status(200).send(updatedConversation);
    } catch(err){
        next(err);
    }
}