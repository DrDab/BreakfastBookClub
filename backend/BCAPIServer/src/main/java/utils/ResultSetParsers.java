package utils;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import types.BookPost;

public class ResultSetParsers {
  public static List<BookPost> getBookPostsFromResultSet(ResultSet rs) throws SQLException {
    List<BookPost> posts = new ArrayList<>();

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
}
