package daos;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import types.BookPost;

public class Posts {

  private Connection conn;

  private static final String ALL_POSTS_SQL =
      "SELECT * FROM book_posts";
  private final PreparedStatement allPostsStatement;

  private static final String GET_POST_BY_ID_SQL =
      "SELECT * FROM book_posts WHERE post_id = ?";
  private final PreparedStatement getPostByIdStatement;

  private static final String LIKE_POST_BY_ID_SQL =
      "UPDATE book_posts SET likes = likes + 1 WHERE post_id = ?";
  private final PreparedStatement likePostByIdStatement;

  public Posts(Connection conn) throws SQLException {
    this.conn = conn;
    allPostsStatement = conn.prepareStatement(ALL_POSTS_SQL);
    getPostByIdStatement = conn.prepareStatement(GET_POST_BY_ID_SQL);
    likePostByIdStatement = conn.prepareStatement(LIKE_POST_BY_ID_SQL);
  }

  public boolean likePostByID(String postID) {
    if (postID == null) {
      throw new IllegalArgumentException("postId cannot be null!");
    }

    try {
      likePostByIdStatement.clearParameters();;
      likePostByIdStatement.setString(1, postID);
      return likePostByIdStatement.executeUpdate() == 1;
    } catch (SQLException e) {
      e.printStackTrace();
    }

    return false;
  }

  public BookPost getPostByID(String postId) {
    if (postId == null) {
      throw new IllegalArgumentException("postId cannot be null!");
    }

    BookPost retPost = null;

    try {
      getPostByIdStatement.clearParameters();
      getPostByIdStatement.setString(1, postId);
      ResultSet rs = getPostByIdStatement.executeQuery();

      if (!rs.next()) {
        rs.close();
        return null;
      }

      String userId = rs.getString("user_id");
      String bookKey = rs.getString("book_key");
      String postTitle = rs.getString("post_title");
      String post = rs.getString("post");
      String tag = rs.getString("tag");
      long date = rs.getLong("post_date");
      long likes = rs.getLong("likes");

      retPost = new BookPost(userId, bookKey, postTitle, post, tag, postId, date, likes);
      rs.close();
    } catch (SQLException e) {
      e.printStackTrace();
    }

    return retPost;
  }

  /**
   * Gets the list all the books posts
   */
  public List<BookPost> listAllPosts() {
    List<BookPost> posts = new ArrayList<>();
    try {
      allPostsStatement.clearParameters();
      ResultSet rs = allPostsStatement.executeQuery();

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
    } catch (SQLException e) {
      e.printStackTrace();
    }

    return posts;
  }

}