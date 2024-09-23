import UserService from "../services/usersService.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/EErrors.js";
import { generateUserErrorInfo } from "../services/errors/Info.js";
import logger from "../utils/logger.js";

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
    const users = await UserService.getBasicUserData();
    res.status(200).json({
      result: "success",
      payload: users,
    });
  } catch (error) {
    res.status(500).json({
      result: "error",
      message: "Error al obtener los usuarios",
    });
  }
};

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

export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedUserData = req.body;

    const updatedUser = await UserService.updateUser(userId, updatedUserData);

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res
      .status(200)
      .json({ message: "Perfil actualizado correctamente", user: updatedUser });
  } catch (error) {
    logger.error("Error al actualizar perfil de usuario:", error);
    res.status(500).json({ error: "Error al actualizar perfil de usuario" });
  }
};

export const deleteUser = async (req, res) => {
  const uid = req.user.role === "admin" ? req.params.uid : req.user._id;
  try {
    const result = await UserService.deleteUserAndCart(uid);
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
    logger.error("Error al eliminar usuario y carrito asociado:", error);
    res.status(500).json({
      result: "error",
      error: "Error al eliminar usuario y carrito asociado",
    });
  }
};

export const changeUserRole = async (req, res) => {
  try {
    const requestingUserId = req.user._id;
    const targetUserId = req.params.uid || requestingUserId;

    const updatedUser = await UserService.changeUserRole(
      requestingUserId,
      targetUserId
    );

    logger.info(
      `Rol del usuario ${targetUserId} cambiado a ${updatedUser.role}`
    );
    return res.status(200).json({
      status: "success",
      message: `Rol cambiado a ${updatedUser.role}`,
    });
  } catch (error) {
    logger.error("Error al cambiar el rol del usuario:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Error al cambiar el rol del usuario",
    });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const profileImagePath = req.file.path;
    const user = await UserService.uploadProfileImage(userId, profileImagePath);
    res.status(200).json({
      status: "success",
      message: "Imagen de perfil actualizada",
      profileImage: user.profileImage,
    });
  } catch (error) {
    logger.error("Error al subir imagen de perfil:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al subir la imagen de perfil" });
  }
};

export const updateUserDocuments = async (req, res) => {
  try {
    const userId = req.user._id;
    const files = req.files.map((file) => ({
      name: file.originalname,
      reference: `/uploads/documents/${file.filename}`,
    }));
    const user = await UserService.updateUserDocuments(userId, files);
    res.status(200).json({
      status: "success",
      message: "Documentos subidos exitosamente",
      documents: user.documents,
    });
  } catch (error) {
    logger.error("Error al subir documentos:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error al subir los documentos" });
  }
};

export const deleteInactiveUsers = async (req, res) => {
  try {
    const result = await UserService.deleteInactiveUsers();
    res
      .status(200)
      .json({ message: `${result} usuarios eliminados por inactividad` });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar usuarios inactivos",
      error: error.message,
    });
  }
};
