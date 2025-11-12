

const fs = require('fs').promises;
const path = require('path');

async function clean() {
  const directories = [
    '.next',
    'node_modules/.cache'
  ];

  console.log('🧹 Cleaning build cache...');
  
  for (const dir of directories) {
    try {
      await fs.rm(path.join(__dirname, '..', dir), { 
        recursive: true, 
        force: true 
      });
      console.log(`✅ Removed ${dir}`);
    } catch (error) {
      console.log(`⚠️  ${dir} not found or already removed`);
    }
  }
  
  console.log('🎉 Cleanup completed!');
}

clean().catch(console.error);
