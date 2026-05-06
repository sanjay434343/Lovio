import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/* ENV (Vercel) */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* CREATE PAGE */
window.createPage = async function () {
  const slug = document.getElementById("slug").value.trim();
  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();
  const image = document.getElementById("image").value.trim();

  if (!slug) return alert("Enter slug");

  await set(ref(db, "pages/" + slug), {
    name,
    message,
    image
  });

  document.getElementById("result").innerHTML =
    `✅ Created! <br><a href="?slug=${slug}">Open Page</a>`;
};

/* LOAD PAGE */
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

if (slug) {
  document.getElementById("createBox").classList.add("hidden");
  loadPage(slug);
}

async function loadPage(slug) {
  const snapshot = await get(ref(db, "pages/" + slug));

  if (!snapshot.exists()) {
    document.body.innerHTML = "<h1>Page Not Found ❌</h1>";
    return;
  }

  const data = snapshot.val();

  document.getElementById("app").innerHTML = `
    <div class="card">
      <h1>For Mom ❤️</h1>
      <h2>From ${data.name}</h2>
      <p>${data.message}</p>
      ${data.image ? `<img src="${data.image}" />` : ""}
    </div>
  `;
}

/* JSON INPUT SUPPORT */
document.getElementById("jsonFile").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(event) {
    const data = JSON.parse(event.target.result);

    document.getElementById("slug").value = data.slug || "";
    document.getElementById("name").value = data.name || "";
    document.getElementById("message").value = data.message || "";
    document.getElementById("image").value = data.image || "";
  };

  reader.readAsText(file);
});
