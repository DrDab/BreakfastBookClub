package daos;

import java.sql.*;
import java.util.*;
import types.BookPost;


public class User {
    private Connection conn; // connection to MySQL database
    private String user; // Current user

    private static final String ADD_POST = 
        "INSERT INTO book_posts VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    private PreparedStatement addPostStatement;

    private static final String IS_FRIEND = 
        "SELECT COUNT(*) AS count FROM friends WHERE user_id_1 = ? AND user_id_2 = ?";
    private PreparedStatement isFriendStatement;

    private static final String ADD_FRIEND = 
        "INSERT INTO friends VALUES (?, ?), (?, ?)";
    private PreparedStatement addFriendStatement;

    private static final String UNFRIEND = 
        "DELETE FROM friends WHERE user_id_1 = ? AND user_id_2 = ?";
    private PreparedStatement unfriendStatement;

    private static final String IS_CLUB_MEMBER = 
        "SELECT COUNT(*) FROM user_clubs WHERE user_id = ? AND book_key = ?"; 
    private PreparedStatement isClubMemberStatement;

    private static final String ADD_USER_CLUB = 
        "INSERT INTO user_clubs VALUES (?, ?)";
    private PreparedStatement addUserClubStatement;

    private static final String LEAVE_USER_CLUB = 
        "DELETE FROM user_clubs WHERE user_id = ? AND book_key = ?";
    private PreparedStatement leaveUserClubStatement;

    private static final String IS_BOOK_SAVED = 
        "SELECT COUNT(*) FROM saved_books WHERE user_id = ? AND book_key = ?"; 
    private PreparedStatement isBookSavedStatement;

    private static final String ADD_SAVED_BOOK = 
        "INSERT INTO saved_books VALUES (?, ?)";
    private PreparedStatement addSavedBookStatement;

    private static final String UNSAVE_BOOK = 
        "DELETE FROM saved_books WHERE user_id = ? AND book_key = ?";
    private PreparedStatement unsaveBookStatement;

    private static final String GET_FRIENDS = 
        "SELECT user_id_2 FROM friends WHERE user_id_1 = ?";
    private PreparedStatement getFriendsStatement;

    private static final String GET_CLUB_POSTS = 
        "SELECT * FROM book_posts WHERE book_key IN " +
            "(SELECT book_key FROM user_clubs WHERE user_id = ?)";
    private PreparedStatement getClubPostsStatement;

    private static final String GET_ALL_USER_POSTS =
        "SELECT * FROM book_posts WHERE user_id = ?";
    private PreparedStatement getAllUserPostsStatement;

    /**
     * Creates a User class which allows user-specific interaction with the database.
     * This class assumes that user exists (has an account, logged in, etc).
     * @param user Current user that is logged in
     * @param conn Connection to the MySQL database
     * @throws SQLException if something goes wrong with the database
     */
    public User(String user, Connection conn) throws SQLException {
        this.user = user;
        this.conn = conn;
        prepareStatements();
    }

