package routes.bookclubs;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import daos.Books;
import spark.Request;
import spark.Response;
import spark.Route;
import types.Recommendation;

import java.sql.Connection;
import java.util.List;
import utils.SqlInitUtil;

public class GetRecommendations implements Route {

  private SqlInitUtil sqlInitUtil;

  public GetRecommendations(SqlInitUtil sqlInitUtil) {
    this.sqlInitUtil = sqlInitUtil;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {

    JsonObject respJson = new JsonObject();

    String searchRecepientID = request.queryParams("recipient_userId");

    if (searchRecepientID == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "Need to provide recipient_userId for " +
          "recipient of recommendations");
      return respJson.toString() + "\n";
    }

    // getting list of book ids that have been recommended to user
    Connection sqlConn = sqlInitUtil.getSQLConnection();
    List<Recommendation> bookRequests = new Books(sqlConn).bookRecommendations(searchRecepientID);
    sqlConn.close();
    respJson.add("recommendations", new Gson().toJsonTree(bookRequests));
    respJson.addProperty("status", "success");
    return respJson.toString() + "\n";

  }
}
