const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For hashing passwords

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Admin', 'User'], // Restrict roles to 'Admin' or 'UserModel'
        required: true
    }
});

// Pre-save middleware to hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Skip if password is not modified
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model('UserModel', userSchema);

module.exports = UserModel;
