const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");

const MONGO_URL = process.env.MONGO_URL;

const demoUsers = [
    {
        firstName: "John",
        lastName: "Doe",
        email: "john@demo.com",
        username: "johndoe",
        role: "Developer",
        department: "Engineering",
        password: "demo123",
    },
    {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@demo.com",
        username: "janesmith",
        role: "Designer",
        department: "Design",
        password: "demo123",
    },
    {
        firstName: "Alex",
        lastName: "Johnson",
        email: "alex@demo.com",
        username: "alexj",
        role: "Manager",
        department: "Operations",
        password: "demo123",
    },
];

async function seedUsers() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");

        for (const userData of demoUsers) {
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                console.log(`User ${userData.email} already exists, skipping...`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const newUser = new User({
                ...userData,
                password: hashedPassword,
            });

            await newUser.save();
            console.log(`Created user: ${userData.firstName} ${userData.lastName} (${userData.email})`);
        }

        console.log("\n--- Demo Users Created ---");
        console.log("You can login with any of these accounts:");
        console.log("  Email: john@demo.com  | Password: demo123");
        console.log("  Email: jane@demo.com  | Password: demo123");
        console.log("  Email: alex@demo.com  | Password: demo123");

        await mongoose.disconnect();
        console.log("\nDisconnected from MongoDB");
    } catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1);
    }
}

seedUsers();
