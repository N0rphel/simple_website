const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Initialize SQLite DB
const db = new sqlite3.Database("./votes.db", (err) => {
	if (err) console.error(err.message);
	else console.log("Connected to SQLite DB");
});

// Create votes table if not exists
db.run(`CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  choice TEXT NOT NULL
)`);

// API: vote endpoint
app.post("/vote", (req, res) => {
	const { choice } = req.body;
	if (!["cat", "dog"].includes(choice))
		return res.status(400).send("Invalid choice");
	db.run("INSERT INTO votes(choice) VALUES(?)", [choice], function (err) {
		if (err) return res.status(500).send(err.message);
		res.json({ success: true });
	});
});

// API: results endpoint
app.get("/results", (req, res) => {
	db.all(
		`SELECT choice, COUNT(*) as count FROM votes GROUP BY choice`,
		[],
		(err, rows) => {
			if (err) return res.status(500).send(err.message);
			const results = { cat: 0, dog: 0 };
			rows.forEach((row) => {
				results[row.choice] = row.count;
			});
			res.json(results);
		}
	);
});

app.listen(port, () => console.log(`Voting app running on port ${port}`));
