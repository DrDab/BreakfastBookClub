package routes.bookclubs;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import daos.Books;
import daos.User;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;
import spark.Request;
import spark.Response;
import spark.Route;
import types.Book;
import types.BookPost;

import java.util.List;
import utils.BCGsonUtils;

public class ListFeed implements Route {

  private FirebaseApp fbApp;
  private Connection sqlConn;

  public ListFeed(FirebaseApp fbApp, Connection sqlConn) {
    this.fbApp = fbApp;
    this.sqlConn = sqlConn;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();

    String token = request.queryParams("token");
    if (token == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "Expected fields are missing!");
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

    String uid = decodedToken.getUid();
    User user = new User(uid, sqlConn);

    List<BookPost> masterList = new ArrayList<>();
    Set<String> knownIds = new HashSet<>();
    JsonArray postsArr = new JsonArray();

    for (BookPost post : user.getClubPosts()) {
      if (!knownIds.contains(post.postId)) {
        masterList.add(post);
        knownIds.add(post.postId);
      }
    }

    List<String> friendUIDs = user.allFriends();

    for (String friendUID : friendUIDs) {
      User friend = new User(friendUID, sqlConn);

      for (BookPost post : friend.getUserPosts()) {
        if (!knownIds.contains(post.postId)) {
          masterList.add(post);
          knownIds.add(post.postId);
        }
      }
    }

    Collections.sort(masterList, Comparator.comparingLong(p -> p.date));
    BCGsonUtils.ingestBookPostsListIntoJson(fbApp, masterList, postsArr);
    respJson.add("posts", postsArr);
    respJson.addProperty("status", "success");
    return respJson;
  }
}
