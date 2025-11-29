const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const resultWrapper = require("../utils/resultWrapper");
const sendEmail = require("../utils/sendEmail");

const {
    createUser,
    findUserByEmail,
    activateUser
} = require("../models/userModel");

// REGISTER
exports.register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        const [exist] = await findUserByEmail(email);
        if (exist.length > 0) {
            return res.json(resultWrapper(false, 400, "Email đã tồn tại"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(name, username, email, hashedPassword);

        const token = jwt.sign(
            { email, created_at: Date.now() }, 
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        console.log("🔑 Token tạo ra:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const activationLink = `http://localhost:3000/api/auth/activate/${token}`;

        await sendEmail(
            email,
            "Kích hoạt tài khoản",
            `Nhấn vào link để kích hoạt: ${activationLink}`
        );

        res.json(resultWrapper(true, 201, "Đăng ký thành công. Kiểm tra email để kích hoạt."));
    } catch (err) {
        console.error("Lỗi register:", err); // log lỗi chi tiết
        res.json(resultWrapper(false, 500, "Lỗi server"));
    }
};

// ACTIVATE ACCOUNT
exports.activateAccount = async (req, res) => {
    try {
        const token = decodeURIComponent(req.params.token);

        console.log("📥 Token nhận:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("📤 Payload:", decoded);
        const [user] = await findUserByEmail(decoded.email);
        if (user.length === 0)
            return res.json(resultWrapper(false, 400, "Token không hợp lệ"));

        await activateUser(decoded.email);

        res.json(resultWrapper(true, 200, "Kích hoạt tài khoản thành công"));
    } catch (err) {
        console.error("❌ Lỗi verify:", err);
        res.json(resultWrapper(false, 400, "Token hết hạn hoặc không hợp lệ"));
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [rows] = await findUserByEmail(email);
        if (rows.length === 0)
            return res.json(resultWrapper(false, 400, "Email không tồn tại"));

        const user = rows[0];

        if (user.is_active === 0)
            return res.json(resultWrapper(false, 403, "Tài khoản chưa kích hoạt"));

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.json(resultWrapper(false, 401, "Sai mật khẩu"));

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json(resultWrapper(true, 200, "Đăng nhập thành công", { token }));
    } catch (err) {
        res.json(resultWrapper(false, 500, "Lỗi server"));
    }
};
