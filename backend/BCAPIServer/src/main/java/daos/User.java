package daos;

import java.sql.*;
import java.util.*;
import types.BookPost;
import types.UserProfile;
import utils.ResultSetParsers;

public class User {

  private Connection conn; // connection to MySQL database
  private String user; // Current user

  private static final String GET_PROFILE =
      "SELECT * FROM user_profiles WHERE user_id = ?";
  private PreparedStatement getProfileStatement;

  private static final String UPDATE_PROFILE_STUB =
      "UPDATE user_profiles SET ";

  private static final String CREATE_PROFILE =
      "INSERT INTO user_profiles(user_id) VALUES(?)";
  private PreparedStatement createProfileStatement;

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
      "SELECT COUNT(*) AS count FROM user_clubs WHERE user_id = ? AND book_key = ?";
  private PreparedStatement isClubMemberStatement;

  private static final String ADD_USER_CLUB =
      "INSERT INTO user_clubs VALUES (?, ?)";
  private PreparedStatement addUserClubStatement;

  private static final String LEAVE_USER_CLUB =
      "DELETE FROM user_clubs WHERE user_id = ? AND book_key = ?";
  private PreparedStatement leaveUserClubStatement;

  private static final String IS_BOOK_SAVED =
      "SELECT COUNT(*) AS count FROM saved_books WHERE user_id = ? AND book_key = ?";
  private PreparedStatement isBookSavedStatement;

  private static final String ADD_SAVED_BOOK =
      "INSERT INTO saved_books VALUES (?, ?)";
  private PreparedStatement addSavedBookStatement;

  private static final String UNSAVE_BOOK =
      "DELETE FROM saved_books WHERE user_id = ? AND book_key = ?";
  private PreparedStatement unsaveBookStatement;

  private static final String RECOMMEND =
      "INSERT INTO sent_recommendations VALUES (?, ?, ?)";
  private PreparedStatement recommendStatement;

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

  private static final String LIKE_POST =
      "INSERT INTO liked_posts(user_id, post_id) VALUES(?, ?)";
  private PreparedStatement likePostStatement;

  private static final String UNLIKE_POST =
      "DELETE FROM liked_posts WHERE user_id = ? AND post_id = ?";
  private PreparedStatement unlikePostStatement;

  private static final String GET_LIKED_POSTS =
      "SELECT * FROM liked_posts WHERE user_id = ?";
  private PreparedStatement getLikedPostsStatement;

  private static final String COUNT_LIKED_POSTS_BY_PID =
      "SELECT COUNT(*) AS count FROM liked_posts WHERE post_id = ? AND user_id = ?";
  private PreparedStatement countLikedPostsByPidStatement;

  private static final String GET_POSTS_BY_ID_STUB =
      "SELECT * FROM book_posts WHERE ";

  /**
   * Creates a User class which allows user-specific interaction with the database. This class
   * assumes that user exists (has an account, logged in, etc).
   *
   * @param user Current user that is logged in
   * @param conn Connection to the MySQL database
   * @throws SQLException if something goes wrong with the database
   */
  public User(String user, Connection conn) throws SQLException {
    this.user = user;
    this.conn = conn;
    prepareStatements();
  }

  public boolean userProfileExists() throws SQLException {
    return getUserProfile(null) != null;
  }

  public UserResult createUserProfile() throws SQLException {
    createProfileStatement.clearParameters();
    createProfileStatement.setString(1, user);
    return createProfileStatement.executeUpdate() == 1 ? UserResult.SUCCESS : UserResult.FAIL;
  }

  public UserProfile getUserProfile(String username)
      throws SQLException {
    getProfileStatement.clearParameters();
    getProfileStatement.setString(1, user);

    UserProfile userProfile = null;

    ResultSet rs = getProfileStatement.executeQuery();
    if (rs.next()) {
      String userId = user;
      String bio = rs.getString("bio");
      String thumbnail = rs.getString("thumbnail");
      userProfile = new UserProfile(userId, username, bio, thumbnail);
    }
    rs.close();

    return userProfile;
  }

