const jwt = require("jsonwebtoken");
const resultWrapper = require("../utils/resultWrapper");

module.exports = (req, res, next) => {
    const header = req.headers["authorization"];
    if (!header)
        return res.json(resultWrapper(false, 401, "Không có token"));

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.json(resultWrapper(false, 403, "Token không hợp lệ"));
    }
};
