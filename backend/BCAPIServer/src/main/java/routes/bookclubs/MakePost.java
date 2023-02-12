package routes.bookclubs;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import daos.User;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.util.UUID;
import spark.Request;
import spark.Response;
import spark.Route;
import utils.BCGsonUtils;

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
    JsonObject bodyJson = null;

    boolean bodyInvalid = false;

    try {
      bodyJson = BCGsonUtils.fromStr(request.body());
    } catch (JsonSyntaxException ex) {
      ex.printStackTrace();
      bodyInvalid = true;
    }

    if (bodyInvalid || bodyJson == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "Body is not valid JSON!");
      return respJson;
    }

    if (!bodyJson.has("token") ||
        !bodyJson.has("book_key") ||
        !bodyJson.has("title") ||
        !bodyJson.has("body")) {
      respJson.addProperty("status", "failure");
      return respJson;
    }

    String token = bodyJson.get("token").getAsString();
    String bookKey = bodyJson.get("book_key").getAsString();

    FirebaseToken decodedToken;

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

    User user = new User(uid, sqlConn);
    user.bookPost(bookKey, postTitle, postBody,
        bodyJson.has("tag") ? bodyJson.get("tag").getAsString() : "", postId, date, 0);

    respJson.addProperty("status", "success");
    respJson.addProperty("post_id", postId);
    return respJson;
  }
}
