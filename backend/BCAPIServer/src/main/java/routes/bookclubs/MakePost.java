package routes.bookclubs;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.AuthErrorCode;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.cloud.FirestoreClient;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import daos.Books;
import daos.User;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import spark.Request;
import spark.Response;
import spark.Route;

public class MakePost implements Route {

  private FirebaseApp fbApp;
  private Connection sqlConn;

  public MakePost(FirebaseApp fbApp, Connection sqlConn) {
    this.fbApp = fbApp;
    this.sqlConn = sqlConn;
  }

  private String getUsername(String uid) throws ExecutionException, InterruptedException {
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

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject bodyJson = JsonParser.parseString(request.body()).getAsJsonObject();
    JsonObject respJson = new JsonObject();

    if (!bodyJson.has("token") ||
        !bodyJson.has("book_key") ||
        !bodyJson.has("title") ||
        !bodyJson.has("body")) {
      respJson.addProperty("status", "failure");
      return respJson;
    }

    String token = bodyJson.get("token").getAsString();
    String bookKey = bodyJson.get("book_key").getAsString();

    FirebaseToken decodedToken = null;

    try {
      decodedToken = FirebaseAuth.getInstance()
          .verifyIdToken(token, true);
    } catch (FirebaseAuthException e) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", String.valueOf(e.getAuthErrorCode()));
      return respJson;
    }

    String postTitle = bodyJson.get("title").getAsString();
    String postBody = bodyJson.get("body").getAsString();

    long date = System.currentTimeMillis();
    String uid = decodedToken.getUid();

    String seed = uid + "" + postBody + "" + date;

    String postId = UUID.nameUUIDFromBytes(seed.getBytes(StandardCharsets.UTF_8))
        .toString();

    User user = new User(getUsername(uid), sqlConn);
    user.bookPost(bookKey, postTitle, postBody,
        bodyJson.has("tag") ? bodyJson.get("tag").getAsString() : "", postId, date, 0);

    respJson.addProperty("status", "success");
    respJson.addProperty("post_id", postId);
    return respJson;
  }
}
