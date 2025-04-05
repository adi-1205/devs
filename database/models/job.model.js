const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }, { _id: true });

const jobSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    notes: [noteSchema],
}, { timestamps: true });

module.exports = mongoose.model('job', jobSchema);