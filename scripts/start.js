const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getOS() {
  const platform = os.platform();
  if (platform === 'darwin') return 'MacOS';
  if (platform === 'win32') return 'Windows';
  return 'Linux';
}

function executeCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return false;
  }
}

function checkNodeModules() {
  return fs.existsSync(path.join(process.cwd(), 'node_modules'));
}

function installDependencies() {
  console.log('📦 Installing dependencies...');
  const command = getOS() === 'Windows' ? 'npm install' : 'npm install';
  return executeCommand(command);
}

function buildProject() {
  console.log('🏗️  Building project...');
  const command = getOS() === 'Windows' ? 'npm run build' : 'npm run build';
  return executeCommand(command);
}

function startProject() {
  console.log('🚀 Starting project...');
  const command = getOS() === 'Windows' ? 'npm run start' : 'npm run start';
  return executeCommand(command);
}

async function main() {
  console.log(`🖥️  Detected OS: ${getOS()}`);

  if (!checkNodeModules()) {
    console.log('📂 node_modules not found');
    if (!installDependencies()) {
      console.error('❌ Failed to install dependencies');
      process.exit(1);
    }
  }

  if (!buildProject()) {
    console.error('❌ Failed to build project');
    process.exit(1);
  }

  if (!startProject()) {
    console.error('❌ Failed to start project');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ An unexpected error occurred:', error);
  process.exit(1);
});
