package routes.bookclubs;

import com.google.gson.JsonObject;
import daos.Books;
import spark.Request;
import spark.Response;
import spark.Route;
import types.BookPost;

import java.util.List;

public class ListFeed implements Route {
    private Books books;

    public ListFeed(Books books) {
        this.books = books;
    }

    @Override
    public Object handle(Request request, Response response) throws Exception {
        JsonObject jsonObject = new JsonObject();

        String token = request.queryParams("token");
        // TODO: resolve the indivdual account's posts

        // For now just return a list of all the posts.
        List<BookPost> posts = books.listBookPosts("*");
        for (BookPost post : posts) {
            System.out.println(post.toString());
        }

        return jsonObject;
    }
}
