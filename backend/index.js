import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";
 
dotenv.config({ override: true });
console.log("CWD:", process.cwd());
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("PORT:", process.env.PORT);


const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// Dynamic CORS origin based on environment
const allowedOrigins = process.env.URL ? process.env.URL.split(',') : [];
const corsOptions = {
    origin: (origin, callback) => {
        // Allow same-origin requests or listed origins
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));

// yha pr apni api ayengi
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.resolve(__dirname, "frontend", "dist");
    console.log("Serving static files from:", frontendPath);
    app.use(express.static(frontendPath));
    
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(frontendPath, "index.html"), (err) => {
            if (err) {
                console.error("Error sending index.html:", err);
                res.status(500).send(err);
            }
        });
    })
} else {
    app.get("/", (req, res) => {
        res.status(200).json({ message: "Welcome to the Lumora API!" });
    });
}





server.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});