export const getProductsValidation = (req, res, next) => {
  req.items = {};
  const pageParam = req.query.page;
  const limitParam = req.query.limit;
  const sortField = req.query.sortField;
  const sortOrder = req.query.sortOrder;
  const name = req.query.name;
  const productCode = req.query.productCode;
  const category = req.query.category;
  const subCategory = req.query.subCategory;
  const categoryIds = req.query.categoryIds;
  const subcategoryIds = req.query.subcategoryIds;
  const status = req.query.status;
  const maxPrice = req.query.maxPrice;
  const minPrice = req.query.minPrice;
  const maxAmper = req.query.maxAmper;
  const minAmper = req.query.minAmper;
  const warrantyActive = req.query.warrantyActive;
  const warrantyStartDateFrom = req.query.warrantyStartDateFrom;
  const warrantyStartDateTo = req.query.warrantyStartDateTo;
  const warrantyEndDateFrom = req.query.warrantyEndDateFrom;
  const warrantyEndDateTo = req.query.warrantyEndDateTo;
  if (pageParam !== undefined) {
    const pageNumber = parseInt(pageParam, 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({
        error: "Invalid 'page' parameter.",
        message:
          "The 'page' query parameter must be a positive integer (e.g., page=1).",
      });
    }
    req.items.page = pageNumber;
  } else req.items.page = 1;
  if (limitParam !== undefined) {
    const limitNumber = parseInt(limitParam, 10);
    if (isNaN(limitNumber) || limitParam < 1) {
      return res.status(400).json({
        error: "Invalid 'limit' parameter.",
        message:
          "The 'limit' query parameter must be a positive integer (e.g., limit=10).",
      });
    }
    req.items.limit = limitNumber;
  } else req.items.limit = 10;
  if (sortField !== undefined && sortOrder !== undefined) {
    const sortFields = [
      "amp",
      "price",
      "created_at",
      "warrantyStartDate",
      "warrantyEndDate",
    ];
    const sortOrders = ["asc", "desc"];
    if (!sortFields.includes(sortField)) {
      return res.status(400).json({
        error: "Invalid 'sortField' parameter.",
        message:
          "The 'sortFields' query parameter must be one of these fields:['amp','price','createdAt','warrantyStartDate','warrantyEndDate'] (e.g., sortField=price).",
      });
    }
    if (!sortOrders.includes(sortOrder)) {
      return res.status(400).json({
        error: "Invalid 'sortOrder' parameter.",
        message:
          "The 'sortOrders' query parameter must be one of these fields:['asc','desc'] (e.g., sortOrder=asc).",
      });
    }
    req.items.sortCriteria = {
      [sortField]: sortOrder === "asc" ? 1 : -1,
    };
  } else
    req.items.sortCriteria = {
      price: 1,
    };
  if (name !== undefined) req.items.name = name;
  if (productCode !== undefined) req.items.productCode = productCode;
  if (category !== undefined) req.items.category = category;
  if (subCategory !== undefined) req.items.subCategory = subCategory;
  if (categoryIds !== undefined) {
    const actualCategoryIdsArray = categoryIds.split(",");
    req.items.categoryIds = actualCategoryIdsArray;
  }
  if (subcategoryIds !== undefined) {
    const actualSubCategoryIdsArray = subcategoryIds.split(",");
    req.items.subcategoryIds = actualSubCategoryIdsArray;
  }
  if (status !== undefined) {
    if (!["true", "false"].includes(status)) {
      return res.status(400).json({
        error: "Invalid 'status' parameter.",
        message: "The 'status' query parameter must be a boolean",
      });
    }
    if (status === "true") req.items.status = true;
    else req.items.status = false;
  }
  if (minPrice !== undefined) {
    const minPriceNumber = parseInt(minPrice, 10);
    if (isNaN(minPriceNumber) || minPriceNumber < 0) {
      return res.status(400).json({
        error: "Invalid 'minPrice' parameter.",
        message:
          "The 'minPrice' query parameter must be a positive number (e.g., minPrice=71694000).",
      });
    }
    req.items.minPrice = minPriceNumber;
  }
  if (maxPrice !== undefined) {
    const maxPriceNumber = parseInt(maxPrice, 10);
    if (isNaN(maxPriceNumber) || maxPriceNumber < 0) {
      return res.status(400).json({
        error: "Invalid 'maxPrice' parameter.",
        message:
          "The 'maxPrice' query parameter must be a positive number (e.g., maxPrice=71694000).",
      });
    }
    req.items.maxPrice = maxPriceNumber;
  }
  if (minAmper !== undefined) {
    const minAmperNumber = parseInt(minAmper, 10);
    if (isNaN(minAmperNumber) || minAmperNumber < 0) {
      return res.status(400).json({
        error: "Invalid 'minAmper' parameter.",
        message:
          "The 'minAmper' query parameter must be a positive number (e.g., minAmper=100).",
      });
    }
    req.items.minAmper = minAmperNumber;
  }
  if (maxAmper !== undefined) {
    const maxAmperNumber = parseInt(maxAmper, 10);
    if (isNaN(maxAmperNumber) || maxAmperNumber < 0) {
      return res.status(400).json({
        error: "Invalid 'maxAmper' parameter.",
        message:
          "The 'maxAmper' query parameter must be a positive number (e.g., maxAmper=100).",
      });
    }
    req.items.maxAmper = maxAmperNumber;
  }
  if (warrantyActive !== undefined) {
    if (!["true", "false"].includes(warrantyActive)) {
      return res.status(400).json({
        error: "Invalid 'warrantyActive' parameter.",
        message: "The 'warrantyActive' query parameter must be a boolean",
      });
    }
    if (warrantyActive === "true") req.items.warrantyActive = true;
    else req.items.warrantyActive = false;
  }
  if (
    warrantyStartDateFrom !== undefined &&
    warrantyStartDateTo !== undefined
  ) {
    const warrantyStartDateFromObject = new Date(warrantyStartDateFrom);
    const warrantyStartDateToObject = new Date(warrantyStartDateTo);
    if (
      isNaN(warrantyStartDateFromObject.getTime()) ||
      isNaN(warrantyStartDateToObject.getTime())
    ) {
      return res.status(400).json({
        error: "Invalid 'Date' parameter.",
        message:
          "The 'Date' query parameter must be a valid date format (e.g., YYYY-MM-DD or ISO format).",
      });
    }
    req.items.warrantyStartDateFrom = warrantyStartDateFromObject;
    req.items.warrantyStartDateTo = warrantyStartDateToObject;
  }
  if (warrantyEndDateFrom !== undefined && warrantyEndDateTo !== undefined) {
    const warrantyEndDateFromObject = new Date(warrantyEndDateFrom);
    const warrantyEndDateToObject = new Date(warrantyEndDateTo);
    if (
      isNaN(warrantyEndDateFromObject.getTime()) ||
      isNaN(warrantyEndDateToObject.getTime())
    ) {
      return res.status(400).json({
        error: "Invalid 'Date' parameter.",
        message:
          "The 'Date' query parameter must be a valid date format (e.g., YYYY-MM-DD or ISO format).",
      });
    }
    req.items.warrantyEndDateFrom = warrantyEndDateFromObject;
    req.items.warrantyEndDateTo = warrantyEndDateToObject;
  }
  next();
};
