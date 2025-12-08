export const getProductsValidation = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} request to ${req.url}`);

  // IMPORTANT: Pass control to the next function in the stack
  next();
};
