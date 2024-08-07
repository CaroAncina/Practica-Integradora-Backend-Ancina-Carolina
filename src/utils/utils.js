import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export const generateMockProducts = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    stock: faker.number.int({ min: 1, max: 100 }),
    category: faker.commerce.department(),
    image: faker.image.url(),
  };
};
