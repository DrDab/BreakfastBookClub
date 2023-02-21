package types;

public class UserProfile {
  public final String uid;
  public String username;
  public final String bio;
  public final String thumbnail;

  public UserProfile(String uid, String username, String bio, String thumbnail) {
    this.uid = uid;
    this.username = username;
    this.bio = bio;
    this.thumbnail = thumbnail;
  }
}
