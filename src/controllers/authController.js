const bcrypt = require("bcrypt"); // import library bcrypt buat hashing password ama compare
const jwt = require("jsonwebtoken"); // generate token JWT buat login
const prisma = require("../config/prisma"); 

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key"; // ambil dari env, atau ga defaultnya
const JWT_EXPIRES_IN = "1h"; // toker berlaku selama 1 jam

function isValidPassword(password) {
  const hasUppercase = /[A-Z]/.test(password); //cek password ada huruf besar ato ga 
  const hasNumber = /[0-9]/.test(password); // cek ada angka atau ga
  return password.length >= 8 && hasUppercase && hasNumber; // valid kalo panjangnya 8 lebih trus hasuppercase and hasnumber valid
}

async function register(req, res) {
  const { name, email, password, dateOfBirth } = req.body; // ambil data dari request body

  if (!name || !email || !password || !dateOfBirth) { // pastiin semuanya ada
    return res.status(400).json({ message: "name, email, password, and dateOfBirth are required" });
  }

  if (!isValidPassword(password)) { // cek passwordnya valid atau ga, kalo ga return eror
    return res.status(400).json({
      message: "Password must be at least 8 characters and contain 1 uppercase letter and 1 number",
    });
  }

  const existing = await prisma.user.findUnique({ where: { email } }); // cek email udah ada ato belom
  if (existing) { // kalo ada tolak request
    return res.status(409).json({ message: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10); // hash password, salt roundnya 10 kali

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash, // password disimpen dalam bentuk hash biar ga plain text
      role: "reader", // role defaultnya reader
      dateOfBirth: new Date(dateOfBirth), // diconvert ke date object 
    },
  });

  return res.status(201).json({ // balikin respon ke user, tapi password ga dikirim
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}

async function login(req, res) {
  const { email, password } = req.body; // ambil email passwor dari request body

  if (!email || !password) { // kalo gaada return error
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } }); // cek user dari email
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" }); // kalo ganemu return error
  }

  const match = await bcrypt.compare(password, user.password); // Compare password yang dimasukin sama hash di DB
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" }); // kalo ga match return error
  }

  const token = jwt.sign( // buat jwt tokenn
    {
      id: user.id,
      email: user.email,
      role: user.role, // payloadnya dari id email role
    },
    JWT_SECRET, // sign pake secret key
    { expiresIn: JWT_EXPIRES_IN }, // token berlaku selama 1 jam 
  );

  return res.json({ // return ke user
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

async function assignRole(req, res) { // ubah role user
  const { email, role } = req.body; // ambil dari req body

  if (!email || !role) { // cek input
    return res.status(400).json({ message: "email and role are required" });
  }

  const allowedRoles = ["writer", "editor"]; // ini daftar role yg bole di assign
  if (!allowedRoles.includes(role)) { // kalo role ga valid return error
    return res.status(400).json({ message: "role must be either writer or editor" });
  }

  const user = await prisma.user.findUnique({ where: { email } }); // cari user berdasarkan email
  if (!user) {
    return res.status(404).json({ message: "User not found" }); // kalo gaada return error
  }

  const updated = await prisma.user.update({ //update role user di db
    where: { email },
    data: { role },
  });

  return res.json({ // return ke user
    id: updated.id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
  });
}

module.exports = {
  register,
  login,
  assignRole,
};

