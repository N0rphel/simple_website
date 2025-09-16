const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// DB connection
const pool = new Pool({
	host: process.env.POSTGRES_HOST,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
});

// Ensure table exists
(async () => {
	await pool.query(`
    CREATE TABLE IF NOT EXISTS votes (
      id SERIAL PRIMARY KEY,
      choice VARCHAR(10) NOT NULL
    )
  `);
})();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// vote endpoints
app.post("/vote/:choice", async (req, res) => {
	const choice = req.params.choice;
	if (choice === "cat" || choice === "dog") {
		await pool.query("INSERT INTO votes(choice) VALUES($1)", [choice]);
	}
	res.redirect("/");
});

// API endpoint for results page
app.get("/api/results", async (req, res) => {
	const cats = await pool.query(
		"SELECT COUNT(*) FROM votes WHERE choice = 'cat'"
	);
	const dogs = await pool.query(
		"SELECT COUNT(*) FROM votes WHERE choice = 'dog'"
	);
	res.json({ cats: cats.rows[0].count, dogs: dogs.rows[0].count });
});

app.listen(port, () => {
	console.log(`Voting app running on port ${port}`);
});
