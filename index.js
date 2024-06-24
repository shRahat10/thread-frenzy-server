// external imports 
const mongoose = require("mongoose");
require("dotenv").config();

// internal imports 
const app = require("./app");

// database connection 
mongoose
    .connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'thread-frenzy',
    })
    .then(async () => {
        // await User.updateMany({}, { $set: { modelStatus: "none" } });

        console.log("Connected to MongoDB.");
    })
    .catch((error) => console.log(error.message));

// establish server port 

app.get('/', (req, res, next) => {
    res.send("Server is running");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}.`);
});

