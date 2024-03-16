import { Router } from "express";
import { Notes } from "../models/Notes.js";
import { User } from "../models/User.js";
import { body, validationResult } from 'express-validator';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetchUser from "../middleware/fetchUser.js";


const JWT_SECRET = 'iAmn00b';
const router = Router();
//ROUTE : 1 --> Create a user 
router.post('/createUser', [
  body('name').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry, the user already exists" });
    }

    const salt= await bcrypt.genSalt(10);

    const secPass =await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      email: req.body.email, 
      password: secPass,
    });

    const data = {
      user: {
        id: user.id
      }
    };
    
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});


//ROUTE : 2 --> Create a login Route

router.post('/login', [
  body('email','Enter a Valid Email').isEmail(),
  body('password','Passwird cannot be blank').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email,password}=req.body;
  try {
    let user =await User.findOne({email});
    if(!user){
      return res.status(400).json({error:"Please login with a valid email"});
    }
    const passwordCompare=await bcrypt.compare(password, user.password);
    if(!passwordCompare){
      return res.status(400).json({error:"Please login with a valid email"});
    }
    const data = {
      user: {
        id: user.id
      }
    };
    
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error'); 
  }
});

//ROUTE : 3 --> Get logged in user details a login Route

router.post('/getuser', fetchUser, async (req, res) => {
  try {
    const userId = req.user.id; // Corrected variable name
    const user = await User.findById(userId).select('-password'); // Corrected syntax for excluding the password field
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error'); 
  }
});
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

//ROUTE : 2 --> add notes all Notes


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

//ROUTE : 3 --> Update notes all Notes

router.put('/updatenote/:id', fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    let note = await Notes.findById(req.params.id);

    if (!note) {
      return res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });

    res.status(200).json({ success: true, note });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//ROUTE : 3 --> Update notes all Notes

router.delete('/deletenote/:id', fetchUser, async (req, res) => {
  try {

    let note = await Notes.findById(req.params.id);

    if (!note) {
      return res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, "Success": "Note has benn deleted", note: note });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});



export default router;
