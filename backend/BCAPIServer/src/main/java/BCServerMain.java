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

import routes.bookclubs.GetPosts;
import routes.bookclubs.LikePost;
import routes.bookclubs.MakePost;
import spark.Spark;
import utils.BCCORSFilter;

public class BCServerMain {

  public static void main(String[] args) {
    ArgumentParser parser = ArgumentParsers.newFor("BCServer").build()
        .defaultHelp(true);

    parser.addArgument("--mysql_addr").setDefault("localhost")
        .help("Specify IP address of MySQL Server");

    parser.addArgument("--svc_acct").help("The service account file to use.");

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
          "bcapiserver", "bcapiserver");
      fbApp = initFirebase(ns.getString("svc_acct"));
    } catch (ClassNotFoundException | SQLException | IOException e) {
      e.printStackTrace();
      System.exit(1);
    }

    BCCORSFilter corsFilter = new BCCORSFilter();
    corsFilter.apply();

    Spark.post("/api/make_post", new MakePost(fbApp, sqlConn));

    GetPosts getPosts = new GetPosts(fbApp, sqlConn);
    Spark.get("/api/get_posts", getPosts);
    Spark.get("/api/list_feed", getPosts);

    Spark.get("/api/like_post", new LikePost(fbApp, sqlConn));
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
