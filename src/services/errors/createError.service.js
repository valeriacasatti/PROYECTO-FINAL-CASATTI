//AUTH
export const authError = () => {
  return `full name, email & password fields are required, you cannot repeat an email in use`;
};
export const loginError = () => {
  return `email & password are required`;
};

//PRODUCTS
///add product
export const addProductError = () => {
  return `all fields are mandatory, and require a unique code`;
};
///get product by ID
export const getProductError = (id) => {
  return `ID ${id} not found`;
};
///update product
export const updateProductError = (id, updatedContent) => {
  if (!id) {
    return `ID not found`;
  }
  if (updatedContent) {
    return `the fields to update must be: title, description, price, code, stock, status, category and/or thumbnail`;
  }
};
///delete product
export const deleteProductError = (id) => {
  if (!id) {
    return `ID not found`;
  }
};
