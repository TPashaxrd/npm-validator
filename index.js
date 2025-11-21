function validator(options = {}) {
  const { 
    email = {}, 
    phone = {}, 
    username = {} 
  } = options;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?\d{7,15}$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

  const sanitize = str => {
    if (typeof str !== "string") return str;
    return str
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/["']/g, "")
      .replace(/\$/g, "")
      .trim();
  };

  return (req, res, next) => {
    const body = req.body || {};

    for (let key in body) {
      if (typeof body[key] === "string") {
        body[key] = sanitize(body[key]);
      }
    }

    if (email.required) {
      if (!body.email || !emailRegex.test(body.email)) {
        return res.status(400).json({ message: "Invalid email" });
      }
    }
    if (email.minLength && body.email && body.email.length < email.minLength) {
      return res.status(400).json({ message: `Email must be at least ${email.minLength} chars` });
    }
    if (email.maxLength && body.email && body.email.length > email.maxLength) {
      return res.status(400).json({ message: `Email must be at most ${email.maxLength} chars` });
    }

    if (phone.required) {
      if (!body.phone || !phoneRegex.test(body.phone)) {
        return res.status(400).json({ message: "Invalid phone" });
      }
    }
    if (phone.minLength && body.phone && body.phone.length < phone.minLength) {
      return res.status(400).json({ message: `Phone must be at least ${phone.minLength} digits` });
    }
    if (phone.maxLength && body.phone && body.phone.length > phone.maxLength) {
      return res.status(400).json({ message: `Phone must be at most ${phone.maxLength} digits` });
    }

    if (username.required && !body.username) {
      return res.status(400).json({ message: "Username required" });
    }
    if (body.username) {
      if (!usernameRegex.test(body.username)) {
        return res.status(400).json({ message: "Invalid username" });
      }
      if (username.minLength && body.username.length < username.minLength) {
        return res.status(400).json({ message: `Username must be at least ${username.minLength} chars` });
      }
      if (username.maxLength && body.username.length > username.maxLength) {
        return res.status(400).json({ message: `Username must be at most ${username.maxLength} chars` });
      }
    }

    req.body = body;
    next();
  };
}

module.exports = validator;