import com.google.gson.Gson;
import daos.Account;
import routes.accauth.AuthTokenValidRoute;
import routes.accauth.LoginRoute;
import routes.accauth.LogoutRoute;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;
import utils.BCCORSFilter;
import utils.TokenStore;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class SparkServerMain
{

    public static void main(String[] args) throws SQLException, ClassNotFoundException {
        BCCORSFilter corsFilter = new BCCORSFilter();
        corsFilter.apply();

        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection sqlConnection = null;

        try {
            sqlConnection = DriverManager.getConnection("jdbc:mysql://localhost" +
                            "/breakfast_book_club?useUnicode=true&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=UTC",
                    "bcapiserver", "bcapiserver");
        } catch (SQLException sqlException) {
            sqlException.printStackTrace();
        }

        if (sqlConnection == null) {
            System.err.println("SQL Connection not initialized! Exiting!");
            System.exit(1);
        }

        Account account = new Account(sqlConnection);
        TokenStore tokenStore = new TokenStore();

        //String res = account.createUser("MyUsername", "MyPassword");
        //String res = account.login("MyUsername", "MyPassword");
        //System.out.println(res);

        Spark.post("/api/login", new LoginRoute(account, tokenStore));
        Spark.delete("/api/logout", new LogoutRoute(tokenStore));
        Spark.get("/api/auth_token_valid", new AuthTokenValidRoute(tokenStore));

        /*
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
         */
    }

}