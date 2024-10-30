
async function adminGuard(req, res, next) {
    try {
        const userRole = req.user.role;   
    
        if (userRole === "Admin") {
            return next();
        } else {
            throw { name: "Forbidden", message: "You can only modify your product" };
        }

    } catch (error) {
        next(error);
    }
}

module.exports = { adminGuard };
