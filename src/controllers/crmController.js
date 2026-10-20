import mongoose from "mongoose";
import { ContactSchema } from "../models/crmModels";

const Contact = mongoose.model('Contact', ContactSchema);

export const addNewContact = async (req, res) => {
    const newContact = new Contact(req.body);

    try {
        const contact = await newContact.save();
        res.json(contact);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getContact = async (req, res) => {
    try {
        const contacts = await Contact.find({});
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getContactWithId = async (req, res) => {
    try {
        const contacts = await Contact.findById(req.params.contactId);
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const updateContact = async (req, res) => {
    try {
        const contacts = await Contact.findOneAndUpdate({ _id: req.params.contactId }, req.body, { new: true });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteContact = async (req, res) => {
    try {
        await Contact.deleteOne({ _id: req.params.contactId });
        res.json({ message: "successfully deleted contact" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}