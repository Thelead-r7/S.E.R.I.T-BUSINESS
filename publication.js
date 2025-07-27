import { auth, db } from "./firebase.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const publicationsContainer = document.getElementById("publications-container");
const btnLogout = document.getElementById("btn-logout");
const userInfo = document.getElementById("user-info");

let currentUser = null;

// Connexion utilisateur (auth Google)
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    userInfo.textContent = `Connecté en tant que : ${user.displayName} (${user.email})`;
    chargerPublications();
  } else {
    // Pas connecté, demande connexion Google
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Connexion requise pour voir et interagir avec les publications.");
      console.error(error);
    }
  }
});

// Déconnexion
btnLogout.addEventListener("click", async () => {
  await signOut(auth);
  location.reload();
});

// Charger publications + afficher avec likes + commentaires
function chargerPublications() {
  const q = query(collection(db, "publications"), orderBy("timestamp", "desc"));
  onSnapshot(q, (snapshot) => {
    publicationsContainer.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      // Créer l’élément publication complet
      const pubEl = document.createElement("div");
      pubEl.classList.add("publication");

      // Date formatée
      const dateTexte = data.timestamp
        ? data.timestamp.toDate().toLocaleString()
        : "Date inconnue";

      pubEl.innerHTML = `
        <h3>${data.titre}</h3>
        ${data.imageURL ? `<img src="${data.imageURL}" alt="Image publication">` : ""}
        <p>${data.texte}</p>
        <div class="footer">
          <small>Publié le ${dateTexte}</small>
          <button class="btn-like">${data.likes?.length || 0} ❤️ J’aime</button>
        </div>
        <div class="comments-section">
          <div class="comments-list"></div>
          <div class="add-comment">
            <input type="text" placeholder="Ajouter un commentaire..." />
            <button>Envoyer</button>
          </div>
        </div>
      `;

      publicationsContainer.appendChild(pubEl);

      // Likes
      const btnLike = pubEl.querySelector(".btn-like");
      const userLiked = data.likes?.includes(currentUser.uid);
      if (userLiked) btnLike.classList.add("liked");

      btnLike.addEventListener("click", async () => {
        const pubRef = doc(db, "publications", id);
        if (userLiked) {
          // Retirer like
          await updateDoc(pubRef, {
            likes: arrayRemove(currentUser.uid),
          });
        } else {
          // Ajouter like
          await updateDoc(pubRef, {
            likes: arrayUnion(currentUser.uid),
          });
        }
      });

      // Gestion des commentaires
      const commentsList = pubEl.querySelector(".comments-list");
      const addCommentInput = pubEl.querySelector(".add-comment input");
      const addCommentBtn = pubEl.querySelector(".add-comment button");

      // Charger les commentaires
      const commentsRef = collection(db, "publications", id, "commentaires");
      const qComments = query(commentsRef, orderBy("timestamp", "asc"));

      onSnapshot(qComments, (commentsSnapshot) => {
        commentsList.innerHTML = "";
        commentsSnapshot.forEach((commentDoc) => {
          const c = commentDoc.data();
          const cEl = document.createElement("div");
          cEl.classList.add("comment");
          cEl.innerHTML = `<strong>${c.nomUtilisateur} :</strong> ${c.texte}`;
          commentsList.appendChild(cEl);
        });
      });

      // Ajouter un commentaire
      addCommentBtn.addEventListener("click", async () => {
        const texteComment = addCommentInput.value.trim();
        if (!texteComment) return alert("Le commentaire ne peut pas être vide.");

        try {
          await addDoc(commentsRef, {
            nomUtilisateur: currentUser.displayName || "Anonyme",
            texte: texteComment,
            timestamp: serverTimestamp(),
            uidUtilisateur: currentUser.uid,
          });
          addCommentInput.value = "";
        } catch (err) {
          alert("Erreur lors de l'ajout du commentaire : " + err.message);
        }
      });
    });
  });
                }
