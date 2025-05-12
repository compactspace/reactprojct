import React, { useEffect, useState } from "react";

import { GeneralProductCompo } from "../component/GeneralProductCompo/GeneralProductCompo";
import { useHistory, useParams } from "react-router-dom";

import axios from "axios";

export const GeneralProductMainPage = () => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  let { product_num, onedayclass_num } = useParams();

  let [productInfo, setProductInfo] = useState(null);
  let [productImageList, setProductImageList] = useState(null);

  useEffect(() => {
    console.log(product_num, onedayclass_num);

    const bodyData = {
      product_num: product_num,

      onedayclass_num: onedayclass_num,
      uc_bannertype: "A100",
    };

    axios
      .post(`http://${IP}:4000/user/getSelectOneBannerTypeProduct`, bodyData)
      .then((res) => {
        const { productImageList, productInfo } = res.data;
        setProductInfo(productInfo[0]);
        setProductImageList(productImageList);
      });
  }, []);

  return (
    <>
      {productInfo != null && productImageList != null && (
        <>
          <GeneralProductCompo
            productInfo={productInfo}
            productImageList={productImageList}
          ></GeneralProductCompo>
        </>
      )}
    </>
  );
  // return <>{id != undefined && <GeneralProductCompo></GeneralProductCompo>}</>;
};
