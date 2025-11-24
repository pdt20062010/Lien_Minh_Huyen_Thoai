const firebaseConfig = {
          apiKey: "AIzaSyBSr-rB46vbyq8TNTrg5_qCGqbTL_K8IBY",
          authDomain: "sanphamcuoikhoa-c34d2.firebaseapp.com",
          projectId: "sanphamcuoikhoa-c34d2",
          storageBucket: "sanphamcuoikhoa-c34d2.firebasestorage.app",
          messagingSenderId: "569954446289",
          appId: "1:569954446289:web:f7f4ff5bf35b46e580cef0"
        };
      
      
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();