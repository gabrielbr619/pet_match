import { Platform } from "react-native";
import { LOCALHOST_IOS_ANDROID, LOCALHOST_WEB } from "@env";

const LOCALHOST =
  Platform.OS === "ios" || Platform.OS === "android"
    ? LOCALHOST_IOS_ANDROID
    : LOCALHOST_WEB;

export const API_BASE_URL = `${LOCALHOST}/api/`;
