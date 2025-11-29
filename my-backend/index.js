const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
    res.send("Server đang chạy...");
});


// Lấy danh sách người dùng
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Thêm người dùng
app.post('/users', (req, res) => {
  const { username, name, role, email, password, is_active } = req.body;
  const sql = 'INSERT INTO users (username, name, role, email, password, is_active) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(sql, [username, name, role, email, password, is_active], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Thêm người dùng thành công!', id: result.insertId });
  });
});


app.listen(3000, () => console.log("Server chạy tại http://localhost:3000"));
