export const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
};

export const isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    res.redirect("/profile");
  }
};

export const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  } else {
    res.status(403).send("Acceso denegado");
  }
};

export const isUser = (req, res, next) => {
  if (req.session.user && req.session.user.role === "user") {
    return next();
  } else {
    res.status(403).send("Acceso denegado");
  }
};

export const isSelfOrAdmin = (req, res, next) => {
  if (
    req.session.user &&
    (req.session.user.role === "admin" ||
      req.session.user._id === req.params.uid)
  ) {
    return next();
  } else {
    res.status(403).send("Acceso denegado");
  }
};
