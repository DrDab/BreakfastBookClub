package daos;

public class BookPost {
    private String userId;
    private String bookKey;
    private String postTitle;
    private String post;
    private String tag;
    private String postId;
    private long date;
    private long likes;

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