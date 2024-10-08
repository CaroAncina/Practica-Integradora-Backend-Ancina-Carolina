export const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    res.redirect("/login?error=Debe iniciar sesión para acceder a esta página");
  }
};

export const isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    res.redirect("/profile?info=Ya estás autenticado");
  }
};

export const isAdminOrPremium = (req, res, next) => {
  if (
    req.session.user &&
    (req.session.user.role === "admin" || req.session.user.role === "premium")
  ) {
    return next();
  } else {
    res.status(403).json({
      status: "error",
      message: "Acceso denegado: Necesita privilegios de admin o premium",
    });
  }
};

export const isUserOrPremium = (req, res, next) => {
  if (
    req.session.user &&
    (req.session.user.role === "user" || req.session.user.role === "premium")
  ) {
    return next();
  } else {
    res.status(403).json({
      status: "error",
      message: "Acceso denegado: Necesitas ser usuario o usuario Premium",
    });
  }
};

export const isUser = (req, res, next) => {
  if (req.session.user && req.session.user.role === "user") {
    return next();
  } else {
    res.status(403).json({
      status: "error",
      message: "Acceso denegado",
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  } else {
    res.status(403).json({
      status: "error",
      message: "Acceso denegado. Solo para administradores.",
    });
  }
};
