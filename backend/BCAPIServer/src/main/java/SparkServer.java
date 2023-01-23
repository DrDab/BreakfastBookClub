import com.google.gson.Gson;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;
import utils.BCCORSFilter;

public class SparkServer
{

    public static void main(String[] args)
    {
        BCCORSFilter corsFilter = new BCCORSFilter();
        corsFilter.apply();

        Gson gson = new Gson();

        Spark.get("/api/search_books", new Route()
        {
            @Override
            public Object handle(Request request,
                                 Response response) throws Exception
            {
                return gson.toJson(null);
            }
        });

        Spark.get("/api/get_book", new Route()
        {
            @Override
            public Object handle(Request request,
                                 Response response) throws Exception
            {
                return gson.toJson(null);
            }
        });

        Spark.get("/api/search_users", new Route()
        {
            @Override
            public Object handle(Request request,
                                 Response response) throws Exception
            {
                return gson.toJson(null);
            }
        });

        Spark.get("/api/get_user", new Route()
        {
            @Override
            public Object handle(Request request,
                                 Response response) throws Exception
            {
                return gson.toJson(null);
            }
        });

        Spark.get("/api/list_friends", new Route()
        {
            @Override
            public Object handle(Request request,
                                 Response response) throws Exception
            {
                return gson.toJson(null);
            }
        });

        Spark.get("/api/list_friends_pending", new Route()
        {
            @Override
            public Object handle(Request request,
                                 Response response) throws Exception
            {
                return gson.toJson(null);
            }
        });

        Spark.put("/api/add_friend", new Route()
        {
            @Override
            public Object handle(Request request,
                                 Response response) throws Exception
            {
                return gson.toJson(null);
            }
        });

        Spark.put("/api/delete_friend", new Route()
        {
            @Override
            public Object handle(Request request,
                                 Response response) throws Exception
            {
                return gson.toJson(null);
            }
        });

        // Account CRUD operations

        Spark.post("/api/create_account", new Route()
        {
            @Override
            public Object handle(Request request,
                                 Response response) throws Exception
            {
                return gson.toJson(null);
            }
        });

        Spark.put("/api/edit_account", new Route()
        {
            @Override
            public Object handle(Request request,
                                 Response response) throws Exception
            {
                return gson.toJson(null);
            }
        });

        Spark.delete("/api/delete_account", new Route()
        {
            @Override
            public Object handle(Request request,
                                 Response response) throws Exception
            {
                return gson.toJson(null);
            }
        });

        Spark.post("/api/forgot_password", new Route()
        {
            @Override
            public Object handle(Request request,
                                 Response response) throws Exception
            {
                return gson.toJson(null);
            }
        });

        Spark.post("/api/login", new Route()
        {
            @Override
            public Object handle(Request request,
                                 Response response) throws Exception
            {
                return gson.toJson(null);
            }
        });

        Spark.delete("/api/logout", new Route()
        {
            @Override
            public Object handle(Request request,
                                 Response response) throws Exception
            {
                return gson.toJson(null);
            }
        });

        Spark.get("/api/key_valid", new Route()
        {
            @Override
            public Object handle(Request request,
                                 Response response) throws Exception
            {
                return gson.toJson(null);
            }
        });
    }

}
