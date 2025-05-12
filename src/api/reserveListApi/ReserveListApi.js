import axios from "axios";

import { apiurlList } from "../apiurlList/apiurlList";

export const ReserveListApi = async (searchKeyword) => {
  const res = await axios.post(
    apiurlList.management.reserveList,
    searchKeyword
  );
  return res;
};