  public UserResult updateUserProfile(String username, String bio, String thumbnail)
      throws SQLException {
    if (username == null && bio == null && thumbnail == null) {
      return UserResult.INVALID;
    }

    List<String> vals = new ArrayList<>();
    StringBuilder sqlQuery = new StringBuilder(UPDATE_PROFILE_STUB);

    if (username != null) {
      if (username.length() <= 50) {
        sqlQuery.append("username = ?");
        vals.add(username);
      } else {
        return UserResult.INVALID;
      }
    }

    if (bio != null) {
      if (bio.length() <= 750) {
        if (!vals.isEmpty()) {
          sqlQuery.append(", ");
        }
        sqlQuery.append("bio = ?");
        vals.add(bio);
      } else {
        return UserResult.INVALID;
      }
    }

    if (thumbnail != null) {
      if (thumbnail.length() <= 100) {
        if (!vals.isEmpty()) {
          sqlQuery.append(", ");
        }
        sqlQuery.append("thumbnail = ?");
        vals.add(thumbnail);
      } else {
        return UserResult.INVALID;
      }
    }

    sqlQuery.append(" WHERE user_id = ?");

    try {
      PreparedStatement ps = conn.prepareStatement(sqlQuery.toString());
      for (int i = 0; i < vals.size(); i++) {
        ps.setString(i + 1, vals.get(i));
      }
      ps.setString(vals.size() + 1, user);
      return ps.executeUpdate() == 1 ? UserResult.SUCCESS : UserResult.FAIL;
    } catch (SQLException e) {
      e.printStackTrace();
      return UserResult.FAIL;
    }
  }

  /**
   * Creates a post for the user for the book. This method assumes that the book exists.
   *
   * @param bookKey   id of the book, not null or empty, at most 20 characters
   * @param postTitle title of the post, not null or empty, at most 100 characters
   * @param post      text of the post being made, not null or empty, at most 1000 chacters
   * @param tag       associated description, not null or empty, at most 20 charaters
   * @param postId    unique post identifier, not null or empty, at most 50 characters
   * @param date      when the post was made
   * @param likes     number of likes on this post
   * @return UserResult.SUCCESS if the query is successfully executed UserResult.FAIL if there is a
   * database error UserResult.INVALID if the input is invalid
   */
  public UserResult bookPost(String bookKey, String postTitle, String post, String tag,
      String postId,
      long date, long likes) {
    if (bookKey == null || bookKey.equals("")) {
      return UserResult.INVALID;
    }

    if (post == null || post.equals("")) {
      return UserResult.INVALID;
    }

    if (postTitle == null || postTitle.equals("")) {
      return UserResult.INVALID;
    }

    if (postId == null || postId.equals("")) {
      return UserResult.INVALID;
    }

    if (bookKey.length() > 20) {
      return UserResult.INVALID;
    }

    if (post.length() > 1000) {
      return UserResult.INVALID;
    }

    if (postTitle.length() > 100) {
      return UserResult.INVALID;
    }

    if (postId.length() > 50) {
      return UserResult.INVALID;
    }

    if (tag.length() > 20) {
      return UserResult.INVALID;
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

      return UserResult.SUCCESS;
    } catch (SQLException e) {
      e.printStackTrace();
      return UserResult.FAIL;
    }
  }

  /**
   * Adds the other friend to this user's friend list and vice versa.
   *
   * @param other the user to be added as a friend
   * @return UserResult.SUCCESS if friendship is made UserResult.IMPOSSIBLE if friendship already
   * exists. UserResult.FAIL if there is a database error.
   * @throws SQLException if something goes wrong with the database
   */
  public UserResult addFriend(User other) throws SQLException {
    if (isFriend(other)) {
      return UserResult.IMPOSSIBLE;
    }

    try {
      addFriendStatement.clearParameters();
      addFriendStatement.setString(1, this.user);
      addFriendStatement.setString(2, other.user);
      addFriendStatement.setString(3, other.user);
      addFriendStatement.setString(4, this.user);
      addFriendStatement.execute();
    } catch (SQLException e) {
      e.printStackTrace();
      return UserResult.FAIL;
    }

    return UserResult.SUCCESS;
  }

