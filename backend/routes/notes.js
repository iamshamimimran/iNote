import { Router } from "express";
import { Notes } from "../model/Notes.js";
import fetchUser from "../middleware/fetchUser.js";
import { body, validationResult } from 'express-validator';


const router = Router();

//ROUTE : 1 --> Fetch all Notes

router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Route to add a new note
router.post('/addnote', fetchUser, [
    body('title').isLength({ min: 3 }),
    body('description').isLength({ min: 3 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title,
            description,
            tag,
            user: req.user.id
        });
        const saveNote = await note.save();
        res.json(saveNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
