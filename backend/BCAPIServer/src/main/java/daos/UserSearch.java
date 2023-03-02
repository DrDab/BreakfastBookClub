package daos;

import java.sql.*;
import java.util.*;

public class UserSearch {

    private Connection conn;

    private static final String SEARCH_USERS_BY_NAME_SQL =
            "SELECT user_id FROM user_profiles WHERE username = ?";
    private PreparedStatement searchUsersByNameStatement;

    public UserSearch(Connection conn) throws SQLException {
        this.conn = conn;
        prepareStatements();
    }

    public List<String> searchUsersByName(String username) {
        List<String> users = new ArrayList<>();
        try {
            searchUsersByNameStatement.clearParameters();
            searchUsersByNameStatement.setString(1, username);
            ResultSet rs = searchUsersByNameStatement.executeQuery();

            while (rs.next()) {
                users.add(rs.getString("user_id"));
            }
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return users;
    }

    // Prepare all SQL statements
    private void prepareStatements() throws SQLException {
        searchUsersByNameStatement = conn.prepareStatement(SEARCH_USERS_BY_NAME_SQL);
    }
}