  /**
   * Unfriends this user from the other user and vice versa.
   *
   * @param other User tobe unfriended
   * @return UserResult.SUCCESS if friendship is broken. UserResult.INVALID if friendship didn't
   * exist. UserResult.FAIL if there is a database error.
   * @throws SQLException if something goes wrong with the database
   */
  public UserResult unfriend(User other) throws SQLException {
    if (!isFriend(other)) {
      return UserResult.IMPOSSIBLE;
    }

    try {
      unfriendStatement.clearParameters();
      unfriendStatement.setString(1, this.user);
      unfriendStatement.setString(2, other.user);
      unfriendStatement.execute();

      unfriendStatement.clearParameters();
      unfriendStatement.setString(1, other.user);
      unfriendStatement.setString(2, this.user);
      unfriendStatement.execute();
    } catch (SQLException e) {
      e.printStackTrace();
      return UserResult.FAIL;
    }

    return UserResult.SUCCESS;
  }

  /**
   * Adds the user to the club associated to the book. This method assumes that the book exists.
   *
   * @param bookKey id of the book in the club, not null or empty, at most 20 characters
   * @return UserResult.SUCCESS if the user joins the book club. UserResult.INVALID if the input is
   * invalid. UserResult.IMPOSSIBLE if the user was already in the book club. UserResult.FAIL if
   * there is a database error.
   * @throws SQLException if something goes wrong with the database
   */
  public UserResult joinClub(String bookKey) throws SQLException {
    if (bookKey == null || bookKey.equals("")) {
      return UserResult.INVALID;
    }

    if (bookKey.length() > 20) {
      return UserResult.INVALID;
    }

    if (isClubMember(bookKey)) {
      return UserResult.IMPOSSIBLE;
    }

    try {
      addUserClubStatement.clearParameters();
      addUserClubStatement.setString(1, this.user);
      addUserClubStatement.setString(2, bookKey);
      addUserClubStatement.execute();
    } catch (SQLException e) {
      e.printStackTrace();
      return UserResult.FAIL;
    }

    return UserResult.SUCCESS;
  }

  /**
   * Remove the user from the club associated to the book. This method assumes that the book
   * exists.
   *
   * @param bookKey id of the book in the club, not null or empty, at most 20 characters
   * @return UserResult.SUCCESS if the user leaves the book club. UserResult.INVALID if the input is
   * invalid. UserResult.IMPOSSIBLE if the user was not in the book club. UserResult.FAIL if there
   * is a database error.
   * @throws SQLException if something goes wrong with the database
   */
  public UserResult leaveClub(String bookKey) throws SQLException {
    if (bookKey == null || bookKey.equals("")) {
      return UserResult.INVALID;
    }

    if (bookKey.length() > 20) {
      return UserResult.INVALID;
    }

    if (!isClubMember(bookKey)) {
      return UserResult.IMPOSSIBLE;
    }

    try {
      leaveUserClubStatement.clearParameters();
      leaveUserClubStatement.setString(1, this.user);
      leaveUserClubStatement.setString(2, bookKey);
      leaveUserClubStatement.execute();
    } catch (SQLException e) {
      e.printStackTrace();
      return UserResult.FAIL;
    }

    return UserResult.SUCCESS;
  }

