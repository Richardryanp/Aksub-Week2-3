const jwt = require("jsonwebtoken"); //import jwt

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key"; // ambil dri env ato default

function authRequired(req, res, next) { //middleware buat wajib login dulu
  const authHeader = req.headers.authorization; // ambil header authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) { // cek ada header atau ga. pake depan Bearer atau ga
    return res.status(401).json({ message: "Authentication required" }); // kalo ga eror
  }

  const token = authHeader.split(" ")[1]; // ambil index ke 1 ["Bearer", "12345"], yang diambil 12345

  try {
    const payload = jwt.verify(token, JWT_SECRET); // verify -> decode token trus di validasi. kalo valid dapet payload
    req.user = payload; // biar bisa dipake di middleware controller lain
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" }); // kalo token ga valid ato expire
  }
}

function authorizeRoles(...allowedRoles) { // allowed rolesnya bisa banyak
  return (req, res, next) => {
    if (!req.user) { // cek user uda login ato belom dari authRequired, kalo belom return eror
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) { // cek apa role usernya termasuk yg diijinin ga(contohnya kek admin doang yg bole gitu2)
      return res.status(403).json({ message: "Forbidden: insufficient permissions" }); // kalo ga return eror forbiden
    }

    next();
  };
}

module.exports = {
  authRequired,
  authorizeRoles,
};

