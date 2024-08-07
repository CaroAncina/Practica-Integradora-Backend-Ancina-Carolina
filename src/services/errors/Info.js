export const generateUserErrorInfo = (user) => {
    return `Una o más propiedades están incompletas o no son válidas.
Lista de propiedades:
* first_name: necesita ser un string, se recibió ${user.first_name}
* last_name: necesita ser un string, se recibió ${user.last_name}
* email: necesita ser un string, se recibió ${user.email}`;
};

export const generateProductErrorInfo = (product) => {
    return `Una o más propiedades están incompletas o no son válidas.
Lista de propiedades:
* title: necesita ser un string, se recibió ${product.title}
* description: necesita ser un string, se recibió ${product.description}
* price: necesita ser un número, se recibió ${product.price}`;
};

export const generateCartErrorInfo = (cart) => {
    return `Una o más propiedades están incompletas o no son válidas.
Lista de propiedades:
* user_id: necesita ser un ObjectId, se recibió ${cart.user_id}
* products: necesita ser un array, se recibió ${cart.products}`;
};
