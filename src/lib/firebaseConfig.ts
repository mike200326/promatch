import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "promatch-2c013.firebaseapp.com",
  projectId: "promatch-2c013",
  storageBucket: "promatch-2c013.appspot.com",
  messagingSenderId: "TU_MESSAGING_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
