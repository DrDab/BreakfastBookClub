package types;

public class BookPost {

  public final String userId;
  public final String book_key;
  public final String postTitle;
  public final String post;
  public final String tag;
  public final String postId;
  public final long date;
  public final long likes;

  public BookPost(String userId, String book_key, String postTitle, String post,
      String tag, String postId, long date, long likes) {
    this.userId = userId;
    this.book_key = book_key;
    this.postTitle = postTitle;
    this.post = post;
    this.tag = tag;
    this.postId = postId;
    this.date = date;
    this.likes = likes;
  }

  @Override
  public boolean equals(Object other) {
    if (!(other instanceof BookPost)) {
      return false;
    }

    return postId.equals(((BookPost) other).postId);
  }
}