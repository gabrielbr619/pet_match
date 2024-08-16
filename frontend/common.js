import { Platform } from "react-native";

const LOCALHOST =
  Platform.OS === "ios" || Platform.OS === "android"
    ? "http://192.168.3.21:3000"
    : "http://localhost:3000";
console.log(Platform.OS);
export const API_BASE_URL = LOCALHOST + "/api/";
