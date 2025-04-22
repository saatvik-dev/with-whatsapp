const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Execute shell command and return promise
const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
};

// Main build and deploy process
async function buildAndDeploy() {
  try {
    // Ensure directories exist
    ensureDir('dist');
    ensureDir('dist/public');

    // Build client
    await execPromise('npx vite build');
    
    // Copy client build to dist/public
    await execPromise('cp -r client/dist/* dist/public/');
    
    // Build server for Firebase Functions
    await execPromise('npx esbuild server/firebase-production.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js');
    
    // Copy functions.js to dist directory
    await execPromise('cp functions.js dist/');
    
    // Create .env.local file in dist directory for Firebase Functions
    if (fs.existsSync('.env.local')) {
      await execPromise('cp .env.local dist/');
    } else {
      console.log('Warning: .env.local file not found. Make sure to set up environment variables in Firebase.');
    }
    
    console.log('Build completed successfully!');
    console.log('To deploy to Firebase, run: npx firebase deploy');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildAndDeploy();