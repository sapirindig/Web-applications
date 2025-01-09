import { Request, Response, NextFunction } from 'express';
import userModel from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).send("Email and password are required");
        return;
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            res.status(409).send("User already exists");
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({
            email,
            password: hashedPassword,
        });
        res.status(200).send({
            message: "User registered successfully",
            user: {
                email: user.email,
                _id: user._id,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error registering user"); 
    }
};

const login = async (req: Request, res: Response): Promise<void> => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        res.status(400).send("wrong username or password");
        return;
    }

    try {
        const user = await userModel.findOne({ email: email });
        if (!user) {
            res.status(404).send("wrong username or password");
            return;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(400).send("wrong username or password");
            return;
        }

        if (!process.env.TOKEN_SECRET) {
            res.status(400).send("missing auth configuration");
            return;
        }

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRATION,
        });

        // הדפס את המידע לפני שליחה
        console.log("Token Generated:", token);

        // וודא שאתה שולח את התשובה עם ה-ID וה-token
        res.status(200).send({
            email: user.email,
            _id: user._id, // שלח את ה-ID
            token: token,  // שלח את ה-token
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error logging in");
    }
};


type Payload = {
    _id: string;
}
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('authorization');
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        res.status(401).send('Access Denied');
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(401).send('Access Denied');
            return;
        }
        req.params.userId = (payload as Payload)._id;
        next();
    });
};
export default { register, login };
