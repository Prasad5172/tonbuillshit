import json from "../build/main.compiled.json" assert { type: "json" };
import {
  beginCell,
  Cell,
  contractAddress,
  storeStateInit,
  toNano,
} from "ton-core";
import qs from "qs";
import qrcode from "qrcode-terminal";


async function deployScript() {
  console.log(
    "================================================================="
  );
  console.log("Deploy script is running, let's deploy our main.fc contract...");

  const codeCell = Cell.fromBoc(Buffer.from(json.hex, "hex"))[0];
  const dataCell = new Cell();

  const stateInit = {
    code: codeCell,
    data: dataCell,
  };

  const stateInitBuilder = beginCell();
  storeStateInit(stateInit)(stateInitBuilder);
  const stateInitCell = stateInitBuilder.endCell();

  const address = contractAddress(0, {
    code: codeCell,
    data: dataCell,
  });

  console.log(
    `The address of the contract is following: ${address.toString()}`
  );
  console.log(`Please scan the QR code below to deploy the contract:`);

  let link =
    `https://test.tonhub.com/transfer/` +
    address.toString({
      testOnly: true,
    }) +
    "?" +
    qs.stringify({
      text: "Deploy contract",
      amount: toNano(1).toString(10),
      init: stateInitCell.toBoc({ idx: false }).toString("base64"),
    });

  qrcode.generate(link, { small: true }, (code) => {
    console.log(code);
  });
}

deployScript();
