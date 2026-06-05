const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { HTTP_STATUS } = require("./constants");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(HTTP_STATUS.OK).json({ status: "ok" });
});

const adminRoutes = require("./routes/admin.routes");
const ratingRoutes = require("./routes/rating.routes");
const storeRoutes = require("./routes/store.routes");

app.use("/api/admin", adminRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/stores", storeRoutes);

// app.use("/api/auth", require("./routes/auth.routes"));
app.use(errorHandler);

module.exports = app;
