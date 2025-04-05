const { ReE, ReS } = require("../../helper");
const User = require("../../database/models/user.model");
const bcrypt = require("bcryptjs");
const { ROLE } = require("../../config/constants");

const getAdmin = async (req, res) => {
    try {
        const admin = await User.findById(req.user._id).select('-password');
        return ReS(res, 'Admin fetched successfully', admin);
    } catch (err) {
        console.log('Error in fetching admin', err);
        return ReE(res, 500, 'Internal server error');
    }
}

const updateAdmin = async (req, res) => {
    try {
        const { firstName, lastName, password } = req.body;
        let hashedPassword = null;

        if (firstName && firstName === '') {
            return ReE(res, 400, 'First name can not be empty');
        }

        if (lastName && lastName === '') {
            return ReE(res, 400, 'Last name can not be empty');
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
        return ReS(res, 'Admin updated successfully', {});
    } catch (err) {
        console.log('Error in updating admin', err);
        return ReE(res, 500, 'Internal server error');
    }
}


const getRecruiters = async (req, res) => {
    try {
        const recruiters = await User.find({ role: ROLE.RECRUITER }).select('-password');
        return ReS(res, 'Recruiters fetched successfully', recruiters);
    } catch (err) {
        console.log('Error in fetching recruiter', err);
        return ReE(res, 500, 'Internal server error');
    }
}

const getRecruiterById = async (req, res) => {
    try {
        const { id } = req.params;
        const recruiter = await User.findById(id).select('-password');
        if (!recruiter) {
            return ReE(res, 404, 'Recruiter not found');
        }
        return ReS(res, 'Recruiter fetched successfully', recruiter);
    } catch (err) {
        console.log('Error in fetching recruiter', err);
        return ReE(res, 500, 'Internal server error');
    }
}

const createRecruiter = async (req, res) => {
    try {
        const { email, password } = req.body;

        const exiting = await User.findOne({ email });

        if (exiting) {
            return ReE(res, 400, 'Recruiter already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { _doc } = await User.create({
            ...req.body,
            password: hashedPassword,
            role: ROLE.RECRUITER,
        });

        const { _id, password: _, ...user } = _doc;

        return ReS(res, 'Recruiter created successfully', user);
    } catch (err) {
        console.log('Error in creating recruiter', err);
        return ReE(res, 500, 'Internal server error');
    }
}

const updateRecruiter = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, role, ...data } = req.body;

        let recruiter = await User.findById(id);
        let updatedData = {};

        if (!recruiter) {
            return ReE(res, 404, 'Recruiter not found');
        }

        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail && existingEmail._id.toString() !== id) {
                return ReE(res, 400, 'Email already exists');
            }
            updatedData.email = email;
        }

        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        const updated = await User.updateOne({ _id: id }, { ...data, ...updatedData });

        return ReS(res, 'Recruiter updated successfully', updated);
    } catch (err) {
        console.log('Error in updating recruiter', err);
        return ReE(res, 500, 'Internal server error');
    }
}

const deleteRecruiter = async (req, res) => {
    try {
        const { id } = req.params;
        const recruiter = await User.findById(id);

        if (!recruiter) {
            return ReE(res, 404, 'Recruiter not found');
        }

        await User.deleteOne({ _id: id });

        return ReS(res, 'Recruiter deleted successfully', {});
    } catch (err) {
        console.log('Error in deleting recruiter', err);
        return ReE(res, 500, 'Internal server error');
    }
}

const getClients = async (req, res) => {
    try {
        const clients = await User.find({ role: ROLE.CLIENT }).select('-password');
        return ReS(res, 'Clients fetched successfully', clients);
    } catch (err) {
        console.log('Error in fetching clients', err);
        return ReE(res, 500, 'Internal server error');
    }
}

const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await User.findById(id).select('-password');
        if (!client) {
            return ReE(res, 404, 'Client not found');
        }
        return ReS(res, 'Client fetched successfully', client);
    } catch (err) {
        console.log('Error in fetching client', err);
        return ReE(res, 500, 'Internal server error');
    }
}

const createClient = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existing = await User.findOne({ email });

        if (existing) {
            return ReE(res, 400, 'Client already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { _doc } = await User.create({
            ...req.body,
            password: hashedPassword,
            role: ROLE.CLIENT,
        });

        const { _id, password: _, ...user } = _doc;

        return ReS(res, 'Client created successfully', user);
    } catch (err) {
        console.log('Error in creating client', err);
        return ReE(res, 500, 'Internal server error');
    }
}

const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, role ,...data } = req.body;

        let client = await User.findById(id);
        let updatedData = {};

        if (!client) {
            return ReE(res, 404, 'Client not found');
        }

        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail && existingEmail._id.toString() !== id) {
                return ReE(res, 400, 'Email already exists');
            }
            updatedData.email = email;
        }

        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        const updated = await User.updateOne({ _id: id }, { ...data, ...updatedData });

        return ReS(res, 'Client updated successfully', updated);
    } catch (err) {
        console.log('Error in updating client', err);
        return ReE(res, 500, 'Internal server error');
    }
}

const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await User.findById(id);

        if (!client) {
            return ReE(res, 404, 'Client not found');
        }

        await User.deleteOne({ _id: id });

        return ReS(res, 'Client deleted successfully', {});
    } catch (err) {
        console.log('Error in deleting client', err);
        return ReE(res, 500, 'Internal server error');
    }
}

module.exports = {
    getAdmin,
    updateAdmin,
    getRecruiters,
    createRecruiter,
    updateRecruiter,
    getRecruiterById,
    deleteRecruiter,
    getClients,
    createClient,
    updateClient,
    getClientById,
    deleteClient,
};