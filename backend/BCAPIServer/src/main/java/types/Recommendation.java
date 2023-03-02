package types;

public class Recommendation {

    public final String userID;

    public final String bookKey;

    public Recommendation(String senderUsername, String bookKey) {
        this.userID = senderUsername;
        this.bookKey = bookKey;
    }
}
