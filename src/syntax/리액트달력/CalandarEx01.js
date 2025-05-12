import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export const CalandarEx01 = () => {
  const [date, setDate] = useState(new Date()); // 현재 선택된 날짜
  const [events, setEvents] = useState([
    { date: "2025-04-01", event: "회의" },
    { date: "2025-04-05", event: "생일 파티" },
    { date: "2025-04-10", event: "모임" },
  ]); // 서버에서 받은 이벤트 배열

  // 서버에서 이벤트 데이터 받아오기
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://api.example.com/events"); // API URL
        const result = await response.json();
        setEvents(result); // 받은 데이터로 상태 업데이트
      } catch (error) {
        console.error("이벤트 가져오기 실패:", error);
      }
    };

    fetchEvents();
  }, []);

  // 날짜별 이벤트를 표시하기 위한 함수
  const tileContent = ({ date }) => {
    // date는 각 날짜에 해당하는 JavaScript Date 객체

    const fromDate = date.toLocaleDateString("en-CA");
    console.log(`년월일형식: ${fromDate}`);

    const event = events.find(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );

    return event ? <span>{event.event}</span> : null; // 이벤트가 있으면 날짜 칸에 이벤트 제목 표시
  };

  return (
    <div>
      <h1>달력에 이벤트 표시</h1>
      <Calendar
        value={date}
        tileContent={tileContent} // 각 날짜에 이벤트 내용 표시
      />
    </div>
  );
};
