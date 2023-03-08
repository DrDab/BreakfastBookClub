package routes.bookmgmt;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import daos.Books;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;
import types.Book;
import utils.OpenLibraryAPI;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
import utils.SqlInitUtil;

public class GetSaveBooks implements Route {

  private SqlInitUtil sqlInitUtil;

  public GetSaveBooks(SqlInitUtil sqlInitUtil) {
    this.sqlInitUtil = sqlInitUtil;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    JsonObject respJson = new JsonObject();
    String userID = request.queryParams("userID");
    if (userID == null) {
      respJson.addProperty("status", "failure");
      respJson.addProperty("failure_reason", "Need to provide a User ID");
      return respJson.toString() + "\n";
    }

    Connection sqlConn = sqlInitUtil.getSQLConnection();
    Books booksDAO = new Books(sqlConn);
    Map<String, Book> requestBookMap = new HashMap<>();
    List<String> bookIDs = booksDAO.getSavedBooks(userID);
    sqlConn.close();

    List<Book> books = new ArrayList<>();
    for (int i = 0; i < bookIDs.size(); i++) {
      String bookID = bookIDs.get(i);
      Book bookObj = OpenLibraryAPI.getBookByKeyWithCache(booksDAO, requestBookMap, bookID);
      if (bookObj == null) {
        respJson.addProperty("status", "failure");
        respJson.addProperty("failure_reason", "Failed to find book.");
        return respJson.toString() + "\n";
      } else {
        books.add(bookObj);
      }
    }

    Gson gson = new Gson();
    respJson.add("books", gson.toJsonTree(books));
    respJson.addProperty("status", "success");
    return respJson.toString() + "\n";
  }
}
