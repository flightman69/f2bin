# f2bin

f2bin is a file-to-binary converter web application. It can convert any type of file into binary data. This project is an extension of the original `mp3tobin` program written in Rust, now equipped with a web interface. Currently, it supports converting files to binary, with plans to add reverse conversion (binary back to files) and more features in the future.

## Dependencies

This project relies on the following dependencies:

<details>
  <summary>Node.js and npm</summary>

  - **Why?** Node.js is used to run the backend server (Express.js), while npm is used to manage JavaScript packages.
  - **Installation:**
    ```bash
    # For Linux:
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # For macOS (Homebrew):
    brew install node

    # For Windows:
    Download and install from https://nodejs.org/
    ```
</details>

<details>
  <summary>Express.js, fs, and multer</summary>

  - **Why?** These packages are required for the backend server:
    - `express`: Handles HTTP requests and serves the frontend.
    - `fs`: Used to interact with the file system.
    - `multer`: Middleware for handling file uploads.
  - **Installation:**
    ```bash
    npm install express fs multer
    ```
</details>

<details>
  <summary>Rust and Cargo</summary>

  - **Why?** Rust is needed to compile the `mp3tobin` program, which performs the file-to-binary conversion.
  - **Installation:**
    ```bash
    # For Linux and macOS:
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

    # For Windows:
    Download and install from https://rustup.rs/
    ```
</details>

## Setting Up

1. Clone the `f2bin` repository:
   ```bash
   git clone git@github.com:flightman69/f2bin.git
   cd f2bin
   ```

2. Initialize npm and install the required packages:
   ```bash
   npm init -y
   npm install express fs multer
   ```

3. Clone the `mp3tobin` repository and build the Rust binary:
   ```bash
   git clone git@github.com:flightman69/mp3tobin.git
   cd mp3tobin
   cargo build --release
   ```

4. Copy the compiled binary to the `f2bin` folder:
   ```bash
   cp target/release/mp3tobin ../f2bin/
   cd ../f2bin
   ```

## Running

1. Start the server:
   ```bash
   node server.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:4322
   ```

3. Upload a file, click "Convert," and download the converted binary file.

## Future Roadmap

### Core Features
- [ ] **Reverse Conversion (Binary to Original File)** (High Priority)
- [ ] **Improved Web UI Design** (High Priority)

### Upcoming Features
- [ ] **Dockerization** (Medium Priority)
- [ ] **Binary to Video Conversion** (Medium Priority)

### Optional Enhancements
- [ ] **Encryption for Binary Files** (Low Priority)

