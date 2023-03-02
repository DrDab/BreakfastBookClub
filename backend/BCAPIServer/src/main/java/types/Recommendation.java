package types;

public class Recommendation {

    public final String userID;

    public final String book_key;

    public Recommendation(String senderUsername, String book_key) {
        this.userID = senderUsername;
        this.book_key = book_key;
    }
}
