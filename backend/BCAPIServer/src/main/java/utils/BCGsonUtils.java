package utils;

import com.google.firebase.FirebaseApp;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import daos.Books;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import types.Book;
import types.BookPost;

public class BCGsonUtils {

  /**
   * Gets a JsonObject from the given JSON object in the string body.
   *
   * @param body, the string containing the JSON object to parse.
   * @return the parsed JSON Object from body, or null if parsed body doesn't have valid JSON
   * object, has multiple top-level JSON elements, or has trailing data.
   */
  public static JsonObject fromStr(String body) {
    JsonElement bodyElement;

    try {
      bodyElement = JsonParser.parseString(body);
    } catch (JsonSyntaxException ex) {
      return null;
    }

    if (!bodyElement.isJsonObject()) {
      return null;
    }

    return bodyElement.getAsJsonObject();
  }

  public static void ingestBookPostsListIntoJson(Books books, FirebaseApp fbApp,
      List<BookPost> posts,
      JsonArray postsArr) throws ExecutionException, InterruptedException, IOException {
    Gson gson = new Gson();
    Map<String, Book> bookRequestCache = new HashMap<>();

    for (BookPost post : posts) {
      JsonObject postJson = new JsonObject();

      postJson.addProperty("post_id", post.postId);

      //postJson.addProperty("book_key", post.bookKey);
      postJson.add("book", gson.toJsonTree(
          OpenLibraryAPI.getBookByKeyWithCache(books, bookRequestCache, post.book_key)));

      JsonObject userObj = new JsonObject();
      userObj.addProperty("userId", post.userId);
      userObj.addProperty("username", FirebaseUtils.resolveBCUsername(fbApp, post.userId));
      userObj.addProperty("bio", "");
      userObj.addProperty("thumbnail", "");
      postJson.add("user", userObj);

      postJson.addProperty("title", post.postTitle);
      postJson.addProperty("date", post.date);
      postJson.addProperty("tag", post.tag);
      postJson.addProperty("post", post.post);
      postJson.addProperty("likes", post.likes);

      postsArr.add(postJson);
    }
  }

  public static JsonArray getPostsJsonArrFromList(Books books, FirebaseApp fbApp,
      List<BookPost> posts)
      throws ExecutionException, InterruptedException, IOException {
    JsonArray postsArr = new JsonArray();
    ingestBookPostsListIntoJson(books, fbApp, posts, postsArr);
    return postsArr;
  }
}
