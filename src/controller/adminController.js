const jwt = require("jsonwebtoken");
const adminModel = require("../model/admin");
const orderModel = require("../model/order");

const createAdmin = async function (req, res) {
  try {
    let data = req.body;

    //empty Body
    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: false,
        message: "Please provide your User details",
      });
    }

    //email validation
    if (!data.email || data.email.trim().length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Email field is required" });
    }

    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid Email" });
    }

    const isEmailAlreadyUsed = await adminModel.findOne({
      email: data.email,
    });
    if (isEmailAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, message: "Email is already registered" });
    }

    //password validation
    if (!data.password || data.password.trim().length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });
    }

    if (!/^.{8,15}$/.test(data.password)) {
      return res.status(400).send({
        status: false,
        message: "Password length should be in between 8 to 15",
      });
    }

    {
      res
        .status(201)
        .send({ status: true, message: "Success", data: saveData });
    }
  } catch (err) {
    res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};

//login user
const loginAdmin = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: false,
        message: "Please provide your Login details",
      });
    }

    if (!email || email.trim().length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide Email details" });
    }

    if (!password || password.trim().length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide Password details" });
    }

    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
      return res.status(400).send({
        status: false,
        message: "Email should be valid email address",
      });
    }

    if (!/^.{8,15}$/.test(password)) {
      return res.status(400).send({
        status: false,
        message: "Incorrect password",
      });
    }
    let user = await adminModel.findOne({ email: email, password: password });
    if (!user) {
      return res.status(401).send({
        status: false,
        message: "Invalid User",
      });
    }


    const scrtCode = "5^8LydB!mso^o!Yx";
    const projectdetails = "bishnupur=tourism@backend-apis";

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        project: projectdetails,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60,
      },
      scrtCode
    );

    {
      res.status(201).send(token);
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const getTicketDetails = async function (req, res) {
  try {
    let bookingID = req.params.bookingID;

    if (!/^[0-9a-fA-F]{24}$/.test(bookingID)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid bookingID" });
    }

    let bookingIDCheck = await orderModel
      .findById({ _id: bookingID })
      .select({ createdAt: 0, updatedAt: 0, __v: 0 });

    if (!bookingIDCheck) {
      return res
        .status(404)
        .send({ status: false, msg: "bookingID is not exist" });
    }
    {
      return res.status(200).json({ bookingIDCheck });
    }
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

const cancleTicket = async function (req, res) {
  try {
    let bookingID = req.params.bookingID;

    if (!/^[0-9a-fA-F]{24}$/.test(bookingID)) {
      return res.status(400).send({ status: false, message: "Incorrect ID" });
    }

    let cancleTicket = await orderModel.findByIdAndUpdate(
      { _id: bookingID },
      { $set: { isCancled: true } },
      { new: true }
    );

    if (cancleTicket.length == 0) {
      return res.status(404).send({
        status: false,
        msg: "No Blogs",
      });
    }

    return res.status(200).json({ msg: "Deleted!" });
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

const checkedInTicket = async function (req, res) {
  try {
    let bookingID = req.params.bookingID;

    if (!/^[0-9a-fA-F]{24}$/.test(bookingID)) {
      return res.status(400).send({ status: false, message: "Incorrect ID" });
    }

    let checkedInTicket = await orderModel.findByIdAndUpdate(
      { _id: bookingID },
      { $set: { checkedIn: true } },
      { new: true }
    );

    if (checkedInTicket.length == 0) {
      return res.status(404).send({
        status: false,
        msg: "No Blogs",
      });
    }

    return res.status(200).json({ msg: "CheckedIn" });
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
  getTicketDetails,
  checkedInTicket,
  cancleTicket,
};
