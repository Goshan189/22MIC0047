const axios = require("axios");

const LOG_API = "http://4.224.186.213/evaluation-service/logs";

const Log = async (stack, level, pkg, message, token) => {
  try {
    await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.error("Logging failed:", err.message);
  }
};

module.exports = Log;