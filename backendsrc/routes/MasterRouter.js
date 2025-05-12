const MasterController = require("../MasterController/MasterController");
const express = require("express");
const router = express.Router();


//선생들이 사업자인증을한 리스트를 가져오기만 한다.

router.post("/businessApplicationList",(req,res)=>{
  MasterController.getBusinessList(req, res);
})


//선생님들이 사업자 인증을 신청한 것의 거절/승인 여부를 업데이트한다.
router.post("/updateBusinessStatus",(req,res)=>{
  MasterController.updateBusinessStatus(req, res);
})





//현재 결제가 이루어진후, 배너등록 승인을 기다리는 리스트를 가져온다.
router.post("/managerpromotion", (req, res) => {
  MasterController.getPromotionList(req, res);
});

module.exports = router;
