const complaintModel = require("../model/complaint");

const createComplaint = async function (req, res) {
  try {
    let data = req.body;
    const { name, phone, msg } = data;

    //empty Body
    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: false,
        message: "Please provide your Order Details",
      });
    }

    if (!name && !phone && !msg) {
      return res
        .status(400)
        .send({ status: false, error: "Something Missing" });
    }
    if (!/^\s*([a-zA-Z])([^0-9]){2,64}\s*$/.test(name)) {
      return res
        .status(400)
        .send({ status: false, msg: "name should be in alphabat type" });
    }
    //checking num
    if (!/^[0-9]*$/.test(phone)) {
      return res
        .status(400)
        .send({ status: false, msg: "phoneNo should be in Num type" });
    }

    if (
      !/^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/.test(
        phone
      )
    ) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid Mobile Number" });
    }

    let saveData = await complaintModel.create(data);

    {
      return res.status(201).send(saveData._id);
    }
  } catch (err) {
    {
      return res
        .status(500)
        .send({ status: false, message: "Error", error: err.message });
    }
  }
};

const complaintIDCheck = async function (req, res) {
  try {
    let complaintID = req.params.complainID;

    if (!/^[0-9a-fA-F]{24}$/.test(complaintID)) {
      return res.status(400).send({ status: false, message: "Incorrect ID" });
    }

    const complaintIDCheck = await complaintModel.findById({
      _id: complaintID,
    });

    if (!complaintIDCheck) {
      return res.status(404).send({ status: false, message: "Not Found" });
    }

    {
      return res.status(201).send({ complaintIDCheck });
    }
  } catch (err) {
    {
      return res
        .status(500)
        .send({ status: false, message: "Error", error: err.message });
    }
  }
};

module.exports = { createComplaint, complaintIDCheck };
