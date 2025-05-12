// let 서버도메인 = `http://${process.env.REACT_APP_SMARTPHONE_IP}:4000`;
let 서버도메인 = `http://localhost:4000/teacher`;
export const apiurlList = {
  management: {
    reserveList: 서버도메인 + "/getTheReservelist",
  },
};
