package routes.bookmgmt;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.gson.JsonObject;
import daos.Books;
import daos.UserResult;
import spark.Request;
import spark.Response;
import spark.Route;


import java.sql.Connection;
import utils.SqlInitUtil;

public class UnsaveBook implements Route {

  FirebaseApp fbApp;
  SqlInitUtil sqlInitUtil;

  public UnsaveBook(FirebaseApp fbApp, SqlInitUtil sqlInitUtil) {
    this.fbApp = fbApp;
    this.sqlInitUtil = sqlInitUtil;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();
    String token = request.queryParams("token");
    String book_key = request.queryParams("book_key");
    if (token == null || book_key == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "Need to provide a token or a book key");
      return respJson.toString() + "\n";
    }

    FirebaseToken decodedTokenSender;
    // authenticating user
    try {
      decodedTokenSender = FirebaseAuth.getInstance()
          .verifyIdToken(token, true);
    } catch (FirebaseAuthException e) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", String.valueOf(e.getAuthErrorCode()));
      return respJson.toString() + "\n";
    }
    String user = decodedTokenSender.getUid();
    Connection sqlConn = sqlInitUtil.getSQLConnection();
    UserResult result = new Books(sqlConn).unsaveBook(user, book_key);
    sqlConn.close();
    if (result != UserResult.SUCCESS) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", result.name());
      return respJson.toString() + "\n";
    }

    respJson.addProperty("status", "success");
    return respJson.toString() + "\n";


  }
}
