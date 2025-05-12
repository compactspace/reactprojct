import styled from "styled-components";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { MasterTable } from "../../MasterTableStyle/MasterTable";
export const ManagerBannerCompo = ({ searchType, setsearchType }) => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const [promotionCnt, setPromotionCnt] = useState(0);
  const [promotionList, setPromotionList] = useState([]);

  useEffect(() => {
    console.log(searchType);
    axios
      .post(`http://${IP}:4000/master/managerpromotion`, searchType)
      .then((res) => {
        console.log(res.data);
        const { bannerpromotionCnt, bannerpromotionList } = res.data;
        setPromotionCnt(bannerpromotionCnt);
        setPromotionList(bannerpromotionList);
      });
  }, [searchType]);

  const columnName = {
    max_paid: "배너결제일",
    promotion_confirm_status: "배너등록승인",
    promotion_start_date: "배너등록시작일",
    promotion_end_date: "배너등록종요일",
  };
  return (
    <>
      <MasterTable
        rowCount={promotionCnt}
        data={promotionList}
        columnName={columnName}
        InputType={""}
      ></MasterTable>
    </>
  );
};
