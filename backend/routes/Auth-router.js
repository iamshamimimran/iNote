import { Router } from "express";
import { User } from "../models/User.js";
import { body, validationResult } from 'express-validator';
const router = Router();


router.post('/',[
  body('name').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
], (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send(req.body);
    const user = User (req.body);
    user.save()
  });


  export default router;