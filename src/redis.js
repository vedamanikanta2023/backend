import { createClient } from "redis";
import express from "express";
const app = express();

async function Connect(){
    const redisClient = createClient();
    
    redisClient.on("error", (err) => console.error("Redis Client Error", err));
    return await redisClient.connect();
}
app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  // 1. Check cache
  const cachedUser = await redisClient.get(`user:${userId}`);
  if (cachedUser) {
    return res.json({ source: "cache", data: JSON.parse(cachedUser) });
  }

  // 2. Fetch from DB
  const user = await getUserFromDB(userId);

  // 3. Store in cache with TTL = 60 seconds
  await redisClient.setEx(`user:${userId}`, 60, JSON.stringify(user));

  res.json({ source: "db", data: user });
});

app.listen(3000, () => console.log("Server running on port 3000"));


