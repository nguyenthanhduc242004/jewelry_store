const db = require("../config/db");

exports.createUser = (name, username, email, password) => {
    return db.query(
        "INSERT INTO users (name, username, email, password, role, is_active) VALUES (?, ?, ?, ?, ?, ?)",
        [name, username, email, password, "user", 0]
    );
};

exports.findUserByEmail = (email) => {
    return db.query("SELECT * FROM users WHERE email = ?", [email]);
};

exports.activateUser = (email) => {
    return db.query("UPDATE users SET is_active = 1 WHERE email = ?", [email]);
};
