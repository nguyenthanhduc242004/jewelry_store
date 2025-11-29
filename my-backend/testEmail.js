require("dotenv").config();
const sendEmail = require("./utils/sendEmail"); 

const testRecipient = "emailnhan@gmail.com";

sendEmail(
  testRecipient,
  "Test email"
)
  .then(() => console.log("Gửi email thành công!"))
  .catch((err) => console.error("Lỗi gửi email:", err));
