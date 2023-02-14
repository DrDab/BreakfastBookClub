package daos;

public enum UserResult {
    SUCCESS, // normal return
    FAIL, // abnormal return due to database error
    INVALID, // invalid input
    IMPOSSIBLE // cannot execute because preconditions noy met (e.g. friending twice)
}