import XLSX from "xlsx";
import fs from "fs";
import mongoose from "mongoose";
import { parser } from "../utils/parser.js";
import { convertJalaliToISO, addMonthToDate } from "../utils/jalali-to-iso.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { SubCategory } from "../models/subcategory.model.js";

export const importProducts = async (req, res) => {
  try {
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
        record["warrantyEndDate"] = addMonthToDate(
          record["warrantyStartDate"],
          record["warrantyDuration"]
        );
        records.push(record);
      }
    }

    console.log(`Successfully parsed ${records.length} records.`);

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
        try {
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
        } catch (error) {
          console.log(error);
        }
      }
    }

    res.status(200).json({
      message: `Import successful! Inserted ${records.length} records.`,
      preview: records.slice(0, 5), // Send back a small preview
    });
  } catch (error) {
    console.log(error);

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
    const {
      name,
      productCode,
      categoryName,
      subCategoryName,
      categoryIds,
      subcategoryIds,
      status,
      minPrice,
      maxPrice,
      minAmper,
      maxAmper,
      warrantyActive,
      warrantyStartDateFrom,
      warrantyStartDateTo,
      warrantyEndDateFrom,
      warrantyEndDateTo,
      sortField,
      sortOrder,
      page,
      limit,
    } = req.query;
    // const sortCriteria = {
    //   [sortField]: sortOrder === "asc" ? 1 : -1,
    // };
    // const now = new Date();
    // const products = await Product.find(
    //   {
    //     $or: [
    //       { name: { $regex: name, $options: "i" } },
    //       { productCode: { $regex: productCode, $options: "i" } },
    //       { category: { name: { $regex: categoryName, $options: "i" } } },
    //       { subCategory: { name: { $regex: subCategoryName, $options: "i" } } },
    //     ],
    //     $and: [
    //       {
    //         category: { _id: { $in: [categoryIds] } },
    //         subCategory: { _id: { $in: [subcategoryIds] } },
    //         status,
    //         price: { $lte: maxPrice },
    //         price: { $gte: minPrice },
    //         amp: { $lte: maxAmper },
    //         amp: { $gte: minAmper },
    //         warrantyStartDate: { $lte: now },
    //         warrantyEndDate: { $gte: now },
    //         warrantyStartDate: { $lte: warrantyStartDateFrom },
    //         warrantyStartDate: { $gte: warrantyStartDateTo },
    //         warrantyEndDate: { $lte: warrantyEndDateFrom },
    //         warrantyEndDate: { $gte: warrantyEndDateTo },
    //       },
    //     ],
    //   },
    //   { created_at: 0, updated_at: 0, __v: 0 }
    // )
    //   .populate([
    //     { path: "category", select: "-__v -created_at -updated_at" },
    //     { path: "subCategory", select: "-__v -created_at -updated_at" },
    //   ])
    //   .sort(sortCriteria)
    //   .skip((page - 1) * limit)
    //   .limit(limit)
    //   .lean();
    const count = await Product.countDocuments({});
    res.status(200).json({ products, count });
  } catch (error) {}
};
