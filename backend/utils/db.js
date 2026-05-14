import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {
    try {
        // Fix for querySrv ECONNREFUSED error in some environments
        dns.setServers(['8.8.8.8']);

        await mongoose.connect(process.env.MONGO_URI, {
            // Connection pool settings for Node.js server
            maxPoolSize: 10,
            minPoolSize: 5,
            
            // Timeouts to fail fast on connection issues
            serverSelectionTimeoutMS: 5000,  // Fail if can't select server in 5s
            socketTimeoutMS: 45000,           // Socket timeout for operations
            connectTimeoutMS: 10000,          // Connection timeout
            
            // Retry logic for transient failures
            retryWrites: true,
            retryReads: true,
            maxStalenessSeconds: 120,
        });
        console.log('mongodb connected successfully.');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        console.error('Code:', error.code);
        
        // Helpful error messages
        if (error.code === 'ECONNREFUSED') {
            console.error('\n⚠️  ECONNREFUSED - Connection refused. Check:');
            console.error('  1. MongoDB Atlas cluster is running (not paused)');
            console.error('  2. Your IP is whitelisted in Atlas Network Access');
            console.error('  3. Internet connectivity / Firewall not blocking port 27017');
            console.error('  4. MONGO_URI is correct in .env file');
        }
        
        process.exit(1);
    }
}

export default connectDB;