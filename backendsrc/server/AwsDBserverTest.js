const express = require('express');
const mysql = require('mysql2');  // mysql2 패키지 import

const app = express();
const port = 3000;  // 서버 포트 설정

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: 'happyjob.ctw2kssgwgec.ap-northeast-2.rds.amazonaws.com',  // MySQL 호스트
  user: 'root',  // MySQL 사용자 이름
  password: 'happy2025!!!',  // MySQL 비밀번호
  database: 'octfair2',  // 연결할 데이터베이스 이름
  port: 3306,  // MySQL 기본 포트
});

// MySQL 연결 테스트
connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패: ' + err.stack);
    return;
  }
  console.log('MySQL 연결 성공, 연결 ID: ' + connection.threadId);
});

// 간단한 GET API 설정
app.get('/', (req, res) => {
    connection.query('select * from tb_userinfo',(err,res)=>{

        if(err){
            console.log(err)
        }
        console.log('쿼리 결과:', res);
    })
  res.send('MySQL 연결 테스트 서버');
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중`);
});