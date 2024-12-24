const express = require('express');
const multer = require('multer');
const path = require('path')
const app = express();

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb){
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({storage: storage});

app.post('/uploads', upload.single('file'), (req, res) => {
  if (!req.file){
    return res.status(400).json({error: 'No file uploaded'});
  }

  res.status(200).json({message: 'File uploaded successfully', filePath: `uploads/${req.file.filename}`});
});

app.use(express.static('public'));

const PORT = 4322;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
