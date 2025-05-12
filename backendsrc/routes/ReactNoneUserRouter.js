const express = require("express");
const router = express.Router();
const ReactNoneUserController = require("../reactcontroller/ReactNoneUserController");

//무적권! use -> 라우터 ->컨트롤러 -> 서비스 순으로 으로 처리하고
// 리턴은 되돌아와서 라우터에서 응답객체로 응답

router.post("/OneDayClasspage", ReactNoneUserController.Onedayclassinfo);

router.post(
  "/justregisterOneDayClasspage",
  ReactNoneUserController.justregisterOnedayclassinfo
);

router.post("/rest", ReactNoneUserController.OnedayclassRest);

router.get("/ismagam", ReactNoneUserController.IsMagam);

router.get("/checkoutrest", ReactNoneUserController.FindOutRest);

module.exports = router;
