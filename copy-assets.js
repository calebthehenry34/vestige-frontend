const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, 'wild-sky-9d31a9.webflow');
const targetDir = path.join(__dirname, 'public');

// Copy Webflow assets to public directory
async function copyAssets() {
  try {
    // Copy CSS
    await fs.copy(
      path.join(sourceDir, 'css'),
      path.join(targetDir, 'css'),
      { overwrite: true }
    );

    // Copy fonts
    await fs.copy(
      path.join(sourceDir, 'fonts'),
      path.join(targetDir, 'fonts'),
      { overwrite: true }
    );

    // Copy images
    await fs.copy(
      path.join(sourceDir, 'images'),
      path.join(targetDir, 'images'),
      { overwrite: true }
    );

    // Copy JavaScript
    await fs.copy(
      path.join(sourceDir, 'js'),
      path.join(targetDir, 'js'),
      { overwrite: true }
    );

    console.log('Assets copied successfully!');
  } catch (err) {
    console.error('Error copying assets:', err);
    process.exit(1);
  }
}

copyAssets();
