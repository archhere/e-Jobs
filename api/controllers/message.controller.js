
import { createError } from "../utils/helper.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { ERROR_CANNOT_ORDER_OWN_GIG } from "../utils/constants.js"


export const createMessage = async (req, res, next) => {
    try {
        const { body: {conversationId, desc }, userId, isSeller } = req;
        const newMessage = new Message({
            conversationId,
            userId,
            desc
        });
        const savedMessage = await newMessage.save();
        await Conversation.findOneAndUpdate({id: conversationId}, 
            {
                $set: {
                readBySeller: isSeller,
                readyByBuyer: !isSeller,
                lastMessage: desc
                }
            },
            {new: true}
        );
        res.status(201).send(savedMessage);
    } catch(err){
        next(err);
    }
}

export const getMessages = async (req, res, next) => {
    try {
        const { params: { id } } = req;
        const messages = await Message.find({conversationId: id})
        res.status(200).send(messages);
    } catch(err){
        next(err);
    }
}