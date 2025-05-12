const marialpool = require("../model/maria/mariadbpool");

module.exports.getEnteranceChatlist = async (
  id,
  onedayclass_num,
  엔번째페이지,
  이전달대화기록연월,
  다음달대화기록연월
) => {
  let con;

  try {
    con = await marialpool.pool2.getConnection();
    await con.beginTransaction();
    // chatroom 테이블에서 우선 학생과 chatroom 개설된지를 먼저 확인한다.
    let existChatroom =
      "SELECT * FROM chatroom WHERE onedayclass_num=? AND id=? for update";
    let excutequery = await con.query(existChatroom, [onedayclass_num, id]);
    let status = excutequery[0].length;
    // console.log("status:  " + status);

    // status 가 0 이라면 채팅방자체가 개설이 않된경우 이다.
    let room_num;
    if (status == 0) {
      // 따라서 원데이 클래스 번호로 선생님 아이디를 추출한다.
      let teachersql = "select tid from teacher where onedayclass_num=? ";
      let teacherexcutequery = await con.query(teachersql, [onedayclass_num]);
      let tid = teacherexcutequery[0][0].tid;

      //이제 chatroom 테이블에서 채팅방을 개설한다.
      teachersql =
        "insert into  chatroom (onedayclass_num,id,tid) values(?,?,?)";
      await con.query(teachersql, [onedayclass_num, id, tid]);
      let excutequery = await con.query(existChatroom, [onedayclass_num, id]);
      room_num = excutequery[0][0].room_num;
    } else {
      room_num = excutequery[0][0].room_num;
    }

    console.log(
      `룸번호: ${room_num}  엔번째페이지: ${엔번째페이지}   이전달대화기록연월: ${이전달대화기록연월}  다음달대화기록연월:  ${다음달대화기록연월} `
    );

    // 그리고 채팅내역 테이블에서 기록을 가져온다.

    let sql;
    let excute;
    if (엔번째페이지 != undefined) {
      let jump = false;

      if (
        이전달대화기록연월 === undefined &&
        다음달대화기록연월 === undefined
      ) {
        sql =
          "SELECT * FROM dialogue WHERE room_num = ? ORDER BY dialogue_createdAt desc limit ?,10;";
        // console.log(`room_num:   ${room_num}`);
        excute = await con.query(sql, [room_num, 엔번째페이지]);
        console.log("----최초진입--");
        console.log(excute[0]);
        console.log("----최초진입--");

        jump = true;
      }

      if (!jump) {
        if (이전달대화기록연월 != undefined) {
          sql = `SELECT * FROM dialogue WHERE  room_num=? and  DATE_FORMAT(dialogue_createdAt, '%Y-%m') = '${이전달대화기록연월}' ORDER BY dialogue_createdAt ASC limit ?,10;`;
          excute = await con.query(sql, [room_num, 엔번째페이지]);
          console.log("----이전달버튼클릭--");
          console.log(excute[0]);
          console.log("----이전달버튼클릭--");
          jump = true;
        }
      }

      if (!jump) {
        if (다음달대화기록연월 != undefined) {
          sql = `SELECT * FROM dialogue WHERE  room_num=? and  DATE_FORMAT(dialogue_createdAt, '%Y-%m') = '${다음달대화기록연월}' ORDER BY dialogue_createdAt ASC limit ?,10;`;
          excute = await con.query(sql, [room_num, 엔번째페이지]);
          console.log("----다음달 버튼 클릭--");
          console.log(excute[0]);
          console.log("----다음달 버튼 클릭--");
        } else {
          sql =
            "SELECT * FROM dialogue WHERE room_num = ? ORDER BY dialogue_createdAt ASC limit ?,10;";
          excute = await con.query(sql, [room_num, 엔번째페이지]);
        }
      }
    } else {
      sql =
        "SELECT * FROM dialogue WHERE room_num = ? ORDER BY dialogue_createdAt ASC limit 0,10;";
      // console.log(`room_num:   ${room_num}`);
      excute = await con.query(sql, [room_num]);
    }
    let 기준년월;
    let lastMonthRecord = undefined;
    let nextMonthRecord = undefined;

    //다음달 구하기
    if (이전달대화기록연월 != undefined) {
      let 바로다음달 = new Date(이전달대화기록연월); // '2025-03-01'
      바로다음달.setMonth(바로다음달.getMonth() + 1); // 1개월 추가

      // console.log("바로다음달:  " + 바로다음달.toISOString().slice(0,7)); // '2025-04-01'

      nextMonthRecord = 바로다음달.toISOString().slice(0, 7);
      lastMonthRecord = await 이전달대화기록년월리턴함수(바로다음달, con);
      console.log(`다음달 계산 ${바로다음달}`);
    }

    if (excute[0][0]?.dialogue_createdAt) {
      기준년월 = excute[0][0].dialogue_createdAt;

      lastMonthRecord = await 이전달대화기록년월리턴함수(기준년월, con);
    }

    sql = "SELECT * FROM dialogue WHERE room_num = ?";
    let totalCnt = await con.query(sql, [room_num]);

    let obj = {
      excute: excute[0],
      room_num: room_num,
      totalCnt: totalCnt[0].length,
      lastMonthRecord: lastMonthRecord,
      nextMonthRecord: nextMonthRecord,
    };

    // console.log(obj);

    console.log("----------------------------------" + "\n" + "\n");
    return obj;
  } catch (err) {
    console.log(err);
    con.rollback();
  } finally {
    con.commit();
    con.release();
  }
};

