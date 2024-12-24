const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

let lastUploadedFile = null; // Keep track of the latest uploaded file

// Upload endpoint
app.post('/uploads', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  lastUploadedFile = req.file.filename; // Store the filename of the last uploaded file
  res.status(200).json({
    message: 'File uploaded successfully',
    filePath: `uploads/${req.file.filename}`,
  });
});

// Convert endpoint
app.post('/convert', (req, res) => {
  if (!lastUploadedFile) {
    return res.status(400).json({ error: 'No file available for conversion' });
  }

  const filePath = path.join(__dirname, 'uploads', lastUploadedFile);

  exec(`mp3tobin -b ${filePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running mp3tobin: ${error.message}`);
      return res.status(500).json({ error: 'Failed to process file with mp3tobin' });
    }

    console.log(`mp3tobin output: ${stdout}`);
    res.status(200).json({
      message: 'File processed successfully',
      filePath: `uploads/${lastUploadedFile}`,
    });
  });
});

// Serve static files
app.use(express.static('public'));

const PORT = 4322;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Download endpoint
app.get('/uploads', (req, res) => {
  const uploadsDir = path.join(__dirname, 'uploads');
  const files = fs.readdirSync(uploadsDir);

  if (files.length === 0) {
    return res.status(404).json({ error: 'No files available for download' });
  }

  const latestFile = files.reduce((a, b) => {
    const fileA = fs.statSync(path.join(uploadsDir, a)).mtime;
    const fileB = fs.statSync(path.join(uploadsDir, b)).mtime;
    return fileA > fileB ? a : b;
  });

  const filePath = path.join(uploadsDir, latestFile);
  console.log(`Serving file: ${filePath}`); // Debugging log

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath, latestFile, (err) => {
    if (err) {
      console.error(`Error downloading file: ${err.message}`);
      res.status(500).json({ error: 'Failed to download file' });
    }
  });
});
