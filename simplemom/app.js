import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/* CONFIG */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* GET SLUG */
const slug = window.location.pathname.substring(1);

/* LOAD DATA */
async function loadPage() {
  const snapshot = await get(ref(db, "pages/" + slug));

  if (!snapshot.exists()) {
    document.getElementById("app").innerHTML =
      "<h1>Page Not Found ❌</h1>";
    return;
  }

  const data = snapshot.val();

  document.getElementById("app").innerHTML = `
    <h1>For Mom ❤️</h1>
    <h2>From ${data.name}</h2>
    <p>${data.message}</p>
    ${data.image ? `<img src="${data.image}" />` : ""}
  `;
}

loadPage();
