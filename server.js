// Import app dari folder src (isinya express app)
const app = require("./src/app");

// Nentuin port server, kalo ada di env pake itu, kalo nggak default ke 3000
const PORT = process.env.PORT || 3000;

// Nyalain servernya, dengerin di port yang udah ditentuin
app.listen(PORT, () => {
  // Kalo server udah nyala, print pesan ke console
  console.log(`Server running on port ${PORT}`);
});