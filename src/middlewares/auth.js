export const authorizeRole = (role) => {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ status: "error", error: "No autorizado" });

        if (req.user.role !== role)
            return res.status(403).json({ status: "error", error: "Acceso denegado" });

        next();
    };
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ status: "error", error: "Acceso denegado" });
    }
};