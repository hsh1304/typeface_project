require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const fileRoutes = require("./routes/files");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Express backend up" });
});

app.use("/api", fileRoutes);

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database connected & synced");

    app.listen(process.env.PORT || 8000, () =>
      console.log(`Server running on port ${process.env.PORT || 8000}`)
    );
  } catch (err) {
    console.error("Failed to start backend", err);
    process.exit(1);
  }
}

start();
