const db = require('./DBConnection');
const User = require('./models/User');
const crypto = require('crypto');



function getUser(userId) {
    return db.query('SELECT * FROM user WHERE usr_id=?', [userId]).then(({results}) => {
        if(results[0]){
            console.log(`User retrieved for id ${userId}: ${results[0]}`);
            let newUser = new User(results[0]);
            console.log("New User: " + newUser);
            return newUser.toJSON();
        } else {
            console.log(`No such user with id: ${userId}`);
            throw new Error("User does not exist");
        }
    });
}

function createUser(userParam) {
    if(!userParam.name || !userParam.email || !userParam.password){
        throw new Error("Missing information");
    }
    return new Promise((resolve, reject) => {
        let hashedPassword;
        let bytes = crypto.randomBytes(10);
        let salt = bytes.toString('hex');
        crypto.pbkdf2(userParam.password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if (err) { //problem computing digest, like hash function not available
                reject(err);
            }

            hashedPassword = derivedKey.toString('hex');
            console.log("Hashed pw: " + hashedPassword);
            db.query('INSERT INTO user (usr_name, usr_email, usr_salt, usr_password) VALUES (?, ?, ?, ?)',
                [userParam.name, userParam.email, salt, hashedPassword]).then(({results}) => {
                    resolve(this.getUser(results.insertId));               
            });
        });
    });
}

function editUser(userId, userParam) {
    throw new Error("Not implemented yet");
}

function deleteUser(userId) {
    throw new Error("Not implemented yet");
}

function login(credentials) {
    let email = credentials.email;
    let password = credentials.password;
    return db.query('SELECT * FROM user WHERE usr_email=?', [email]).then(({results}) => {
        const user = new User(results[0]);
        if (user) { // we found our user
            return user.validatePassword(password);
        }
        else { // if no user with provided username
            console.log(`No such user with credentials: ${credentials}`);
            throw new Error("No such user");
        }
    });
}

module.exports = {
    getUser: getUser,
    createUser:createUser,
    editUser:editUser,
    deleteUser:deleteUser,
    login:login
};