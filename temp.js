
const bcrypt = require('bcrypt');

async function hashPassword() {
  const password = 'admin';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
}

hashPassword();
