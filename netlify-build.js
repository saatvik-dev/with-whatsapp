import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

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

// Main build process for Netlify
async function buildForNetlify() {
  try {
    // Ensure directories exist
    ensureDir('dist');
    ensureDir('dist/public');
    ensureDir('netlify/functions');

    // Build client (Vite is already configured to output to dist/public)
    await execPromise('npx vite build');
    
    // Create a _redirects file to handle API proxying
    const redirectsContent = `
# API routes to Netlify Functions
/api/*  /.netlify/functions/api/:splat  200

# All other routes go to index.html for SPA routing
/*    /index.html   200
`;
    
    fs.writeFileSync('./dist/public/_redirects', redirectsContent);
    
    console.log('Build for Netlify completed successfully!');
    console.log('To deploy to Netlify:');
    console.log('1. Push this repository to GitHub');
    console.log('2. Create a new site in Netlify and connect to your GitHub repository');
    console.log('3. Set the build command to: npm run build');
    console.log('4. Set the publish directory to: dist/public');
    console.log('5. Set environment variables in Netlify dashboard');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildForNetlify();