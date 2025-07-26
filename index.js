// // index.js
import express from "express";
import dotenv from "dotenv";
import tokenRoutes from "./routes/tokenRoutes.js";
import tallyRoutes from "./routes/tallyRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//token naviggate
// Redirect root to token.html
app.get("/", (req, res) => {
  res.redirect("/token.html");
});

//api routes
app.use("/api", tokenRoutes);
app.use("/api/tally", tallyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/token.html`);
});

// import express from "express";
// import tokenRoutes from "./routes/tokenRoutes.js";
// import tallyRoutes from "./routes/tallyRoutes.js";

// const app = express();
// app.use(express.json());
// app.use(express.static("public"));

// app.use("/api", tokenRoutes); // /api/generate-token
// app.use("/api/tally", tallyRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
