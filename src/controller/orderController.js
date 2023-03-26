const orderModel = require("../model/order");
const nodemailer = require("nodemailer");

const createOrder = async function (req, res) {
  try {
    let data = req.body;
    const { bookingDate, noOfTickets, name, email, phone } = data;

    //empty Body
    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: false,
        message: "Please provide your Order Details",
      });
    }

    if (!bookingDate && !noOfTickets && !name && !phone && !email) {
      return res
        .status(400)
        .send({ status: false, error: "Something Missing" });
    }

    //checking alphabet
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

    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
      return res.status(400).send({
        status: false,
        message: "Email should be valid email address",
      });
    }

    if (!/^(?:[1-9]|10)$/.test(noOfTickets)) {
      return res.status(400).send({
        status: false,
        message: "Buy Max 10 Tickets at a Time",
      });
    }

    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    if (!dateRegex.test(bookingDate)) {
      return res.status(400).send({
        status: false,
        error: `Date should be in "YYYY-MM-DD" format`,
      });
    }

    const today = new Date();
    const todayFormat = today.toISOString().slice(0, 10).replace(/-/g, "-");

    const currentTimeStamp = Date.parse(todayFormat);
    const inputTimeStamp = Date.parse(bookingDate);

    if (inputTimeStamp < currentTimeStamp) {
      return res.status(400).send({
        status: false,
        error: "Previous Dates are not Available, Try Current or Upcoming Date",
      });
    }

    data["totalPrice"] = data.noOfTickets * 1999;
    const createOrder = await orderModel.create(data);

    // Email configuration details
    const emailConfig = {
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "kavon.ernser94@ethereal.email",
        pass: "kN16kWVsWuvAxJ4Mmg",
      },
    };

    // Create an email transport object
    const transporter = nodemailer.createTransport(emailConfig);

    // Create an email message
    const mailOptions = {
      from: '"Bishnupur Tourism" <kavon.ernser94@ethereal.email>',
      to: `${data.email}`,
      subject: "Order Details",
      text: `Dear ${data.name},\n\nThank you for placing your order. Your order details are as follows:\n\nOrder ID: ${createOrder._id}\nNo. of Tickets: ${data.noOfTickets}\nTotal Price: ${data.totalPrice}\n\nThank you for choosing our service. Please let us know if you have any questions or concerns.\n\nBest Regards,\nThe Support Team`,
    };

    // Send the email to the user
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return res.status(201).json({ createOrder });
  } catch (err) {
    {
      return res
        .status(500)
        .send({ status: false, message: "Error", error: err.message });
    }
  }
};

module.exports = { createOrder };
