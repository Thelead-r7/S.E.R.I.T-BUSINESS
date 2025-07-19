// Configuration Firebase (celle que tu as donnée)
const firebaseConfig = {
  apiKey: "AIzaSyDPavrp_mfV0POiDF3V4ZOZ0SHZGwgTmGs",
  authDomain: "serit-societe.firebaseapp.com",
  projectId: "serit-societe",
  storageBucket: "serit-societe.appspot.com",  // Correction ici : ".appspot.com" et non ".firebasestorage.app"
  messagingSenderId: "25581120285",
  appId: "1:25581120285:web:b8ee391fabf3d626480ff4"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// UID de l'admin autorisé
const adminUID = "39yahW5x6UeOLSpLzghM5CNu3k73";  // <-- remplace par ton UID admin exact

// Vérifie si l'utilisateur est connecté et admin (par UID)
auth.onAuthStateChanged(user => {
  if (!user) {
    alert("Accès refusé. Connectez-vous !");
    window.location.href = "connexion-admin.html";
  } else if (user.uid !== adminUID) {
    alert("Accès refusé : vous n'êtes pas admin.");
    auth.signOut();
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

  try {
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
  } catch (error) {
    alert("Erreur lors de la publication : " + error.message);
  }
});

// Déconnexion
document.getElementById("logout").addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "connexion-admin.html";
  });
});
