import jwt from "jsonwebtoken";

const JWT_SECRET = 'iAmn00b';

const fetchUser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token){
        res.status(401).send({error: "please authenticate with a valid token"});
        return;
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({error: "please authenticate with a valid token"});
    }
}

export default fetchUser;
