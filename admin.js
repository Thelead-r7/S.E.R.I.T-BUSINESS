// Initialisation Firebase (modifiez avec vos propres infos)
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJET.firebaseapp.com",
  projectId: "VOTRE_PROJET",
  storageBucket: "VOTRE_PROJET.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Vérifie si l'utilisateur est connecté (authentifié)
auth.onAuthStateChanged(user => {
  if (!user) {
    alert("Accès refusé. Connectez-vous !");
    window.location.href = "connexion-admin.html";
  }
});

// Gestion du formulaire de publication
document.getElementById("form-pub").addEventListener("submit", async (e) => {
  e.preventDefault();

  const titre = document.getElementById("titre").value.trim();
  const contenu = document.getElementById("contenu").value.trim();
  const imageFile = document.getElementById("image").files[0];

  if (!titre || !contenu) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  let imageURL = "";
  if (imageFile) {
    const imageRef = storage.ref(`publications/${Date.now()}_${imageFile.name}`);
    await imageRef.put(imageFile);
    imageURL = await imageRef.getDownloadURL();
  }

  await db.collection("publications").add({
    titre,
    contenu,
    imageURL,
    date: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("✅ Publication envoyée !");
  document.getElementById("form-pub").reset();
});

// Déconnexion
document.getElementById("logout").addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "connexion-admin.html";
  });
});
