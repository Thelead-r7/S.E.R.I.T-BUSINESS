// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDPavrp_mfV0POiDF3V4ZOZ0SHZGwgTmGs",
  authDomain: "serit-societe.firebaseapp.com",
  projectId: "serit-societe",
  storageBucket: "serit-societe.appspot.com", // ✅ corrigé ici
  messagingSenderId: "25581120285",
  appId: "1:25581120285:web:b8ee391fabf3d626480ff4"
};

// Initialisation
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Gestion du formulaire de publication
const form = document.getElementById('form-pub');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const titre = document.getElementById('titre').value.trim();
  const contenu = document.getElementById('contenu').value.trim();
  const imageFile = document.getElementById('image').files[0];

  try {
    let imageUrl = "";

    if (imageFile) {
      const storageRef = storage.ref("images/" + Date.now() + "_" + imageFile.name);
      const snapshot = await storageRef.put(imageFile);
      imageUrl = await snapshot.ref.getDownloadURL();
    }

    await db.collection("publications").add({
      titre: titre,
      contenu: contenu,
      imageUrl: imageUrl,
      date: Date.now(),
      likes: 0,
      commentaires: []
    });

    alert("✅ Publication envoyée avec succès !");
    form.reset();
  } catch (error) {
    console.error("Erreur lors de la publication :", error);
    alert("❌ Une erreur s’est produite pendant l’envoi.");
  }
});

// Déconnexion
document.getElementById('logout').addEventListener('click', () => {
  auth.signOut().then(() => {
    window.location.href = "connexion-admin.html"; // Redirige vers la page de connexion
  });
});
