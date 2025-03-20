import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import express, { Express } from "express";
import cors from "cors";  
import path from "path"; 

// 🟢 יצירת השרת **לפני כל שימוש ב- app**
const app = express();

// 🟢 Middleware - טיפול בבקשות JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🟢 CORS - מתן הרשאות חיצוניות
app.use(cors({
    origin: ["http://localhost:5174"], // 🛠️ להתאים לכתובת של הפרונט
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

// 🟢 הרשאות כלליות לכל הנתיבים
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

// 🟢 ייבוא נתיבים (Routes) אחרי יצירת `app`
import postsRoute from "./routes/posts_routes";
import commentsRoute from "./routes/comments_routes";
import authRoutes from "./routes/auth_routes";
import userRoutes from "./routes/user_routes";
import { authMiddleware } from "./controllers/auth_controller";

// 🟢 חיבור הנתיבים לשרת
app.use("/api/auth/login", authRoutes);
app.use("/api/posts", postsRoute);
app.use("/api/comments", commentsRoute);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/auth", authRoutes);

// 🟢 הוספת נתיב לקבצים סטטיים (למשל תמונות שהמשתמש מעלה)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 🟢 הגדרות Swagger לתיעוד ה-API
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Web Dev 2025 REST API",
            version: "1.0.0",
            description: "REST server including authentication using JWT",
        },
        servers: [{ url: "http://localhost:3000" }],
    },
    apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// 🟢 חיבור למסד הנתונים MongoDB
const db = mongoose.connection;
db.on("error", (error) => console.error("❌ MongoDB Connection Error:", error));
db.once("open", () => console.log("✅ Connected to database"));

// 🟢 הפעלת השרת עם התחברות למסד הנתונים
const initApp = () => {
    return new Promise<Express>((resolve, reject) => {
        if (!process.env.DB_CONNECT) {
            reject("❌ DB_CONNECT is not defined in .env file");
        } else {
            mongoose
                .connect(process.env.DB_CONNECT)
                .then(() => {
                    console.log("✅ Successfully connected to MongoDB");
                    resolve(app);
                })
                .catch((error) => {
                    console.error("❌ Failed to connect to MongoDB:", error);
                    reject(error);
                });
        }
    });
};

export default initApp;
