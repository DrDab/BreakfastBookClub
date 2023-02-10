package daos;

import java.sql.*;
import java.util.*;
import daos.BookPost;

public class Books {

    private Connection conn;

    private static final String USERS_IN_BOOK_CLUB_SQL =
            "SELECT U.user_id AS user_id FROM user_clubs AS U WHERE U.book_key = ?";
    private PreparedStatement usersInBookClubStatement;

    private static final String POSTS_IN_BOOK_CLUB_SQL =
            "SELECT * FROM book_posts AS B WHERE B.book_key = ?";
    private PreparedStatement postsInBookClubStatement;

    public Books(Connection conn) throws SQLException {
        this.conn = conn;
        prepareStatements();
    }

    /**
     * Gets the list all the users in the book club for bookKey.
     * @param bookKey is not null or empty, is at most 20 characters
     * @return list of userIds that are in the bookKey book club
     */
    public List<String> bookClubUsers(String bookKey) {
        if (bookKey == null || bookKey.equals("")) {
            return "bookKey cannot be empty.";
        }

        if (bookKey.length() > 20) {
            return "bookKey cannot be more than 20 characters.";
        }

        List<String> users = new ArrayList<>();
        try {
            usersInBookClubStatement.clearParameters();
            usersInBookClubStatement.setString(1, bookKey);
            ResultSet rs = usersInBookClubStatement.executeQuery();

            while (rs.next()) {
                users.add(rs.getString("user_id"));
            }
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return users;
    }

    /**
     * Gets the list all the books posts in the book club for bookKey.
     * @param bookKey is not null or empty, is at most 20 characters
     * @return list of book posts that are in the bookKey book club
     */
    public List<BookPost> listBookPosts(String bookKey) throws SQLException {
        if (bookKey == null || bookKey.equals("")) {
            return "bookKey cannot be empty.";
        }

        if (bookKey.length() > 20) {
            return "bookKey cannot be more than 20 characters.";
        }

        List<BookPost> posts = new ArrayList<>();
        try {
            postsInBookClubStatement.clearParameters();
            postsInBookClubStatement.setString(1, bookKey);
            ResultSet rs = postsInBookClubStatement.executeQuery();

            while (rs.next()) {
                String userId = rs.getString("user_id");
                String bookKey = rs.getString("book_key");
                String postTitle = rs.getString("post_title");
                String post = rs.getString("post");
                String tag = rs.getString("tag");
                String postId = rs.getString("post_id");
                long date = rs.getLong("date");
                long likes = rs.getLong("likes");

                BookPost bp = new BookPost(userId, bookKey, postTitle, post, tag, postId, date, likes);
                posts.add(bp);
            }
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return posts;
    }

    // Prepare all SQL statements
    private void prepareStatements() throws SQLException {
        usersInBookClubStatement = conn.prepareStatement(USERS_IN_BOOK_CLUB_SQL);
        postsInBookClubStatement = conn.prepareStatement(POSTS_IN_BOOK_CLUB_SQL);
    }
}