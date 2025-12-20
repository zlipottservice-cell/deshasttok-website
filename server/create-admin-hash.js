const bcrypt = require('bcryptjs');

// Change this to your desired password
const password = 'admin123';

bcrypt.hash(password, 10).then(hash => {
    console.log('\n=================================');
    console.log('Password Hash Generated!');
    console.log('=================================');
    console.log('\nPassword:', password);
    console.log('\nHash:', hash);
    console.log('\n=================================');
    console.log('SQL Command to Create Admin User:');
    console.log('=================================\n');
    console.log(`INSERT INTO admin_users (username, password_hash) VALUES ('admin', '${hash}');\n`);
}).catch(err => {
    console.error('Error:', err);
});
