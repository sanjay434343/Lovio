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

/* 🔥 GET SLUG (handles both cases) */
function getSlug() {
  // 1. Try query param
  const params = new URLSearchParams(window.location.search);
  let slug = params.get("slug");

  // 2. Fallback to path (/templates/simplemom/sanjay)
  if (!slug) {
    const parts = window.location.pathname.split("/").filter(Boolean);
    slug = parts[parts.length - 1];

    // avoid picking "simplemom" as slug
    if (slug === "simplemom") slug = null;
  }

  return slug;
}

const slug = getSlug();

/* LOAD DATA */
async function loadPage() {
  if (!slug) {
    document.getElementById("app").innerHTML =
      "<h1>No Slug Provided ❌</h1>";
    return;
  }

  const snapshot = await get(ref(db, "templates_created/" + slug));

  if (!snapshot.exists()) {
    document.getElementById("app").innerHTML =
      "<h1>Page Not Found ❌</h1>";
    return;
  }

  const page = snapshot.val();
  const data = page.data;

  document.getElementById("app").innerHTML = `
    <h1>${page.templateTitle || "For Mom ❤️"}</h1>
    <h2>From ${data.name}</h2>
    <p>${data.message}</p>
  `;
}

loadPage();
