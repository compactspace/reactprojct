import React, { useEffect, useState } from "react";

import { GeneralProductCompo } from "../component/GeneralProductCompo/GeneralProductCompo";
import { EventProductCompo } from "../component/eventProductCompo/EventProductCompo";
import { useHistory, useParams } from "react-router-dom";

import axios from "axios";

export const EventSaleProductMainPage = () => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  let { eventproduct_num } = useParams();

  let [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    const bodyData = {
      proCode: eventproduct_num,
    };

    axios
      .post(`http://${IP}:4000/user/getEventSaleProductOne`, bodyData)
      .then((res) => {
        const { redisPorductIfno } = res.data;
        console.log(redisPorductIfno);
        setProductInfo(redisPorductIfno);
      });
  }, []);

  return (
    <>
      {productInfo != null && (
        <>
          <EventProductCompo productInfo={productInfo}></EventProductCompo>
        </>
      )}
    </>
  );
  // return <>{id != undefined && <GeneralProductCompo></GeneralProductCompo>}</>;
};
