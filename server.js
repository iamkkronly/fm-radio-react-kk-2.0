import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import { build } from "esbuild";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Use lowercase file name
await build({
  entryPoints: ["./app.jsx"],
  bundle: true,
  outfile: "bundle.js",
  loader: { ".jsx": "jsx" },
  platform: "browser"
});

app.get("/api/stations", async (req, res) => {
  try {
    const response = await fetch("https://de1.api.radio-browser.info/json/stations");
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stations" });
  }
});

app.use(express.static(__dirname));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
