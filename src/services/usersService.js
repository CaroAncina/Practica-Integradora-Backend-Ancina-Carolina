import UserMongoDAO from "../dao/classes/users.dao.js";
import CartMongoDAO from "../dao/classes/carts.dao.js";
import { createHash } from "../utils/utils.js";
import { sendNotificationEmail } from "../utils/mailer.js";
import logger from "../utils/logger.js";

class UserService {
  static async getUserById(uid) {
    return await UserMongoDAO.findById(uid);
  }

  static async createUser(userData) {
    try {
      const existingUser = await UserMongoDAO.findByEmail(userData.email);
      if (existingUser) {
        logger.warn(
          `Intento de crear usuario con email ya en uso: ${userData.email}`
        );
        throw new Error("El correo electrónico ya está en uso");
      }
      userData.password = createHash(userData.password);

      if (userData.email === "acoderhouse@gmail.com") {
        userData.role = "premium";
      } else {
        userData.role = "user";
        const newCart = await CartMongoDAO.create({ products: [] });
        userData.cart = newCart._id;
      }

      const result = await UserMongoDAO.create(userData);
      logger.info(`Usuario creado con éxito: ${result.email}`);
      return result;
    } catch (error) {
      logger.error(`Error al crear usuario: ${error.message}`, {
        stack: error.stack,
      });
      throw new Error("Error al crear usuario");
    }
  }

  static async getUserByEmail(email) {
    try {
      const user = await UserMongoDAO.findByEmail(email);
      if (!user) {
        logger.info(`Usuario con email ${email} no encontrado`);
      } else {
        logger.info(`Usuario con email ${email} obtenido con éxito`);
      }
      return user;
    } catch (error) {
      logger.error(`Error al obtener usuario por email: ${error.message}`, {
        stack: error.stack,
      });
      throw new Error("Error al obtener usuario por email");
    }
  }

  static async getBasicUserData() {
    try {
      const users = await UserMongoDAO.findAll();
      return users;
    } catch (error) {
      throw new Error("Error al obtener los usuarios");
    }
  }

  static async updateUser(uid, updatedUser) {
    try {
      if (updatedUser.password) {
        updatedUser.password = createHash(updatedUser.password);
      }
      const updated = await UserMongoDAO.update(uid, updatedUser);
      if (!updated) {
        logger.info(
          `Usuario con id ${uid.email} no encontrado para actualizar`
        );
        throw new Error("Usuario no encontrado para actualizar");
      }
      logger.info(`Usuario con id ${uid.email} actualizado con éxito`);
      return updated;
    } catch (error) {
      logger.error(`Error al actualizar usuario: ${error.message}`, {
        stack: error.stack,
      });
      throw new Error("Error al actualizar usuario");
    }
  }

  static async deleteUserAndCart(uid) {
    try {
      const user = await UserMongoDAO.findById(uid);
      if (!user) {
        logger.info(`Usuario con id ${uid} no encontrado para eliminar`);
        return { deletedUser: null, deletedCart: null };
      }

      let deletedCart = null;
      if (user.cart) {
        deletedCart = await CartMongoDAO.delete(user.cart);
        if (!deletedCart) {
          logger.info(
            `Carrito del usuario con id ${user.email} no encontrado para eliminar`
          );
        } else {
          logger.info(
            `Carrito del usuario con id ${user.email} eliminado con éxito`
          );
        }
      }

      const deletedUser = await UserMongoDAO.delete(uid);
      logger.info(`Usuario con id ${user.email} eliminado con éxito`);

      return { deletedUser, deletedCart };
    } catch (error) {
      logger.error(`Error al eliminar usuario y carrito: ${error.message}`, {
        stack: error.stack,
      });
      throw new Error("Error al eliminar usuario y carrito");
    }
  }

  static async updateUserDocuments(uid, documents) {
    const user = await UserMongoDAO.findById(uid);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    user.documents = [...user.documents, ...documents];
    await user.save();
    logger.info(`Documentación actualizada para el usuario ${user.email}`);
    return user;
  }

  static async changeUserRole(requestingUserId, targetUserId) {
    try {
      const requestingUser = await UserMongoDAO.findById(requestingUserId);
      const targetUser = await UserMongoDAO.findById(targetUserId);

      if (!requestingUser) {
        throw new Error("Usuario solicitante no encontrado");
      }

      if (!targetUser) {
        throw new Error("Usuario objetivo no encontrado");
      }

      if (requestingUser.role === "admin") {
        targetUser.role = targetUser.role === "premium" ? "user" : "premium";
      } else {
        if (targetUser.role === "premium") {
          targetUser.role = "user";
        } else if (targetUser.role === "user") {
          const requiredDocuments = [
            "identificacion",
            "comprobante de domicilio",
            "comprobante de estado de cuenta",
          ];

          const hasAllDocuments = requiredDocuments.every((docName) =>
            targetUser.documents.some((doc) =>
              doc.name.toLowerCase().includes(docName.toLowerCase())
            )
          );

          if (!hasAllDocuments) {
            throw new Error(
              "Faltan los siguientes documentos: identificación, comprobante de domicilio, comprobante de estado de cuenta"
            );
          }

          targetUser.role = "premium";
        }
      }

      const updatedUser = await targetUser.save();
      return updatedUser;
    } catch (error) {
      logger.error("Error al cambiar rol del usuario:", error);
      throw new Error("Error al cambiar rol del usuario");
    }
  }

  static async uploadProfileImage(uid, imagePath) {
    try {
      const user = await UserMongoDAO.findById(uid);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const profile_image = await UserMongoDAO.update(
        uid,
        { profileImage: imagePath },
        { new: true }
      );
      logger.info(`Imagen de perfil actualizada para el usuario ${user.email}`);
      return profile_image;
    } catch (error) {
      logger.error(`Error al subir imagen de perfil: ${error.message}`);
      throw new Error("Error al subir imagen de perfil");
    }
  }

  static async deleteInactiveUsers() {
    const cutoffDate = new Date(Date.now() - 30 * 60 * 1000); // 30 min. prueba

    try {
      const inactiveUsers = await UserMongoDAO.findInactiveSince(cutoffDate);

      for (const user of inactiveUsers) {
        if (user.cart) {
          await CartMongoDAO.delete(user.cart._id);
          logger.info(
            `Carrito del usuario con id ${user._id} eliminado con éxito`
          );
        }

        await sendNotificationEmail(
          user.email,
          "Cuenta eliminada por inactividad"
        );
        logger.info(
          `Correo enviado a ${user.email} notificando la eliminación de su cuenta por inactividad`
        );

        await UserMongoDAO.delete(user._id);
        logger.info(
          `Usuario con id ${user._id} eliminado con éxito y su carrito eliminado con éxito`
        );
      }
      return {
        message: `Se han eliminado ${inactiveUsers.length} usuarios inactivos y sus carritos asociados.`,
      };
    } catch (error) {
      logger.error("Error al eliminar usuarios inactivos:", error);
      throw new Error("Error al eliminar usuarios inactivos");
    }
  }
}

export default UserService;
