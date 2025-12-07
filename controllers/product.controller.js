import XLSX from "xlsx";
import fs from "fs";
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

    const products = await Promise.all(
      records.map(async (record) => {
        let category = Category.find({
          name: record.category,
        });
        if (!category) {
          category = new Category({
            _id: new mongoose.Types.ObjectId(),
            name: record.category,
          });
          const categoryResult = await category.save();
        }
        let subCategory = SubCategory.find({ name: record.subCategory });
        if (!subCategory) {
          subCategory = new SubCategory({
            _id: new mongoose.Types.ObjectId(),
            name: record.subCategory,
          });
          const subCategoryResult = await subCategory.save();
        }

        console.log(categoryResult._id);

        const product = new Product({
          status: record.status,
          name: record.name,
          description: record.description,
          price: record.price,
          warrantyStartDate: record.warrantyStartDate,
          warrantyEndDate: record.warrantyEndDate,
          amp: record.amp,
          productCode: record.productCode,
          category: category._id,
          subCategory: subCategory._id,
        });
        return product;
      })
    );

    // console.log(products);

    await Product.insertMany(products);

    res.status(200).json({
      message: `Import successful! Inserted ${records.length} records.`,
      preview: records.slice(0, 5), // Send back a small preview
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .send({ success: false, message: "Failed to upload the excel file!" });
    }
    res.status(500).send({ success: false, message: error.message });
  }
};

export const getProducts = async (req, res) => {
  //   try {
  //     const user = req.body;
  //     const hashedPassword = await bcrypt.hash(user.password, 13);
  //     const newUser = new User({
  //       ...user,
  //       password: hashedPassword,
  //     });
  //     const result = await newUser.save();
  //     res.status(201).send({
  //       success: true,
  //       message: "Successfully Registered!",
  //       data: result,
  //     });
  //   } catch (error) {
  //     if (error.code === 11000) {
  //       return res
  //         .status(400)
  //         .send({ success: false, message: "Email Already Exists!" });
  //     }
  //     res.status(500).send({ success: false, message: error.message });
  //   }
};
