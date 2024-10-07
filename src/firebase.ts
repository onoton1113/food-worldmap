import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgdfX1VBG7WTas",
  authDomain: "diveintocode-test.firebaseapp.com",
  databaseURL: "https://diveintocode-test.firebaseio.com",
  projectId: "diveintocode-test",
  storageBucket: "diveintocode-test.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890abcdefghijkl"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);