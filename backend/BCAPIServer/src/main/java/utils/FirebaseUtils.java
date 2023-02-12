package utils;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.FirebaseApp;
import com.google.firebase.cloud.FirestoreClient;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class FirebaseUtils {

  public static String resolveBCUsername(FirebaseApp fbApp, String uid)
      throws ExecutionException, InterruptedException {
    Firestore db = FirestoreClient.getFirestore(fbApp);

    CollectionReference cities = db.collection("users");
    Query query = cities.whereEqualTo("uid", uid);
    ApiFuture<QuerySnapshot> querySnapshot = query.get();

    List<QueryDocumentSnapshot> l = querySnapshot.get().getDocuments();

    if (l.size() != 1) {
      return null;
    }

    return l.get(0).getString("name");
  }
}
