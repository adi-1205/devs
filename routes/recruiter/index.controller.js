const { ReE, ReS } = require("../../helper");
const User = require("../../database/models/user.model");
const Job = require("../../database/models/job.model");
const bcrypt = require("bcryptjs");

const getRecruiter = async (req, res) => {
    try {
        const recruiter = await User.findById(req.user._id).select('-password');
        return ReS(res, 'Recruiter fetched successfully', recruiter);
    } catch (err) {
        console.log('Error in fetching recruiter', err);
        return ReE(res, 500, 'Internal server error');
    }
}

const updateRecruiter = async (req, res) => {
    try {
        const { firstName, lastName, password } = req.body;

        if (firstName && firstName === '') {
            return ReE(res, 400, 'First name cannot be empty');
        }

        if (lastName && lastName === '') {
            return ReE(res, 400, 'Last name cannot be empty');
        }

        // can add more password validation here
        if (password) {
            if (password === '' || password.length < 8) {
                return ReE(res, 400, 'Password cannot be empty or weak');
            }
            hashedPassword = await bcrypt.hash(password, 10);
        }

        await User.updateOne({ _id: req.user._id }, {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(password && { password: hashedPassword })
        }
        );

        return ReS(res, 'Recruiter updated successfully', {});
    } catch (err) {
        console.log('Error in updating recruiter', err);
        return ReE(res, 500, 'Internal server error');
    }
}

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ recruiter: req.user._id });
        return ReS(res, 'Jobs fetched successfully', jobs);
    } catch (err) {
        console.error("Error fetching job:", err);
        return ReE(res, 500, 'Internal server error');
    }
}

const addNote = async (req, res) => {
    try {
        const { jobId, content } = req.body;

        if (!jobId || !content) {
            return ReE(res, 400, 'Job ID and note are required');
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return ReE(res, 404, 'Job not found');
        }

        if(job.recruiter.toString() !== req.user._id.toString()) {
            return ReE(res, 403, 'You are not authorized to add notes to this job');
        }

        job.notes.push({content});
        await job.save();

        return ReS(res, 'Note added successfully', job);
    } catch (err) {
        console.error("Error adding note:", err);
        return ReE(res, 500, 'Internal server error');
    }
}

module.exports = {
    getRecruiter,
    updateRecruiter,
    getJobs,
    addNote,
};