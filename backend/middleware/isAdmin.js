
export const isAdmin = (req, res, next) => {

    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        console.error("isAdmin: Access denied. User role:", req.user?.role);
        return res.status(403).json({
            message: "Access denied : admins only"
        })
    }

} 