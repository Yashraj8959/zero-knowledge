import app from './src/app.js';
import { configDotenv } from 'dotenv';

configDotenv();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})