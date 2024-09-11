import { Platform } from "react-native";
import {
  LOCALHOST_IOS_ANDROID,
  LOCALHOST_WEB,
  PROD_API,
  ENVIRONMENT,
} from "@env";

const LOCALHOST =
  Platform.OS === "ios" || Platform.OS === "android"
    ? LOCALHOST_IOS_ANDROID
    : LOCALHOST_WEB;

export const API_BASE_URL =
  ENVIRONMENT === "production" ? PROD_API : `${LOCALHOST}/api/`;
console.log(API_BASE_URL, LOCALHOST_IOS_ANDROID, LOCALHOST_WEB);
