#!/usr/bin/env node

import { exec } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

async function initializeFirebase() {
  try {
    // Ask for Firebase project ID
    const projectId = await new Promise((resolve) => {
      rl.question('Enter your Firebase project ID: ', (answer) => {
        resolve(answer.trim());
      });
    });

    if (!projectId) {
      console.error('Firebase project ID is required');
      process.exit(1);
    }

    // Update .firebaserc
    await execPromise(`echo '{"projects":{"default":"${projectId}"}}' > .firebaserc`);
    console.log(`Updated .firebaserc with project ID: ${projectId}`);

    // Login to Firebase
    await execPromise('npx firebase login');

    // Initialize Firebase
    console.log('Initializing Firebase...');
    console.log('Please select "Hosting" and "Functions" when prompted');
    console.log('For the public directory, enter: dist/public');
    console.log('For single-page app, select: Yes');
    await execPromise('npx firebase init');

    console.log('\n');
    console.log('Firebase initialization completed!');
    console.log('\n');
    console.log('Next steps:');
    console.log('1. Update your .env.local file with your Firebase config values');
    console.log('2. Run the build script: node build-deploy.js');
    console.log('3. Deploy to Firebase: npx firebase deploy');

  } catch (error) {
    console.error('Firebase initialization failed:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

initializeFirebase();