  /**
   * Adds the book to this user's saved books. This method assumes that the book exists.
   *
   * @param bookKey id of the book to be saved, not null or empty, at most 20 characters
   * @return UserResult.SUCCESS if the book is saved. UserResult.INVALID if the input is invalid.
   * UserResult.FAIL if there is a database error. UserResult.IMPOSSIBLE if the book is already
   * saved.
   * @throws SQLException if something goes wrong with the database
   */
  public UserResult saveBook(String bookKey) throws SQLException {
    if (bookKey == null || bookKey.equals("")) {
      return UserResult.INVALID;
    }

    if (bookKey.length() > 20) {
      return UserResult.INVALID;
    }

    if (isBookSaved(bookKey)) {
      return UserResult.IMPOSSIBLE;
    }

    try {
      addSavedBookStatement.clearParameters();
      addSavedBookStatement.setString(1, this.user);
      addSavedBookStatement.setString(2, bookKey);
      addSavedBookStatement.execute();
    } catch (SQLException e) {
      e.printStackTrace();
      return UserResult.FAIL;
    }

    return UserResult.SUCCESS;
  }

  /**
   * Removes the book from this user's saved books. This method assumes that the book exists.
   *
   * @param bookKey id of the book to be unsaved, not null or empty, at most 20 characters
   * @return UserResult.SUCCESS if the book is removed from saved books. UserResult.INVALID if the
   * input is invalid. UserResult.IMPOSSIBLE if the book is not saved. UserResult.FAIL if there is a
   * database error.
   * @throws SQLException if something goes wrong with the database
   */
  public UserResult unsaveBook(String bookKey) throws SQLException {
    if (bookKey == null || bookKey.equals("")) {
      return UserResult.INVALID;
    }

    if (bookKey.length() > 20) {
      return UserResult.INVALID;
    }

    if (!isBookSaved(bookKey)) {
      return UserResult.IMPOSSIBLE;
    }

    try {
      unsaveBookStatement.clearParameters();
      unsaveBookStatement.setString(1, this.user);
      unsaveBookStatement.setString(2, bookKey);
      unsaveBookStatement.execute();
    } catch (SQLException e) {
      e.printStackTrace();
      return UserResult.FAIL;
    }

    return UserResult.SUCCESS;
  }

  /**
   * This is used when this user recommends a book to the other user. This method assumes that the
   * book exists.
   *
   * @param other   the user to whom the book is recommended, not null/empty, at most 20 characters
   * @param bookKey id of the book being recommended
   * @return UserResult.SUCCESS if the book is recommended to the other user. UserResult.INVALID if
   * the input is invalid. UserResult.FAIL if there is a database error.
   * @throws SQLException if something goes wrong with the database
   */
  public UserResult recommend(User other, String bookKey) throws SQLException {
    if (bookKey == null || bookKey.equals("") || bookKey.length() > 20) {
      return UserResult.INVALID;
    }

    try {
      recommendStatement.clearParameters();
      recommendStatement.setString(1, this.user);
      recommendStatement.setString(2, other.user);
      recommendStatement.setString(3, bookKey);
      recommendStatement.execute();
    } catch (SQLException e) {
      e.printStackTrace();
      return UserResult.FAIL;
    }

    return UserResult.SUCCESS;
  }

  /**
   * Lists all the friends this user has.
   *
   * @return list of this user's friends.
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
   *
   * @return List of all posts made to books that this user is a club member of.
   * @throws SQLException if something goes wrong with the database
   */
  public List<BookPost> getClubPosts() throws SQLException {
    getClubPostsStatement.clearParameters();
    getClubPostsStatement.setString(1, this.user);

    ResultSet rs = getClubPostsStatement.executeQuery();
    return ResultSetParsers.getBookPostsFromResultSet(rs);
  }

