package types;

public class BookPost {
    public final String userId;
    public final String bookKey;
    public final String postTitle;
    public final String post;
    public final String tag;
    public final String postId;
    public final long date;
    public final long likes;

    public BookPost(String userId, String bookKey, String postTitle, String post, 
            String tag, String postId, long date, long likes) {
        this.userId = userId;
        this.bookKey = bookKey;
        this.postTitle = postTitle;
        this.post = post;
        this.tag = tag;
        this.postId = postId;
        this.date = date;
        this.likes = likes;
    }
}