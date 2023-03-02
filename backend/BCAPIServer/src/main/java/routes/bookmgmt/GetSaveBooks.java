package routes.bookmgmt;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import daos.Books;
import spark.Request;
import spark.Response;
import spark.Route;
import types.Book;
import utils.OpenLibraryAPI;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

public class GetSaveBooks implements Route {

    Connection sqlConn;
    public GetSaveBooks(Connection sqlConn) {
        this.sqlConn = sqlConn;
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

        List<String> bookIDs = new Books(sqlConn).getSavedBooks(userID);
        List<Book> books = new ArrayList<>();
        for (int i = 0; i < bookIDs.size(); i++) {
            String bookID = bookIDs.get(i);
            Book bookObj = OpenLibraryAPI.getBookByKey(bookID);
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
