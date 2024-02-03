import { IResponse } from "../interfaces/response";
import fetch from "node-fetch";
import logger from "../../util/logger/logger";
import { config } from "secreta";
import CryptoJS from "crypto-js";
import base64 from "base-64";

const { HASH_SECRET } = config;

export class UniversalsService {
  protected failureResponse = async (message?, data?): Promise<IResponse> => {
    return {
      statusCode: 400,
      status: false,
      message: message || "failed",
      data: data || null,
    };
  };

  protected successResponse = async (message?, data?): Promise<IResponse> => {
    return {
      statusCode: 200,
      status: true,
      message: message || "Success",
      data,
    };
  };

  protected serviceErrorHandler = async (req, error) => {
    const { originalUrl, method, ip, api } = req;
    logger.log(
      "warn",
      `URL:${originalUrl} - METHOD:${method} - IP:${ip || api} - ERROR:${error}`
    );
    return {
      statusCode: 500,
      status: false,
      message: "Internal server error",
      data: null,
    };
  };

  protected apiCall = async (api, body, headers, method, isXML?: boolean) => {
    try {
      let payLoad = { headers, method };
      if (isXML === true) {
        payLoad["body"] = body;
      } else {
        body ? (payLoad["body"] = JSON.stringify(body)) : payLoad;
      }
      const result = await fetch(api, payLoad);
      return result;
    } catch (error) {
      this.serviceErrorHandler({ api, body, headers, method }, error);
    }
  };

  protected encryptString = (text: string): String => {
    return base64.encode(text);
    // return CryptoJS.AES.encrypt(text, HASH_SECRET).toString();
  };

  protected decryptString = (encodedString: string): String => {
    return base64.decode(encodedString);
    // var bytes = CryptoJS.AES.decrypt(encodedString, HASH_SECRET);
    // return bytes.toString(CryptoJS.enc.Utf8);
  };
}
