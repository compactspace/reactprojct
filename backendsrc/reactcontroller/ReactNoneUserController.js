const path = require("path");
const axios = require("axios");
const noneuserservice = require("../reactservice/noneuserservice");

module.exports.Onedayclassinfo = async (req, res) => {
  let obj = await noneuserservice.openclassinfoService(req, res);

  // console.log(obj);
  res.json(obj);
};

module.exports.OnedayclassRest = async (req, res) => {
  let obj = await noneuserservice.OnedayclassRestService(req, res);

  // console.log(obj);
  res.json(obj);
};

module.exports.justregisterOnedayclassinfo = async (req, res) => {
  let obj = await noneuserservice.justregisterOnedayclassinfoService(req, res);

  // console.log(obj);
  res.json(obj);
};

module.exports.IsMagam = async (req, res) => {
  let obj = await noneuserservice.IsMagamService(req, res);

  // console.log(obj);
  res.json(obj);
};

module.exports.FindOutRest = async (req, res) => {
  let obj = await noneuserservice.FindOutRestService(req, res);

  // console.log(obj);
  res.json(obj);
};
