package daos;

import java.sql.*;
import java.util.*;
import types.BookPost;
import types.Recommendation;
import utils.ResultSetParsers;

public class Books {

    private Connection conn;

    private static final String USERS_IN_BOOK_CLUB_SQL =
            "SELECT user_id FROM user_clubs WHERE book_key = ?";
    private PreparedStatement usersInBookClubStatement;

    private static final String POSTS_IN_BOOK_CLUB_SQL =
            "SELECT * FROM book_posts WHERE book_key = ?";
    private PreparedStatement postsInBookClubStatement;

    private static final String ALL_POSTS_SQL =
        "SELECT * FROM book_posts";
    private PreparedStatement allPostsStatement;

    private static final String GET_RECOMMENDATIONS_SQL =
            "SELECT sender_username, book_key FROM sent_recommendations WHERE recipient_username = ?";
    private PreparedStatement getRecommendationsStatement;

    private static final String ADD_SAVED_BOOK_SQL =
            "INSERT INTO saved_books VALUES (?, ?)";

    private PreparedStatement addSavedBookStatement;

    private static final String GET_SAVED_BOOKS_SQL =
            "SELECT book_key FROM saved_books WHERE user_id = ?";
    private PreparedStatement getSavedBooksStatement;

    private static final String UNSAVE_BOOK_SQL =
            "DELETE FROM saved_books WHERE user_id = ? AND book_key = ?";
    private PreparedStatement unsaveBookStatement;

    public Books(Connection conn) throws SQLException {
        this.conn = conn;
        prepareStatements();
    }

    /**
     *
     * @param user user ID that is saving book
     * @param bookKey key of book that is being saved
     * @return UserResult.SUCCESS if the book is recommended to the other user. UserResult.INVALID if
     *    * the input is invalid. UserResult.FAIL if there is a database error.
     */
    public UserResult saveBook(String user, String bookKey) {
        if ( bookKey == null || bookKey.equals("") || bookKey.length() > 20) {
            return UserResult.INVALID;
        }
        try {
            addSavedBookStatement.clearParameters();
            addSavedBookStatement.setString(1, user);
            addSavedBookStatement.setString(2, bookKey);
            addSavedBookStatement.execute();

        } catch (SQLException e) {
            e.printStackTrace();
            return UserResult.FAIL;
        }
        return UserResult.SUCCESS;

    }

    /**
     * Deletes a saved book from the user's saved books.
     * @param username user ID of the username to delete a book
     * @param bookKey key of a book to be deleted
     * @return UserResult.SUCCESS if the book is successfully deleted. UserResult.FAIL if there is a database error.
     */
    public UserResult unsaveBook (String username, String bookKey) {
        try {
            unsaveBookStatement.clearParameters();
            unsaveBookStatement.setString(1, username);
            unsaveBookStatement.setString(2, bookKey);
            unsaveBookStatement.execute();
        } catch (SQLException e) {
            e.printStackTrace();
            return UserResult.FAIL;
        }
        return UserResult.SUCCESS;
    }

    /**
     * Gets the list all the users in the book club for bookKey.
     * @param bookKey is the ID for the book club's book
     * @return list of userIds that are in the bookKey book club
     */
    public List<String> bookClubUsers(String bookKey) {
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
     * gets a list of recommendations for a specific user
     * @param recipientUsername the user whose recommendations we want to get
     * @return a list of recommendations, with the sender's userID and the book that the sender has sent
     */

    public List<Recommendation> bookRecommendations(String recipientUsername) {
        List<Recommendation> bookRecs = new ArrayList<>();
        try {
            getRecommendationsStatement.clearParameters();
            getRecommendationsStatement.setString(1, recipientUsername);
            ResultSet result = getRecommendationsStatement.executeQuery();
            while (result.next()) {
                Recommendation rec = new Recommendation(result.getString("sender_username"),
                        result.getString("book_key"));
                bookRecs.add(rec);
            }
            result.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return bookRecs;
    }

    public List<String> getSavedBooks(String userID) {
        List<String> bookIDs = new ArrayList<>();
        try {
            getSavedBooksStatement.clearParameters();
            getSavedBooksStatement.setString(1, userID);
            ResultSet result = getSavedBooksStatement.executeQuery();
            while (result.next()) {
                bookIDs.add(result.getString("book_key"));
            }
            result.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return bookIDs;
    }

    /**
     * Gets the list all the books posts in the book club for the book with ID bookKey.
     * @param bookKey is the ID for the book club's book
     * @return list of book posts that are in the bookKey book club
     */
    public List<BookPost> listBookPosts(String bookKey) {
        try {
            postsInBookClubStatement.clearParameters();
            postsInBookClubStatement.setString(1, bookKey);
            ResultSet rs = postsInBookClubStatement.executeQuery();
            return ResultSetParsers.getBookPostsFromResultSet(rs);
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return new ArrayList<>();
    }

    // Prepare all SQL statements
    private void prepareStatements() throws SQLException {
        usersInBookClubStatement = conn.prepareStatement(USERS_IN_BOOK_CLUB_SQL);
        postsInBookClubStatement = conn.prepareStatement(POSTS_IN_BOOK_CLUB_SQL);
        allPostsStatement = conn.prepareStatement(ALL_POSTS_SQL);
        getRecommendationsStatement = conn.prepareStatement(GET_RECOMMENDATIONS_SQL);
        addSavedBookStatement = conn.prepareStatement(ADD_SAVED_BOOK_SQL);
        getSavedBooksStatement = conn.prepareStatement(GET_SAVED_BOOKS_SQL);
        unsaveBookStatement = conn.prepareStatement(UNSAVE_BOOK_SQL);
    }

    // Returns whether the error was caused by a deadlock
    private static boolean isDeadlock(SQLException e) {
        return e.getErrorCode() == 1205;
    }
}