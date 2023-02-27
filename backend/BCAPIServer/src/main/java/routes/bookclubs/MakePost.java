package routes.bookclubs;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.JsonObject;
import daos.User;
import daos.UserResult;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.util.UUID;
import spark.Request;
import spark.Response;
import spark.Route;
import utils.BCGsonUtils;
import utils.OpenLibraryAPI;

public class MakePost implements Route {

  private FirebaseApp fbApp;
  private Connection sqlConn;

  public MakePost(FirebaseApp fbApp, Connection sqlConn) {
    this.fbApp = fbApp;
    this.sqlConn = sqlConn;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();
    JsonObject bodyJson;

    bodyJson = BCGsonUtils.fromStr(request.body());

    if (bodyJson == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "Body is not valid JSON!");
      return respJson.toString() + "\n";
    }

    if (!bodyJson.has("token") ||
        !bodyJson.has("book_key") ||
        !bodyJson.has("title") ||
        !bodyJson.has("body")) {
      respJson.addProperty("status", "failure");
      return respJson.toString() + "\n";
    }

    String token = bodyJson.get("token").getAsString();
    String bookKey = bodyJson.get("book_key").getAsString();

    // Validate provided book key.
    if (!OpenLibraryAPI.bookExists(bookKey)) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "Invalid book key!");
      return respJson.toString() + "\n";
    }

    FirebaseToken decodedToken;

    try {
      decodedToken = FirebaseAuth.getInstance(fbApp)
          .verifyIdToken(token, true);
    } catch (FirebaseAuthException e) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", String.valueOf(e.getAuthErrorCode()));
      return respJson.toString() + "\n";
    }

    String postTitle = bodyJson.get("title").getAsString();
    String postBody = bodyJson.get("body").getAsString();

    long date = System.currentTimeMillis();
    String uid = decodedToken.getUid();

    String seed = uid + "" + postBody + "" + date;

    String postId = UUID.nameUUIDFromBytes(seed.getBytes(StandardCharsets.UTF_8))
        .toString();

    User user = new User(uid, sqlConn);
    UserResult result = user.bookPost(bookKey, postTitle, postBody,
        bodyJson.has("tag") ? bodyJson.get("tag").getAsString() : "", postId, date, 0);

    if (result != UserResult.SUCCESS) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", result.name());
      return respJson.toString() + "\n";
    }

    respJson.addProperty("status", "success");
    respJson.addProperty("post_id", postId);
    return respJson.toString() + "\n";
  }
}
