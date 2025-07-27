import { db } from "./firebase-config.js";
import {
  collection, getDocs, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const container = document.getElementById("publications");

async function chargerPublications() {
  const q = query(collection(db, "publications"), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    container.innerHTML = "<p>Aucune publication pour le moment.</p>";
    return;
  }

  querySnapshot.forEach(doc => {
    const data = doc.data();
    const card = document.createElement("div");
    card.className = "publication";

    card.innerHTML = `
      <h3>${data.titre}</h3>
      <p>${data.contenu}</p>
      ${data.imageURL ? `<img src="${data.imageURL}" alt="Image" style="max-width:100%;"/>` : ""}
      <hr/>
    `;

    container.appendChild(card);
  });
}

chargerPublications();
