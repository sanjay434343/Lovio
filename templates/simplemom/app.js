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
let slug = window.location.pathname.split("/").pop();

/* fallback for ?slug= */
if (!slug || slug === "index.html") {
  const params = new URLSearchParams(window.location.search);
  slug = params.get("slug");
}

/* LOAD DATA */
async function loadPage() {
  const snapshot = await get(ref(db, "templates_created/" + slug));

  if (!snapshot.exists()) {
    document.getElementById("app").innerHTML =
      "<h1>Page Not Found ❌</h1>";
    return;
  }

  const page = snapshot.val();
  const data = page.data; // 🔥 IMPORTANT FIX

  document.getElementById("app").innerHTML = `
    <h1>${page.templateTitle || "For Mom ❤️"}</h1>
    <h2>From ${data.name}</h2>
    <p>${data.message}</p>
  `;
}

loadPage();
