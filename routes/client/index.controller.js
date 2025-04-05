const { ROLE } = require("../../config/constants");
const Job = require("../../database/models/job.model");
const User = require("../../database/models/user.model");
const { ReE, ReS } = require("../../helper");

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ client: req.user._id });
        return ReS(res, 'Jobs fetched successfully', jobs);
    } catch (err) {
        console.error("Error fetching job:", err);
        return ReE(res, 500, 'Internal server error');
    }
}

const createJob = async (req, res) => {
    try {
        const { title } = req.body;
        clientId = req.user._id;

        if (!title) {
            return ReE(res, 400, 'Title is required');
        }

        const randomRecruiter = await User.aggregate([
            { $match: { role: ROLE.RECRUITER } },
            { $sample: { size: 1 } }
        ]);

        const recruiterId = randomRecruiter.length > 0 ? randomRecruiter[0]._id : null;

        if (!recruiterId) {
            return ReE(res, 400, 'No recruiter available');
        }

        const job = await Job.create({
            title,
            client: clientId,
            recruiter: recruiterId,
            notes: [],
        })

        return ReS(res, 'Job created successfully', job);
    } catch (err) {
        console.error("Error creating job:", err);
        return ReE(res, 500, 'Internal server error');
    }
}

module.exports = {
    getJobs,
    createJob,
};