import { db } from "./firebase-config.js";
import {
  collection, getDocs, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const publicationsContainer = document.getElementById("publicationsContainer");
const loader = document.getElementById("loader");

async function chargerPublications() {
  try {
    const q = query(collection(db, "publications"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      loader.textContent = "Aucune publication trouvée.";
      return;
    }

    loader.style.display = "none";

    querySnapshot.forEach(doc => {
      const data = doc.data();

      const publication = document.createElement("div");
      publication.classList.add("publication");

      if (data.titre) {
        const titre = document.createElement("h3");
        titre.textContent = data.titre;
        publication.appendChild(titre);
      }

      if (data.description) {
        const texte = document.createElement("p");
        texte.textContent = data.description;
        publication.appendChild(texte);
      }

      if (data.imageUrl) {
        const image = document.createElement("img");
        image.src = data.imageUrl;
        image.alt = "Image de la publication";
        image.style.maxWidth = "100%";
        publication.appendChild(image);
      }

      publicationsContainer.appendChild(publication);
    });
  } catch (err) {
    loader.textContent = "Erreur lors du chargement des publications.";
    console.error("Erreur de chargement :", err);
  }
}

chargerPublications();
