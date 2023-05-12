const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
  cloud_name: "dhvrlz7xq",
  api_key: "984659317584171",
  api_secret: "bpYEFDgfPdSKV1NzgCH4uLdinuM"
});

module.exports = cloudinary;