  /**
   * Get all the posts this user has made.
   *
   * @return List of this user's BookPosts.
   * @throws SQLException if something goes wrong with the database
   */
  public List<BookPost> getUserPosts() throws SQLException {
    getAllUserPostsStatement.clearParameters();
    getAllUserPostsStatement.setString(1, this.user);

    ResultSet rs = getAllUserPostsStatement.executeQuery();
    return ResultSetParsers.getBookPostsFromResultSet(rs);
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

  public int getNumLikesFromUser(String post_id) throws SQLException {
    countLikedPostsByPidStatement.clearParameters();
    countLikedPostsByPidStatement.setString(1, post_id);
    countLikedPostsByPidStatement.setString(2, user);
    ResultSet rs = countLikedPostsByPidStatement.executeQuery();
    rs.next();
    int count = rs.getInt("count");
    rs.close();
    return count;
  }

  public UserResult likePost(String post_id) throws SQLException {
    Posts posts = new Posts(conn);
    // If post_id is null or no such post exists, input is INVALID.
    if (post_id == null || posts.getPostByID(post_id) == null) {
      return UserResult.INVALID;
    }

    if (posts.getPostByID(post_id) == null) {
      return UserResult.INVALID;
    }

    // If the user has already liked this post, then it's impossible to like it again.
    if (getNumLikesFromUser(post_id) >= 1) {
      return UserResult.IMPOSSIBLE;
    }

    likePostStatement.clearParameters();
    likePostStatement.setString(1, user);
    likePostStatement.setString(2, post_id);
    int num_rows = likePostStatement.executeUpdate();
    return num_rows == 1 && posts.increaseLikedPostByID(post_id) ? UserResult.SUCCESS
        : UserResult.FAIL;
  }

  public UserResult unlikePost(String post_id) throws SQLException {
    Posts posts = new Posts(conn);
    // If post_id is null or no such post exists, input is INVALID.
    if (post_id == null || posts.getPostByID(post_id) == null) {
      return UserResult.INVALID;
    }

    if (getNumLikesFromUser(post_id) < 1) {
      return UserResult.IMPOSSIBLE;
    }

    unlikePostStatement.clearParameters();
    unlikePostStatement.setString(1, user);
    unlikePostStatement.setString(2, post_id);
    int num_rows = unlikePostStatement.executeUpdate();
    return num_rows == 1 && posts.decreaseLikedPostByID(post_id) ? UserResult.SUCCESS : UserResult.FAIL;
  }

  private List<BookPost> getBatchPostIdPost(List<String> postIds) throws SQLException {
    if (postIds.isEmpty()) {
      return new ArrayList<>();
    }

    StringBuilder sqlQuery = new StringBuilder(GET_POSTS_BY_ID_STUB);

    for (int i = 0; i < postIds.size(); i++) {
      if (i > 0) {
        sqlQuery.append(" OR ");
      }

      sqlQuery.append("post_id = ?");
    }

    PreparedStatement stmt = conn.prepareStatement(sqlQuery.toString());
    for (int i = 0; i < postIds.size(); i++) {
      stmt.setString(i + 1, postIds.get(i));
    }

    ResultSet rs = stmt.executeQuery();
    return ResultSetParsers.getBookPostsFromResultSet(rs);
  }

  public List<BookPost> getLikedPosts() throws SQLException {
    getLikedPostsStatement.clearParameters();
    getLikedPostsStatement.setString(1, user);

    ResultSet rs = getLikedPostsStatement.executeQuery();
    List<String> postIds = new ArrayList<>();
    while (rs.next()) {
      postIds.add(rs.getString("post_id"));
    }
    rs.close();

    List<BookPost> result = getBatchPostIdPost(postIds);
    return result;
  }

  private void prepareStatements() throws SQLException {
    getProfileStatement = conn.prepareStatement(GET_PROFILE);
    createProfileStatement = conn.prepareStatement(CREATE_PROFILE);

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

    recommendStatement = conn.prepareStatement(RECOMMEND);

    getFriendsStatement = conn.prepareStatement(GET_FRIENDS);

    getClubPostsStatement = conn.prepareStatement(GET_CLUB_POSTS);

    getAllUserPostsStatement = conn.prepareStatement(GET_ALL_USER_POSTS);

    likePostStatement = conn.prepareStatement(LIKE_POST);

    unlikePostStatement = conn.prepareStatement(UNLIKE_POST);

    getLikedPostsStatement = conn.prepareStatement(GET_LIKED_POSTS);

    countLikedPostsByPidStatement = conn.prepareStatement(COUNT_LIKED_POSTS_BY_PID);
  }
}