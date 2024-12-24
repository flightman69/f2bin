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
let lastConvertedFile = null; // Keep track of the latest converted file
let originalFileName = null; // Keep track of the original uploaded file name

// Upload endpoint
app.post('/uploads', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  lastUploadedFile = req.file.filename; // Store the filename of the last uploaded file
  originalFileName = req.file.originalname; // Store the original file name
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
  const convertedFileName = `${path.basename(lastUploadedFile, path.extname(lastUploadedFile))}_binary.txt`; // Conversion output file
  const convertedFilePath = path.join(__dirname, 'uploads', convertedFileName);

  exec(`./mp3tobin -b ${filePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running mp3tobin: ${error.message}`);
      return res.status(500).json({ error: 'Failed to process file with mp3tobin' });
    }

    lastConvertedFile = convertedFileName; // Store the converted file name with "_binary" suffix
    console.log(`mp3tobin output: ${stdout}`);
    res.status(200).json({
      message: 'File processed successfully',
      filePath: `uploads/${convertedFileName}`,
    });
  });
});

// Download endpoint
app.get('/uploads', (req, res) => {
  if (!lastConvertedFile || !originalFileName) {
    return res.status(404).json({ error: 'No converted file available for download' });
  }

  const convertedFilePath = path.join(__dirname, 'uploads', lastConvertedFile);
  if (!fs.existsSync(convertedFilePath)) {
    console.error(`File not found: ${convertedFilePath}`);
    return res.status(404).json({ error: 'Converted file not found' });
  }

  const originalFileNameWithoutExt = path.basename(originalFileName, path.extname(originalFileName));
  const downloadFileName = `${originalFileNameWithoutExt}_binary.txt`; // New download name

  res.download(convertedFilePath, downloadFileName, (err) => {
    if (err) {
      console.error(`Error downloading file: ${err.message}`);
      res.status(500).json({ error: 'Failed to download file' });
    }
  });
});

// Serve static files
app.use(express.static('public'));

const PORT = 4322;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
