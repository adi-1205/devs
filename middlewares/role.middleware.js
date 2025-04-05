const { ReE } = require("../helper");

const authorize = (roles = []) => {
    if (typeof roles === 'string') {
      roles = [roles];
    }
  
    return (req, res, next) => {
        console.log(req.user.role, roles);
        
      if (!roles.includes(req.user.role)) {
        return ReE(res, 403, "Forbidden:");
      }
      next();
    };
  };
  
  module.exports = authorize;
  