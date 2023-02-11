import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import net.sourceforge.argparse4j.ArgumentParsers;
import net.sourceforge.argparse4j.inf.ArgumentParser;
import net.sourceforge.argparse4j.inf.ArgumentParserException;
import net.sourceforge.argparse4j.inf.Namespace;

import utils.BCCORSFilter;

public class BCServerMain {

  public static void main(String[] args) {
    ArgumentParser parser = ArgumentParsers.newFor("BCServer").build()
        .defaultHelp(true);

    parser.addArgument("--mysql_addr").setDefault("localhost")
        .help("Specify IP address of MySQL Server");

    Namespace ns = null;
    try {
      ns = parser.parseArgs(args);
    } catch (ArgumentParserException e) {
      parser.handleError(e);
      System.exit(1);
    }



  }

  public static void initFirebase() throws IOException {
    FileInputStream serviceAccount =
        new FileInputStream("serviceAccountKey.json");

    FirebaseOptions options = new FirebaseOptions.Builder()
        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
        .build();

    FirebaseApp.initializeApp(options);
  }

  public static Connection initSQLConnection(String hostAddr, String username, String password)
      throws ClassNotFoundException, SQLException {
    Class.forName("com.mysql.cj.jdbc.Driver");

    return DriverManager.getConnection(String.format("jdbc:mysql://%s" +
            "/breakfast_book_club?useUnicode=true&useJDBCCompliantTimezoneShift=true" +
            "&useLegacyDatetimeCode=false&serverTimezone=UTC", hostAddr),
        username, password);
  }

  public static void startServer() {
    BCCORSFilter corsFilter = new BCCORSFilter();
    corsFilter.apply();

    // Spark.get(...)
  }
}