    /**
     * Creates a post for the user for the book. This method assumes that the book exists.
     * @param bookKey id of the book, not null or empty, at most 20 characters
     * @param postTitle title of the post, not null or empty, at most 100 characters
     * @param post text of the post being made, not null or empty, at most 1000 chacters
     * @param tag associated description, not null or empty, at most 20 charaters
     * @param postId unique post identifier, not null or empty, at most 50 characters
     * @param date when the post was made
     * @param likes number of likes on this post
     * @return "Post successful." if the post is made. Else:
     *         "bookKey cannot be empty." if bookKey is null or empty
     *         "post cannot be empty." if post is null or empty
     *         "postTitle cannot be empty." if postTitle is null or empty
     *         "postId cannot be empty." if postId is null or empty
     *         "tag cannot be empty." if tag is null or empty
     *         "bookKey cannot be more than 20 characters." if bookKey is too long
     *         "post cannot be more than 1000 characters." if post is too long
     *         "postTitle cannot be more than 100 characters." if postTitle is too long
     *         "postId cannot be more than 50 characters." if postId is too long
     *         "tag cannot be more than 20 characters." if tag is too long
     *         "Failed to post." if a SQLException is caught
     */
    public String bookPost(String bookKey, String postTitle, String post, String tag, String postId,
                            long date, long likes) {
        if (bookKey == null || bookKey.equals("")) {
            return "bookKey cannot be empty.";
        }

        if (post == null || post.equals("")) {
            return "post cannot be empty.";
        }

        if (postTitle == null || postTitle.equals("")) {
            return "postTitle cannot be empty.";
        }

        if (postId == null || postId.equals("")) {
            return "postId cannot be empty.";
        }

        if (tag == null || tag.equals("")) {
            return "tag cannot be empty.";
        }

        if (bookKey.length() > 20) {
            return "bookKey cannot be more than 20 characters.";
        }

        if (post.length() > 1000) {
            return "post cannot be more than 1000 characters.";
        } 

        if (postTitle.length() > 100) {
            return "post cannot be more than 100 characters.";
        } 

        if (postId.length() > 50) {
            return "post cannot be more than 50 characters.";
        } 

        if (tag.length() > 20) {
            return "tag cannot be more than 20 characters.";
        }

        try {
            addPostStatement.clearParameters();
            addPostStatement.setString(1, postId);
            addPostStatement.setString(2, this.user);
            addPostStatement.setString(3, bookKey);
            addPostStatement.setString(4, postTitle);
            addPostStatement.setString(5, post);
            addPostStatement.setString(6, tag);
            addPostStatement.setLong(7, date);
            addPostStatement.setLong(8, likes);
            addPostStatement.execute();

            return "Post successful.";
        } catch (SQLException e) {
            e.printStackTrace();
            return "Failed to post.";
        }
    }

    /**
     * Adds the other friend to this user's friend list and vice versa.
     * @param other the user to be added as a friend
     * @return "Friend added." if the friendship was made.
     *         "Friendship already exists." if the other user is already this user's friend.
     * @throws SQLException if something goes wrong with the database
     */
    public String addFriend(User other) throws SQLException {
        if (isFriend(other)) {
            return "Friendship already exists.";
        }

        addFriendStatement.clearParameters();
        addFriendStatement.setString(1, this.user);
        addFriendStatement.setString(2, other.user);
        addFriendStatement.setString(3, other.user);
        addFriendStatement.setString(4, this.user);
        addFriendStatement.execute();

        return "Friend added.";
    }

    /**
     * Unfriends this user from the other user and vice versa. 
     * @param other User tobe unfriended
     * @return "Unfriended." if the friendship was broken
     *         "Friendship does not exist." if the users were not friends from before
     * @throws SQLException if something goes wrong with the database
     */
    public String unfriend(User other) throws SQLException {
        if (!isFriend(other)) {
            return "Friendship does not exist.";
        }

        unfriendStatement.clearParameters();
        unfriendStatement.setString(1, this.user);
        unfriendStatement.setString(2, other.user);
        unfriendStatement.execute();

        unfriendStatement.clearParameters();
        unfriendStatement.setString(1, other.user);
        unfriendStatement.setString(2, this.user);
        unfriendStatement.execute();

        return "Unfriended.";
    } 

    /**
     * Adds the user to the club associated to the book. This method assumes that the book exists.
     * @param bookKey id of the book in the club, not null or empty, at most 20 characters
     * @return "User is added to this book club." if successfully added
     *         "bookKey cannot be empty." if bookKey is null or empty
     *         "bookKey cannot be more than 20 characters." if bookKey is too long
     *         "User is already a member of this book club." if membership already exist
     * @throws SQLException if something goes wrong with the database
     */
    public String joinClub(String bookKey) throws SQLException{
        if (bookKey == null || bookKey.equals("")) {
            return "bookKey cannot be empty.";
        }

        if (bookKey.length() > 20) {
            return "bookKey cannot be more than 20 characters.";
        }

        if (isClubMember(bookKey)) {
            return "User is already a member of this book club.";
        }

        addUserClubStatement.clearParameters();
        addUserClubStatement.setString(1, this.user);
        addUserClubStatement.setString(2, bookKey);
        addUserClubStatement.execute();

        return "User is added to this book club.";
    }

