const marialpool = require("../model/maria/mariadbpool");
const requestIp = require("request-ip");

//사실 좀 더러운 부분이 있으나 헷갈릴 수 있으니 적는다.
//먼저 로그인시에는, httpOnly속성으로 쿠키만 웹브라우져에 저장시키고
//리액트 단에서는 유저의 id를 저장한다. 이거는 쿠키 접근 가능함

//아무튼 이제 각종 리액트단의 유저의 id가 필요한 페이지에서
//
module.exports = {
  Existcookie: async (req, res) => {
    let sessionID = req.sessionID;
    let cookie_sessionID = req.cookies.sessionID;
    let ReqIP = requestIp.getClientIp(req);
    let 리액트에주는제이슨 = new Object();

    // console.log("req.cookie:   ", req.cookie)
    // console.log("req.cookies:   ", req.cookies)
    // console.log("req.session:   ", req.session)
    // console.log("req.sessionID:   ", sessionID)
    // console.log("cookie_sessionID:", cookie_sessionID)

    // console.log("포함여부: ",cookie_sessionID.indexOf(sessionID))

    if (sessionID == undefined || sessionID == null) {
      리액트에주는제이슨.cookiestatuscode = -1;
      res.clearCookie("userid");
    //  console.log("세션아이디가 없는경우 뜸");
      await res.json(리액트에주는제이슨);
      return;
    }

    let con;
    let sql = "select data from sessions where session_id=?";
    try {
      con = await marialpool.pool2.getConnection();
      let excutequery = await con.query(sql, [sessionID]);

      // console.log(excutequery[0].length == 0)

      if (excutequery[0].length == 0) {
        리액트에주는제이슨.cookiestatuscode = 0;
        console.log("불일치하면뜸");
      } else {
        let cookie = JSON.parse(excutequery[0][0].data);
        // console.log(cookie.requestIp)

        let 세션에저장된실제IP = cookie.requestIp;

        // console.log("세션에저장된실제IP:  " + 세션에저장된실제IP)
        // console.log("요청자의IP:  " + ReqIP)
        // console.log("같니?:  " + (ReqIP == 세션에저장된실제IP))

        if (세션에저장된실제IP != ReqIP) {
          리액트에주는제이슨.cookiestatuscode = -2;
        } else {
          리액트에주는제이슨.cookiestatuscode = 1;
        }
      }
    } catch (err) {
    } finally {
      if (리액트에주는제이슨.cookiestatuscode != 1) {
        // console.log(
        //   "리액트에주는제이슨.cookiestatuscod: ",
        //   리액트에주는제이슨.cookiestatuscod
        // );
        res.clearCookie("userid");
      }
      con.release();

      await res.json(리액트에주는제이슨);
    }
  },
};
