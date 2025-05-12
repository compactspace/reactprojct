const ExpressSession = require("express-session");

// 세션 유효성을위한 아이피
let IP = process.env.REACT_APP_SMARTPHONE_IP;

//데이터베이스를 finall 에서 react 데이터베이스로 변경함
// const express = require('express');
const mariasession = require("express-mysql-session")(ExpressSession);
const option = {
  host: "localhost",
  port: "3306",
  user: "root",
  password: "1111",
  database: "react",
};
// DB에 저장 하려면 위에있는 옵션을 집어 넣는다.
const mariasessionstore = new mariasession(option);
exports.mariasession = ExpressSession({
  key: "sessionID",
  secret: "secret",
  store: mariasessionstore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7000000,
    secure: false,
  },
});

//구조를 보려고 let 하고 객체를 또 익스폴츠 한거다.
// let MemoryStore = require("memorystore")(ExpressSession);
// let memoryobj = new MemoryStore({ checkPeriod: 86400000, });
// exports.MemoryStore = memoryobj;
// //그냥 클라이언트에 저장 시키는 경우??
// exports.mariasession = ExpressSession({
//     key: "free",
//     secret: "secret",
//     store: memoryobj,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 5000
//     }
// });
