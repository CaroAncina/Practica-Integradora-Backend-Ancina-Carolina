import UserService from "../services/usersService.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/EErrors.js";
import { generateUserErrorInfo } from "../services/errors/Info.js";
import logger from "../utils/logger.js";

export const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      CustomError.createError({
        name: "UserNotFoundError",
        cause: `Usuario con email ${email} no encontrado`,
        message: "Usuario no encontrado",
        code: EErrors.ROUTING_ERROR,
      });
    }
    res.status(200).json({ result: "success", user });
  } catch (error) {
    logger.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createUser = async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;
  if (!first_name || !last_name || !email || !password || !age) {
    CustomError.createError({
      name: "UserCreationError",
      cause: generateUserErrorInfo({ first_name, last_name, email }),
      message: "Error tratando de crear el usuario",
      code: EErrors.INVALID_TYPES_ERROR,
    });
  }
  try {
    const newUser = await UserService.createUser({
      first_name,
      last_name,
      email,
      password,
      age,
    });
    res.status(201).json({ result: "success", payload: newUser });
  } catch (error) {
    logger.error("Error al crear usuario:", error);
    res.status(500).json({ result: "error", error: "Error al crear usuario" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json({ result: "success", users });
  } catch (error) {
    logger.error("Error al obtener todos los usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateUser = async (req, res) => {
  const { uid } = req.params;
  const updatedUser = req.body;
  try {
    const result = await UserService.updateUser(uid, updatedUser);
    if (!result) {
      CustomError.createError({
        name: "UserNotFoundError",
        cause: `Usuario con ID ${uid} no encontrado`,
        message: "Usuario no encontrado",
        code: EErrors.ROUTING_ERROR,
      });
    }
    res.status(200).json({ result: "success", payload: result });
  } catch (error) {
    logger.error("Error al actualizar usuario:", error);
    res
      .status(500)
      .json({ result: "error", error: "Error al actualizar usuario" });
  }
};

export const deleteUser = async (req, res) => {
  const { uid } = req.params;
  try {
    const result = await UserService.deleteUser(uid);
    if (!result) {
      CustomError.createError({
        name: "UserNotFoundError",
        cause: `Usuario con ID ${uid} no encontrado`,
        message: "Usuario no encontrado",
        code: EErrors.ROUTING_ERROR,
      });
    }
    res.status(200).json({ result: "success", payload: result });
  } catch (error) {
    logger.error("Error al eliminar usuario:", error);
    res
      .status(500)
      .json({ result: "error", error: "Error al eliminar usuario" });
  }
};
