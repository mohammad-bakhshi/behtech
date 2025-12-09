import XLSX from "xlsx";
import fs from "fs";
import mongoose from "mongoose";
import { parser } from "../utils/parser.js";
import { convertJalaliToISO, addMonthToDate } from "../utils/jalali-to-iso.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { SubCategory } from "../models/subcategory.model.js";
import { logger } from "../config/winston.js";

export const importProducts = async (req, res) => {
  try {
    logger.info("Importing products from Excel file proccess started.");
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headers = data[0];
    const rows = data.slice(1);

    const records = [];
    for (const row of rows) {
      let record = {};
      if (row.length > 0) {
        headers.forEach((header, index) => {
          if (header) {
            const parsedRecord = parser(header.trim(), row[index]);
            if (parsedRecord) {
              record = { ...parsedRecord, ...record };
            }
          }
        });

        record["warrantyStartDate"] = convertJalaliToISO(
          record["warrantyStartDate"]
        );

        record["warrantyEndDate"] = convertJalaliToISO(
          record["warrantyEndDate"]
        );

        record["warrantyEndDate"] = addMonthToDate(
          record["warrantyStartDate"],
          record["warrantyDuration"]
        );

        records.push(record);
      }
    }

    logger.info(`Successfully parsed ${records.length} records.`);

    fs.unlinkSync(filePath);

    for (const record of records) {
      let category = await Category.findOne({
        name: record.category,
      });
      if (!category && record.category) {
        category = {
          _id: new mongoose.Types.ObjectId(),
          name: record.category,
        };
        await Category.create(category);
      }
      let subCategory = await SubCategory.findOne({
        name: record.subCategory,
      });
      if (!subCategory && record.subCategory) {
        subCategory = new SubCategory({
          _id: new mongoose.Types.ObjectId(),
          name: record.subCategory,
        });
        await SubCategory.create(subCategory);
      }
      const productExists = await Product.findOne({
        productCode: record.productCode,
      });
      if (!productExists) {
        const product = {
          status: record.status,
          name: record.name,
          description: record.description,
          price: record.price,
          warrantyStartDate: record.warrantyStartDate,
          warrantyEndDate: record.warrantyEndDate,
          amp: record.amp,
          productCode: record.productCode,
          category: category ? category._id : null,
          subCategory: subCategory ? subCategory._id : null,
        };
        await Product.create(product);
      }
    }
    logger.info("Importing products from Excel file proccess ended.");
    res.status(200).json({
      message: `Import successful! Inserted ${records.length} records.`,
      preview: records.slice(0, 5), // Send back a small preview
    });
  } catch (error) {
    logger.error(error);
    if (error.code === 11000) {
      return res
        .status(400)
        .send({ success: false, message: "Failed to upload the excel file!" });
    }
    res.status(500).send({ success: false, message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const now = new Date();
    const query = { $or: [], $and: [] };
    //search
    req.items.name &&
      query["$or"].push({ name: { $regex: req.items.name, $options: "i" } });
    req.items.productCode &&
      query["$or"].push({
        productCode: { $regex: req.items.productCode },
      });
    if (req.items.category) {
      const category = await Category.findOne({
        name: { $regex: req.items.category, $options: "i" },
      });
      if (category) {
        query["$or"].push({
          category: category._id,
        });
      }
    }
    if (req.items.subCategory) {
      const subCategory = await SubCategory.findOne({
        name: { $regex: req.items.subCategory, $options: "i" },
      });
      if (subCategory) {
        query["$or"].push({
          subCategory: subCategory._id,
        });
      }
    }

    //filters
    if (req.items.categoryIds) {
      req.items.categoryIds.length > 0 &&
        query["$and"].push({
          category: { $in: req.items.categoryIds },
        });
    }
    if (req.items.subcategoryIds) {
      req.items.subcategoryIds.length > 0 &&
        query["$and"].push({
          subCategory: { $in: req.items.subcategoryIds },
        });
    }

    req.items.status !== undefined &&
      query["$and"].push({
        status: req.items.status,
      });
    req.items.maxPrice &&
      query["$and"].push({
        price: { $lte: req.items.maxPrice },
      });
    req.items.minPrice &&
      query["$and"].push({
        price: { $gte: req.items.minPrice },
      });
    req.items.maxAmper &&
      query["$and"].push({
        amp: { $lte: req.items.maxAmper },
      });
    req.items.minAmper &&
      query["$and"].push({
        amp: { $gte: req.items.minAmper },
      });
    if (req.items.warrantyActive !== undefined) {
      if (req.items.warrantyActive === true) {
        query["$and"].push({
          warrantyStartDate: { $lte: now },
          warrantyEndDate: { $gte: now },
        });
      }
    }

    req.items.warrantyStartDateFrom &&
      req.items.warrantyStartDateTo &&
      query["$and"].push({
        warrantyStartDate: {
          $lte: new Date(req.items.warrantyStartDateTo),
          $gte: new Date(req.items.warrantyStartDateFrom),
        },
      });

    req.items.warrantyEndDateFrom &&
      req.items.warrantyEndDateTo &&
      query["$and"].push({
        warrantyEndDate: {
          $lte: req.items.warrantyEndDateTo,
          $gte: req.items.warrantyEndDateFrom,
        },
      });

    const products = await Product.find(query, {
      updated_at: 0,
      __v: 0,
    })
      .populate([
        { path: "category", select: "-__v -created_at -updated_at" },
        { path: "subCategory", select: "-__v -created_at -updated_at" },
      ])
      .sort(req.items.sortCriteria)
      .skip((req.items.page - 1) * req.items.limit)
      .limit(req.items.limit)
      .lean();
    const count = await Product.countDocuments({});
    res.status(200).json({ products, count });
  } catch (error) {
    logger.error(error);
    if (error.code === 11000) {
      return res
        .status(400)
        .send({ success: false, message: "Failed to upload the excel file!" });
    }
    res.status(500).send({ success: false, message: error.message });
  }
};
