const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const complaintController = require("../controller/complaintController");
const orderController = require("../controller/orderController");
const auth = require("../authentication/auth")

router.post("/register", adminController.createAdmin);
router.post("/login", adminController.loginAdmin);

router.post("/createcomplaint", complaintController.createComplaint);
router.get("/:complaintID", complaintController.complaintIDCheck);
router.get("/adminpage/:bookingID", adminController.getTicketDetails);
router.put("/adminpage/cancle/:bookingID", adminController.cancleTicket);
router.put("/adminpage/checkedin/:bookingID", adminController.checkedInTicket);

router.post("/createorder", orderController.createOrder);

router.all("/***", function (req, res) {
  res.status(404).send({
    status: false,
    msg: "Invalid Request",
  });
});

module.exports = router;
