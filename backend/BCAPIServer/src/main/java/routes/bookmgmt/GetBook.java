package routes.bookmgmt;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import daos.Books;
import java.sql.Connection;
import java.util.HashMap;
import spark.Request;
import spark.Response;
import spark.Route;
import types.Book;
import utils.OpenLibraryAPI;

public class GetBook implements Route {

  private Connection sqlConn;

  public GetBook(Connection sqlConn) {
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

    Book bookObj = OpenLibraryAPI.getBookByKeyWithCache(new Books(sqlConn), new HashMap<>(),
        searchBookKey);
    if (bookObj == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "Failed to find book.");
      return respJson.toString() + "\n";
    }

    Gson gson = new Gson();
    respJson.add("book", gson.toJsonTree(bookObj));
    respJson.addProperty("status", "success");
    return respJson.toString() + "\n";
  }
}
