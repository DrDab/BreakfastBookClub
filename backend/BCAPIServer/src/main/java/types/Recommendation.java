package types;

public class Recommendation {

    public final String senderUsername;

    public final String bookKey;

    public Recommendation(String senderUsername, String bookKey) {
        this.senderUsername = senderUsername;
        this.bookKey = bookKey;
    }
}
