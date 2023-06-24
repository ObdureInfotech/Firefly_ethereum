import fs from "fs";
import express from "express";
import axios from "axios";
var app = express();
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import * as IPFS from "ipfs-core";
import http from "http";
app.post("/jsonData", async (req, res) => {
  try {
    const node = await IPFS.create();
    const jsonFolder = "./jsonFiles";
    let dataArray = [];
    let cidData = [];
    fs.readdirSync(jsonFolder).forEach((file) => {
      let fileData = JSON.parse(fs.readFileSync(jsonFolder + "/" + file));
      dataArray.push({ fileName: file, data: fileData });
    });

    for (let i = 0; i < dataArray.length; i++) {
      const file = await node.add({
        path: dataArray[i].fileName,
        content: uint8ArrayFromString(JSON.stringify(dataArray[i].data)),
      });
      cidData.push(file);
    }

    for (let i = 0; i < cidData.length; i++) {
      const data = await callApi(cidData[i].cid.toString());
    }

    res.send({ success: true, data: cidData });
  } catch (error) {
    res.send({ success: false, error: error });
  }
});

async function callApi(value) {
  const postData = {
    cid: value,
  };
  const config = {
    method: "post",
    url: "http://localhost:8082/sendMessage",
    headers: {
      "Content-Type": "application/json",
    },
    data: postData,
  };
  axios(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });
}
app.get("/sendmessage", async (req, res) => {
  const postData = {
    cid: "bar",
  };
  const config = {
    method: "post",
    url: "http://localhost:8082/sendMessage",
    headers: {
      "Content-Type": "application/json",
    },
    data: postData,
  };
  axios(config)
    .then((response) => {})
    .catch((error) => {
      console.error(error);
    });
});
app.listen(8081, function () {
  console.log("Example app listening at 8081");
});
