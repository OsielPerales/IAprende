import admin from 'firebase-admin'

function init() {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_JSON, 'base64').toString('utf-8')
      admin.initializeApp({ credential: admin.credential.cert(JSON.parse(decoded)) })
    } else {
      // Cloud Functions runtime provides ADC automatically
      admin.initializeApp()
    }
  }
}

export const db = new Proxy({} as FirebaseFirestore.Firestore, {
  get(_, prop) {
    init();
    const firestore = admin.firestore();
    const value = (firestore as any)[prop];
    if (typeof value === 'function') {
      return value.bind(firestore);
    }
    return value;
  }
});

export const auth = new Proxy({} as admin.auth.Auth, {
  get(_, prop) {
    init();
    const authInstance = admin.auth();
    const value = (authInstance as any)[prop];
    if (typeof value === 'function') {
      return value.bind(authInstance);
    }
    return value;
  }
});

export { admin }
