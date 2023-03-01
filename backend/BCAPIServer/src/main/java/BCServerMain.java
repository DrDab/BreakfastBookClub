import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import daos.User;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import net.sourceforge.argparse4j.ArgumentParsers;
import net.sourceforge.argparse4j.inf.ArgumentParser;
import net.sourceforge.argparse4j.inf.ArgumentParserException;
import net.sourceforge.argparse4j.inf.Namespace;

import routes.bookclubs.*;

import routes.bookmgmt.GetBook;
import routes.bookmgmt.GetSaveBooks;
import routes.bookmgmt.SaveBook;
import routes.bookmgmt.UnsaveBook;
import routes.profile.GetUserProfile;
import routes.profile.SetUserProfile;
import spark.Spark;
import utils.BCCORSFilter;

public class BCServerMain {

  public static void main(String[] args) {
    ArgumentParser parser = ArgumentParsers.newFor("BCServer").build()
        .defaultHelp(true);

    parser.addArgument("--mysql_addr").setDefault("localhost")
        .help("Specify IP address of MySQL Server");

    parser.addArgument("--svc_acct").help("The service account file to use.");

    parser.addArgument("--mysql_username").setDefault("bcapiserver")
        .help("The username on the MySQL server to use.");

    parser.addArgument("--mysql_password").setDefault("bcapiserver")
        .help("The password on the MySQL server to use.");

    Namespace ns = null;
    try {
      ns = parser.parseArgs(args);
    } catch (ArgumentParserException e) {
      parser.handleError(e);
      System.exit(1);
    }

    Connection sqlConn = null;
    FirebaseApp fbApp = null;

    try {
      sqlConn = initSQLConnection(ns.getString("mysql_addr"),
          ns.getString("mysql_username"), ns.getString("mysql_password"));
      fbApp = initFirebase(ns.getString("svc_acct"));
    } catch (ClassNotFoundException | SQLException | IOException e) {
      e.printStackTrace();
      System.exit(1);
    }

    BCCORSFilter corsFilter = new BCCORSFilter();
    corsFilter.apply();

    Spark.post("/api/make_post", new MakePost(fbApp, sqlConn));

    Spark.get("/api/get_book", new GetBook());

    GetPosts getPosts = new GetPosts(fbApp, sqlConn);
    Spark.get("/api/get_posts", getPosts);
    Spark.get("/api/list_feed", getPosts);

    // getting user's recommendations
    Spark.get("/api/get_recommendations", new GetRecommendations(sqlConn));
    // user1 sends book recommendation to user2
    Spark.post("/api/recommend_book", new RecommendBook(fbApp, sqlConn));
    // user saves book
    Spark.post("/api/save_book", new SaveBook(fbApp, sqlConn));


    Spark.post("/api/like_post", new LikePost(fbApp, sqlConn));
    Spark.post("/api/unlike_post", new UnlikePost(fbApp, sqlConn));
    Spark.get("/api/get_liked_posts", new GetLikedPosts(fbApp, sqlConn));
    Spark.get("/api/get_is_user_liked_posts", new GetIsUserLikedPost(fbApp, sqlConn));

    Spark.get("/api/get_user", new GetUserProfile(fbApp, sqlConn));
    Spark.post("/api/update_user", new SetUserProfile(fbApp, sqlConn));

    Spark.get("/api/get_members", new GetMembers(fbApp, sqlConn));

    // get saved books
    Spark.get("/api/get_saved_books", new GetSaveBooks(sqlConn));

    // delete saved book
    Spark.post("/api/unsave_book", new UnsaveBook(fbApp, sqlConn));
  }

  @SuppressWarnings("deprecation")
  public static FirebaseApp initFirebase(String credsFile) throws IOException {
    FirebaseOptions options = new FirebaseOptions.Builder()
        .setCredentials(credsFile == null ? GoogleCredentials.getApplicationDefault() :
            GoogleCredentials.fromStream(new FileInputStream(credsFile)))
        .build();

    return FirebaseApp.initializeApp(options);
  }

  public static Connection initSQLConnection(String hostAddr, String username, String password)
      throws ClassNotFoundException, SQLException {
    Class.forName("com.mysql.cj.jdbc.Driver");

    return DriverManager.getConnection(String.format("jdbc:mysql://%s" +
            "/breakfast_book_club?useUnicode=true&useJDBCCompliantTimezoneShift=true" +
            "&useLegacyDatetimeCode=false&serverTimezone=UTC", hostAddr),
        username, password);
  }
}
