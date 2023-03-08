package utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class SqlInitUtil {

  private String username;
  private String password;
  private String connStr;
  private Connection connection;
  private long lastTimeUsed;

  public SqlInitUtil(String hostAddr, String username, String password)
      throws ClassNotFoundException {
    this.username = username;
    this.password = password;
    Class.forName("com.mysql.cj.jdbc.Driver");
    connStr = String.format("jdbc:mysql://%s" +
            "/breakfast_book_club?useUnicode=true&useJDBCCompliantTimezoneShift=true" +
            "&useLegacyDatetimeCode=false&serverTimezone=UTC", hostAddr);
  }

  public Connection getSQLConnection()
      throws SQLException {
    if (connection == null || !connection.isValid(1)) {
      connection = DriverManager.getConnection(connStr, username, password);
    }
    return connection;
  }
}
