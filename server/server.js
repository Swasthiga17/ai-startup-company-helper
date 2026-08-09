const app = require('./app');
const sequelize = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 8000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });
