const connection = require("../config/connection");
const User = require("../models/User");
const Thought = require("../models/Thought");
const { usersData, thoughtsData } = require("./data");

connection.once("open", async () => {
  console.log("connected");

  let usersCheck = await connection.db
    .listCollections({ name: "users" })
    .toArray();
  if (usersCheck.length) {
    await connection.dropCollection("users");
  }

  let thoughtsCheck = await connection.db
    .listCollections({ name: "thoughts" })
    .toArray();
  if (thoughtsCheck.length) {
    await connection.dropCollection("thoughts");
  }

  try {
    const users = [];
    for (const userData of usersData) {
      const { username, email } = userData;
      const user = await User.create({ username, email });
      users.push(user);
    }

    const thoughts = [];
    for (const thoughtData of thoughtsData) {
      const { thoughtText, username } = thoughtData;

      const user = users.find((user) => user.username === username);
      if (!user) {
        throw new Error(`User with username '${username}' not found.`);
      }

      const thought = await Thought.create({
        thoughtText,
        username,
        user: user._id,
      });
      thoughts.push(thought);

      user.thoughts.push(thought._id);
      await user.save();
    }

    console.log("usersData:", users);
    console.log("thoughtsData:", thoughts);

    console.log("_________DATA____SEEDED__________");
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    process.exit(0);
  }
});