    /**
     * Remove the user from the club associated to the book. This method assumes that the book exists.
     * @param bookKey id of the book in the club, not null or empty, at most 20 characters
     * @return "User has left this book club." if successfully removed
     *         "bookKey cannot be empty." if bookKey is null or empty
     *         "bookKey cannot be more than 20 characters." if bookKey is too long
     *         "User is not a member of this book club." if membership does not exist
     * @throws SQLException if something goes wrong with the database
     */
    public String leaveClub(String bookKey) throws SQLException{
        if (bookKey == null || bookKey.equals("")) {
            return "bookKey cannot be empty.";
        }

        if (bookKey.length() > 20) {
            return "bookKey cannot be more than 20 characters.";
        }

        if (!isClubMember(bookKey)) {
            return "User is not a member of this book club.";
        }

        leaveUserClubStatement.clearParameters();
        leaveUserClubStatement.setString(1, this.user);
        leaveUserClubStatement.setString(2, bookKey);
        leaveUserClubStatement.execute();

        return "User has left this book club.";
    }

    /**
     * Adds the book to this user's saved books. This method assumes that the book exists.
     * @param bookKey id of the book to be saved, not null or empty, at most 20 characters
     * @return "Book saved." if the book is added to the user's saved books
     *         "bookKey cannot be empty." if bookKey is null or empty
     *         "bookKey cannot be more than 20 characters." if bookKey is too long
     *         "This book is already in the user's saved books." if book is saved from before
     * @throws SQLException if something goes wrong with the database
     */
    public String saveBook(String bookKey) throws SQLException{
        if (bookKey == null || bookKey.equals("")) {
            return "bookKey cannot be empty.";
        }

        if (bookKey.length() > 20) {
            return "bookKey cannot be more than 20 characters.";
        }

        if (isBookSaved(bookKey)) {
            return "This book is already in the user's saved books.";
        }

        addSavedBookStatement.clearParameters();
        addSavedBookStatement.setString(1, this.user);
        addSavedBookStatement.setString(2, bookKey);
        addSavedBookStatement.execute();

        return "Book saved.";
    }

    /**
     * Removes the book from this user's saved books. This method assumes that the book exists.
     * @param bookKey id of the book to be unsaved, not null or empty, at most 20 characters
     * @return "Book unsaved." if the book is removed from the user's saved books
     *         "bookKey cannot be empty." if bookKey is null or empty
     *         "bookKey cannot be more than 20 characters." if bookKey is too long
     *         "This book is not in the user's saved books." if book is not in user's saved books
     * @throws SQLException if something goes wrong with the database
     */
    public String unsaveBook(String bookKey) throws SQLException {
        if (bookKey == null || bookKey.equals("")) {
            return "bookKey cannot be empty.";
        }

        if (bookKey.length() > 20) {
            return "bookKey cannot be more than 20 characters.";
        }

        if (!isBookSaved(bookKey)) {
            return "This book is not in the user's saved books.";
        }

        unsaveBookStatement.clearParameters();
        unsaveBookStatement.setString(1, this.user);
        unsaveBookStatement.setString(2, bookKey);
        unsaveBookStatement.execute();

        return "Book unsaved.";
    }

    /**
     * This is used when this user recommends a book to the other user. This method assumes that
     * the book exists.
     * @param other the user to whom the book is recommended, not null/empty, at most 20 characters
     * @param bookKey id of the book being recommended
     * @return
     */
    public String reccommend(User other, String bookKey) {
        // TODO: implement user-to-user recommendation
        return null;
    }

    /**
     * Lists all the friends this user has.
     * @return list of this user's friends
     * @throws SQLException if something goes wrong with the database
     */
    public List<String> allFriends() throws SQLException {
        List<String> friends = new ArrayList<>();

        getFriendsStatement.clearParameters();
        getFriendsStatement.setString(1, this.user);
        
        ResultSet rs = getFriendsStatement.executeQuery();
        while (rs.next()) {
            friends.add(rs.getString("user_id_2"));
        }
        rs.close();

        return friends;
    }

