import { createConnection } from 'typeorm';
import { runMigrations } from 'typeorm-extension';
import logger from '../utils/logger';

const runMigrationsScript = async () => {
  try {
    const connection = await createConnection();
    logger.info('Database connection established for migrations');

    await runMigrations(connection);
    logger.info('Migrations completed successfully');

    await connection.close();
  } catch (error) {
    logger.error('Migration error:', error);
    process.exit(1);
  }
};

// Handle command line arguments
const command = process.argv[2];

switch (command) {
  case 'run':
    runMigrationsScript();
    break;
  case 'revert':
    // Add revert logic if needed
    logger.info('Revert migrations not implemented yet');
    break;
  default:
    logger.info('Usage: npm run migration:run or npm run migration:revert');
    break;
}
