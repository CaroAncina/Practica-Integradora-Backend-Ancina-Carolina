import logger from "../utils/logger.js";

const register = (req, res) => {
  logger.info("Usuario registrado exitosamente");
  res.status(200).json({ message: "Usuario registrado exitosamente" });
};

const failRegister = (req, res) => {
  logger.warn("Registro fallido");
  res.status(400).json({ message: "Registro fallido" });
};

const login = (req, res) => {
  logger.info("Usuario conectado exitosamente");
  res.status(200).json({ message: "Usuario conectado exitosamente" });
};

const failLogin = (req, res) => {
  logger.warn("Inicio de sesión fallido");
  res.status(400).json({ message: "Inicio de sesión fallido" });
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      logger.error(`Error al desconectar usuario: ${err.message}`);
      return res.status(500).json({ message: "Error al desconectar usuario" });
    }
    logger.info("Usuario desconectado exitosamente");
    res.status(200).json({ message: "Usuario desconectado exitosamente" });
  });
};

const github = (req, res) => {
  logger.info("Registro con GitHub iniciado");
  // Registro con GitHub
};

const githubCallback = (req, res) => {
  logger.info("Autenticación de GitHub exitosa");
  res.status(200).json({ message: "Autenticación de GitHub exitosa" });
};

const current = (req, res) => {
  logger.warn("Error de autenticación");
  res.status(200).json({ message: "Error de autenticación" });
};

export default {
  register,
  failRegister,
  login,
  failLogin,
  logout,
  github,
  githubCallback,
  current,
};
