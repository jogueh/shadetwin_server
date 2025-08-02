import dotenv from 'dotenv';
dotenv.config();
import app from "./app";
import mongoose from 'mongoose';   
import env from "./utils/validateEnv";
import prisma from "./prisma";

const PORT = env.PORT;

mongoose.connect(env.MONGO_CONNECTION_STRING)
.then(() => { // defines what to do when connection succeeds
  console.log('Connected to MongoDB');

  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  const shutdown = async () => {
      console.log('\nShutting down gracefully...');
      try{
        await prisma.$disconnect();
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB and Prisma');
      } catch (err){
        console.error('Error during disconnection:', err);
      } finally {
          server.close(() => {
          console.log('HTTP server closed');
          process.exit(0);
      });
      }
    };
  process.on('SIGINT', shutdown); // e.g. Ctrl+C
  process.on('SIGTERM', shutdown); // e.g. kill command/cloud provider shutdown
  process.once('SIGUSR2', async () => { // nodemon restarts
    console.log('SIGUSR2 received, restarting gracefully...');
    await prisma.$disconnect();
    await mongoose.disconnect();
    process.kill(process.pid, 'SIGUSR2');
  });
}).catch(console.error);