const 이전달대화기록년월리턴함수 = async (기준년월, con) => {
  console.log(`기준년월: ${기준년월}`);

  // 1. 기준년월에서 년-월만 추출하기
  let 기준년월_형식 = 기준년월.toISOString().slice(0, 7); // '2025-03' 형식으로 변환
  //console.log(`기준년월 (YYYY-MM): ${기준년월_형식}`);

  // 기준년월_형식에서 월 부분 추출 (0-based 인덱스)
  let 기준월 = parseInt(기준년월_형식.slice(5, 7)); // 1부터 시작하는 월을 가져옵니다
  let 기준년 = parseInt(기준년월_형식.slice(0, 4)); // 기준 년도를 추출합니다

  // 2. 기준월부터 시작하여 역순으로 이전 달을 찾기
  for (let i = 기준월; i >= 1; i--) {
    // 3. 해당 년-월에서 이전 달 계산하기
    let 기준년월_객체 = new Date(기준년, i - 1, 1); // '2025-03-01'로 Date 객체 생성
    let 이전달 = 기준년월_객체.toISOString().slice(0, 7); // 'YYYY-MM' 형식으로 변환
    // console.log(`이전 달: ${이전달}`);

    // 여기서 필요한 조건을 추가하여 이전 달이 있을 경우 추가 작업을 할 수 있습니다.
    // 예를 들어, 해당 월에 데이터가 없으면 다음 달로 넘어갈 수 있도록 할 수 있습니다.
    //   //이전달게 있는지만 계산
    let dialogue_createdAt = 이전달;
    // 2. SQL 쿼리 동적 생성
    let sql = `SELECT * FROM dialogue WHERE DATE_FORMAT(dialogue_createdAt, '%Y-%m') = '${dialogue_createdAt}'`;

    let excute = await con.query(sql, [dialogue_createdAt]);

    if (excute[0].length >= 1) {
      return dialogue_createdAt;
    }
  }
  return undefined;
};

module.exports.insertChatlist = async (writer, value, room_num) => {
  let con;
  try {
    con = await marialpool.pool2.getConnection();
    await con.beginTransaction();
    let startslq = "select * from dialogue for update ";
    let chatList = await con.query(startslq);
    console.log(`room_num: ${room_num}  작성자: ${writer}`);

    let otherWriterSql = `SELECT writer FROM dialogue AS d INNER JOIN chatroom AS c  ON d.room_num = c.room_num  WHERE d.room_num = ? AND d.writer != ?`;

    let ontherWriter = await con.query(otherWriterSql, [room_num, writer]);

    let writerOther;

    // chatroom 테이블만 개설되고 서로 대화한적자체가 없는 경우
    if (ontherWriter[0].length === 0) {
      let 누가먼저데화시도했니SQL = `SELECT  tid , id  FROM chatroom   WHERE room_num =? group by tid`;
      let row = await con.query(누가먼저데화시도했니SQL, [room_num]);

      if (writer === row[0][0].tid) {
        writerOther = row[0][0].tid;
      } else {
        writerOther = row[0][0].id;
      }
    } else {
      writerOther = ontherWriter[0][0].writer;
    }

    console.log(`보낸사람아이디: ${writer}     상대방:  ${writerOther}`);

    let sql = "INSERT INTO dialogue  (room_num,writer,content) values (?,?,?) ";
    let excute = await con.query(sql, [room_num, writer, value]);
    return writerOther;
  } catch (err) {
    con.rollback();

    console.log(err);
  } finally {
    con.commit();
    con.release();
  }
};
