// ─── firebase.js ─────────────────────────────────────────────────────────────
// Substitueix els valors de firebaseConfig pels del teu projecte Firebase.
// Instruccions: https://console.firebase.google.com → Nou projecte → Web app

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection,
  getDocs, deleteDoc, serverTimestamp, query, orderBy }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── 🔧 CONFIGURA AQUÍ EL TEU PROJECTE FIREBASE ──────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyAw4rIHqAFonmYX2f2FrSIwoRoPCREr7Kk",
  authDomain:        "lingucat-escola.firebaseapp.com",
  projectId:         "lingucat-escola",
  storageBucket:     "lingucat-escola.firebasestorage.app",
  messagingSenderId: "984004257990",
  appId:             "1:984004257990:web:71cd880e0250fd4c328fc7"
};
// ─────────────────────────────────────────────────────────────────────────────

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

// ── Domini autoritzat de l'escola ────────────────────────────────────────────
// Canvia "@escola.cat" pel domini real de l'escola
export const SCHOOL_DOMAIN = "@angelsalemany.cat";

// ── Comptes de professor (afegeix els correus dels professors aquí) ───────────
export const ADMIN_EMAILS = [
  "j.merideno@angelsalemany.cat",
];

// ── Auth helpers ──────────────────────────────────────────────────────────────

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ hd: SCHOOL_DOMAIN.replace("@","") });
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Comprova que el correu pertany al domini de l'escola
  if (!user.email.endsWith(SCHOOL_DOMAIN)) {
    await signOut(auth);
    throw new Error(`Només es permeten comptes ${SCHOOL_DOMAIN}`);
  }

  // Crea el perfil a Firestore si no existeix
  const userRef = doc(db, "users", user.uid);
  const snap    = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid:       user.uid,
      email:     user.email,
      name:      user.displayName || user.email.split("@")[0],
      photo:     user.photoURL || "",
      role:      ADMIN_EMAILS.includes(user.email) ? "admin" : "student",
      courses:   [],
      createdAt: serverTimestamp(),
    });
  }
  return user;
}

export function logout() { return signOut(auth); }
export function onAuth(cb) { return onAuthStateChanged(auth, cb); }

// ── Firestore helpers ─────────────────────────────────────────────────────────

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function getAllStudents() {
  const q = query(collection(db, "users"), orderBy("name"));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => d.data()).filter(u => u.role === "student");
}

export async function enrollStudent(uid, courseId) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const courses = snap.data().courses || [];
  if (!courses.includes(courseId)) {
    await updateDoc(ref, { courses: [...courses, courseId] });
  }
}

export async function unenrollStudent(uid, courseId) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const courses = (snap.data().courses || []).filter(c => c !== courseId);
  await updateDoc(ref, { courses });
}

export async function deleteStudent(uid) {
  await deleteDoc(doc(db, "users", uid));
  // Also delete progress
  await deleteDoc(doc(db, "progress", uid));
}

export async function getProgress(uid) {
  const snap = await getDoc(doc(db, "progress", uid));
  return snap.exists() ? snap.data() : { xp:{}, completed:{}, streak:0, lastActive:null };
}

export async function saveProgress(uid, progress) {
  await setDoc(doc(db, "progress", uid), { ...progress, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getAllProgress() {
  const snaps = await getDocs(collection(db, "progress"));
  const map = {};
  snaps.docs.forEach(d => { map[d.id] = d.data(); });
  return map;
}
