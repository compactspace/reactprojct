const getChatlist = require("../chat/chat");
const express = require("express");
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

module.exports.websocketopen = () => {
  server.listen(5000, function () {
    console.log(`채팅 포트 ${5000} 서버 시작.`);
  });
};

//  enterance 네임 스페이스를 만들고
// 네임스페이스에서 컨낵션과, 각종 이벤트(그 이벤트가 아니라 이름을 맞춤해주는)를 만든다.
const enterancename = io.of("/enterance");

enterancename.on("connection", async (socket) => {
  socket.on("chatstart", async ({ value, writer, room_num }) => {
    let 채딩상대방아이디 = await getChatlist.insertChatlist(
      writer,
      value,
      room_num
    );

    let writerOther = writer;

    let contentOther = value;

    // console.log(`id:${id}      contentOther${contentOther}`);

    let createdAt = new Date().toLocaleDateString();
    socket.broadcast.emit("chatstart", {
      writerOther,
      contentOther,
      createdAt,
    });
  });

  // 최초 채팅방으로 이동이 되었다면  지난 데이터 기록을 주는 이벤트이다.
  socket.on("enterancedata", async (data) => {
    let id = data.id;
    let onedayclass_num = data.onedayclass_num;
    let 앤번째페이지 = data.cPage;
    let 이전달대화기록연월 = data.lastMonthRecord;
    let 다음달대화기록연월=data.nextMonthRecord
    console.log(`앤번째페이지: ${앤번째페이지}`);
    let obj = await getChatlist.getEnteranceChatlist(
      id,
      onedayclass_num,
      앤번째페이지,
      이전달대화기록연월,
      다음달대화기록연월
    );

    socket.emit("enterancedata", obj);
  });
});

const forteacheralter = io.of("/forteacheralter");

forteacheralter.on("connection", (socket) => {
  //   for (let key in socket) {
  //     console.log("키:  " + key);
  //     console.log(socket[key]);
  //   }
  //   console.log(socket.adapter);

  let { rooms } = socket.adapter;
  //  console.log(socket);
  //console.log(rooms);

  //   console.log(`소켓아이디: ${socket.id}`);

  // socket.on('chatsubmit',(data)=>{
  //     console.log("아하하하하:   "+data)
  //     socket.emit('alert',"ㅇㅇㅇㅇ");

  // })
  socket.on("chatapplication", (data) => {
      console.log("~~~채팅신청~~~");
      console.log(data);
      console.log("선생번호:  "+data.onedayclass_num)
    data.connection = true;
    data.socketid = socket.id;
    let stinfo = data;

    //주의해라, broadcast 를 해야핝다.
    // 내 소켓이 아닌 다른 소켓에 보내는 방법이다. 안그러면 선생님쪽 소켓으로 가지질 않는다...
    socket.broadcast.emit(`chatsubmit`, stinfo);
  });

  socket.on("confirm", (data) => {
    socket.broadcast.emit("confirm", { resstatus: data });
  });

  socket.on("disconnect", (reason) => {
    console.log(
      `기본유저 ${socket.id}님이 ${reason}의 이유로 퇴장하셨습니다. `
    );
    let newobj = new Object();
    newobj.connection = false;
    newobj.socketid = socket.id;

    socket.broadcast.emit(`chatsubmit`, newobj);
  });
});
