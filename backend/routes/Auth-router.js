import { Router } from "express";
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




export default router;