    /**
     * Get all the posts from book clubs that this user is a member of.
     * @return List of all posts made to books that this user is a club member of.
     * @throws SQLException if something goes wrong with the database
     */
    public List<BookPost> getClubPosts() throws SQLException {
        List<BookPost> posts = new ArrayList<>();

        getClubPostsStatement.clearParameters();
        getClubPostsStatement.setString(1, this.user);

        ResultSet rs = getClubPostsStatement.executeQuery();
        while (rs.next()) {
            String userId = rs.getString("user_id");
            String bookKey = rs.getString("book_key");
            String postTitle = rs.getString("post_title");
            String post = rs.getString("post");
            String tag = rs.getString("tag");
            String postId = rs.getString("post_date");
            long date = rs.getLong("date");
            long likes = rs.getLong("likes");

            BookPost bp = new BookPost(userId, bookKey, postTitle, post, tag, postId, date, likes);
            posts.add(bp);
        }
        rs.close();

        return posts;
    }

    /**
     * Get all the posts this user has made.
     * @return List of this user's BookPosts
     * @throws SQLException if something goes wrong with the database
     */
    public List<BookPost> getUserPosts() throws SQLException {
        List<BookPost> posts = new ArrayList<>();

        getAllUserPostsStatement.clearParameters();
        getAllUserPostsStatement.setString(1, this.user);

        ResultSet rs = getAllUserPostsStatement.executeQuery();
        while (rs.next()) {
            String userId = rs.getString("user_id");
            String bookKey = rs.getString("book_key");
            String postTitle = rs.getString("post_title");
            String post = rs.getString("post");
            String tag = rs.getString("tag");
            String postId = rs.getString("post_id");
            long date = rs.getLong("post_date");
            long likes = rs.getLong("likes");

            BookPost bp = new BookPost(userId, bookKey, postTitle, post, tag, postId, date, likes);
            posts.add(bp);
        }
        rs.close();

        return posts;
    }

    // Returns true if this user is friends with the other user, otherwise returns false
    private boolean isFriend(User other) throws SQLException {
        isFriendStatement.clearParameters();
        isFriendStatement.setString(1, this.user);
        isFriendStatement.setString(2, other.user);

        ResultSet rs = isFriendStatement.executeQuery();
        rs.next();
        int count = rs.getInt("count");
        rs.close();

        return count == 1;
    }

    // Returns true if this user is a member of the club for the book.
    private boolean isClubMember(String bookKey) throws SQLException {
        isClubMemberStatement.clearParameters();
        isClubMemberStatement.setString(1, this.user);
        isClubMemberStatement.setString(2, bookKey);

        ResultSet rs = isClubMemberStatement.executeQuery();
        rs.next();
        int count = rs.getInt("count");
        rs.close();

        return count == 1;
    }

    // Returns true if the book is in this user's saved books
    private boolean isBookSaved(String bookKey) throws SQLException {
        isBookSavedStatement.clearParameters();
        isBookSavedStatement.setString(1, this.user);
        isBookSavedStatement.setString(2, bookKey);

        ResultSet rs = isBookSavedStatement.executeQuery();
        rs.next();
        int count = rs.getInt("count");
        rs.close();

        return count == 1;
    }

    private void prepareStatements() throws SQLException {
        addPostStatement = conn.prepareStatement(ADD_POST);
        
        isFriendStatement = conn.prepareStatement(IS_FRIEND);
        addFriendStatement = conn.prepareStatement(ADD_FRIEND);

        unfriendStatement = conn.prepareStatement(UNFRIEND);

        isClubMemberStatement = conn.prepareStatement(IS_CLUB_MEMBER);
        addUserClubStatement = conn.prepareStatement(ADD_USER_CLUB);

        leaveUserClubStatement = conn.prepareStatement(LEAVE_USER_CLUB);

        isBookSavedStatement = conn.prepareStatement(IS_BOOK_SAVED);
        addSavedBookStatement = conn.prepareStatement(ADD_SAVED_BOOK);

        unsaveBookStatement = conn.prepareStatement(UNSAVE_BOOK);

        getFriendsStatement = conn.prepareStatement(GET_FRIENDS);

        getClubPostsStatement = conn.prepareStatement(GET_CLUB_POSTS);

        getAllUserPostsStatement = conn.prepareStatement(GET_ALL_USER_POSTS);
    }
}