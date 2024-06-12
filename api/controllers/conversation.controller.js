import Conversation from "../models/conversation.model.js";
import { ERROR_CONVERSATION_NOT_FOUND } from "../utils/constants.js";
import { createError } from "../utils/helper.js";

export const getConversations = async (req, res, next) => {
    try {
        const { userId, isSeller } = req;
        const conversations = await Conversation.find(
            isSeller ? {sellerId: userId} : {buyerId: userId}
        ).sort({ updatedAt: -1 });
        res.status(200).send(conversations);
    } catch(err){
        next(err);
    }
}

export const createConversation = async (req, res, next) => {
    try {
        const { isSeller, userId, body: { to } } = req;
        const newConversation = new Conversation({
            id: isSeller ? userId + to : to + userId,
            sellerId: isSeller ? userId : to,
            buyerId: isSeller ? to : userId,
            readBySeller: isSeller,
            readByBuyer: !isSeller
        });
        const savedConversation = await newConversation.save();
        res.status(201).send(savedConversation);

    } catch(err){
        next(err);
    }
}

export const getSingleConversation = async (req, res, next) => {
    try {
        const {params: { id } } = req;
        const conversation = await Conversation.findOne({id});
        if(!conversation) return next(createError(404, ERROR_CONVERSATION_NOT_FOUND));
        res.status(200).send(conversation);

    } catch(err){
        next(err);
    }
}

export const updateConversation = async (req, res, next) => {
    try {
        const { params: { id }, isSeller } = req;
       const updatedConversation = await Conversation.findOneAndUpdate({id}, 
        {
            $set: {
                // readBySeller: true,
                // readByBuyer: true
                ...(isSeller ? {readBySeller: true} : {readByBuyer: true})
            }
        },
        {new: true}
       );
       res.status(200).send(updatedConversation);
    } catch(err){
        next(err);
    }
}