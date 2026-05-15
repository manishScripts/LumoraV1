import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({ override: true });

console.log("Cloudinary Config:");
console.log("- Cloud Name:", process.env.CLOUD_NAME);
console.log("- API Key Length:", process.env.API_KEY ? process.env.API_KEY.length : 0);
console.log("- API Secret Length:", process.env.API_SECRET ? process.env.API_SECRET.length : 0);

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
export default cloudinary;