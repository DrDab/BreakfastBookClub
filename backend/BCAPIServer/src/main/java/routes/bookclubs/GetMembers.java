package routes.bookclubs;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import daos.Books;
import daos.User;
import java.sql.Connection;
import java.util.List;
import spark.Request;
import spark.Response;
import spark.Route;

public class GetMembers implements Route {

  private Connection sqlConn;

  public GetMembers(Connection sqlConn) {
    this.sqlConn = sqlConn;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();

    String searchBookKey = request.queryParams("book_key");
    if (searchBookKey == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "book_key is missing!");
      return respJson.toString() + "\n";
    }

    List<String> clubUIDs = new Books(sqlConn).bookClubUsers(searchBookKey);
    //User user = new User()

    respJson.add("uids", new Gson().toJsonTree(clubUIDs));
    respJson.addProperty("status", "success");
    return respJson.toString() + "\n";
  }
}
