// documentModel.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    fileName: String,
    filePath: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Document', documentSchema);
