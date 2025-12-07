import { Category } from "../models/category.model.js";

export const importProducts = async (req, res) => {
  try {
    // const user = req.body;
    const newCategory = new Category({
      name: "test",
    });
    const result = await newCategory.save();
    res.status(201).send({
      success: true,
      message: "Successfully Registered!",
      data: result,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .send({ success: false, message: "Email Already Exists!" });
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
