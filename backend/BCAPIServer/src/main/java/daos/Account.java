package daos;

import java.sql.*;
import java.util.*;
import java.security.*;
import java.security.spec.*;
import javax.crypto.*;
import javax.crypto.spec.*;

@Deprecated
public class Account {
    private Connection conn;

    // Password salting and hashing constants
    private static final int HASH_STRENGTH = 65536;
    private static final int KEY_LENGTH = 128;

    // Check username exists
    private static final String CHECK_USERNAME =
            "SELECT COUNT(*) AS count FROM user_info WHERE id = ?";
    private PreparedStatement checkUsernameStatement;

    // Create User
    private static final String ADD_USER =
            "INSERT INTO user_info(id, hash, salt) VALUES (?, ?, ?)";
    private PreparedStatement addUserStatement;

    // Get a user's salt
    private static final String GET_USER_SALT =
            "SELECT salt FROM user_info WHERE id = ?";
    private PreparedStatement getUserSaltStatement;

    // Get a user's hash
    private static final String GET_USER_HASH =
            "SELECT hash FROM user_info WHERE id = ?";
    private PreparedStatement getUserHashStatement;

    /**
     * Creates an Account instance which handles new user creation and user login.
     * @param conn Connection object connected to the MySQL database
     */
    public Account(Connection conn) throws SQLException {
        // For now, take in preconnected Connection. Might reimplement if needed.
        this.conn = conn;
        prepareStatements();
    }

    /**
     * Create a new user account. Gives a warning is the username is invalid or
     * already exists. Also gives a warning if the password is invalid.
     * @param username: a non-null, non-empty String
     * @param password: a non-null, non-empty String
     * @return "Username cannot be empty." if the username is empty or null.
     *         "Username should be less than 20 characters." if the username is too long.
     *         "Password needs to be at least 8 characters." if the password is too short or null.
     *         "This username is already taken." if another account has the same username.
     *         "New user account created." if the account is successfully made.
     */
    public String createUser(String username, String password) throws SQLException {
        if (username.equals("") || username == null) {
            return "Username cannot be empty.";
        }

        if (username.length() > 20) {
            return "Username should be less than 20 characters.";
        }

        if (password.length() < 8 || password == null) {
            return "Password needs to be at least 8 characters.";
        }

        conn.setAutoCommit(false);

        if (userExists(username)) {
            conn.rollback();
            conn.setAutoCommit(true);
            return "This username is already taken.";
        }

        byte[] salt = getSalt();
        byte[] hash = getHash(password, salt);
        addUserStatement.clearParameters();
        addUserStatement.setString(1, username);
        addUserStatement.setBytes(2, hash);
        addUserStatement.setBytes(3, salt);
        conn.commit();
        addUserStatement.execute();

        conn.commit();
        conn.setAutoCommit(true);

        return "New user account created.";
    }

    /**
     * Login the user.
     * @param username username that the user gave
     * @param password password that the user gave
     * @return "User does not exist." if username is not in the database
     *         "Failed to login user." if an SQLException is caught
     *         "Incorrect password." if the password doesn't match the database
     *         "User logged in." if login was successful
     */
    public String login(String username, String password) {
        try {
            if(!userExists(username)) { // User doesn't exist
                return "User does not exist.";
            } else {
                getUserSaltStatement.clearParameters();
                getUserSaltStatement.setString(1, username);
                ResultSet rs = getUserSaltStatement.executeQuery();
                rs.next();
                byte[] salt = rs.getBytes("salt");
                rs.close();

                byte[] hash = getHash(password, salt);
                getUserHashStatement.clearParameters();
                getUserHashStatement.setString(1, username);
                ResultSet rSet = getUserHashStatement.executeQuery();
                rSet.next();
                byte[] realHash = rSet.getBytes("hash");
                rSet.close();

                if (Arrays.equals(realHash, hash)) {
                    return "User logged in.";
                }
                return "Incorrect password.";
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return "Failed to login user.";
        }
    }

    // True if user is in the Users SQL table
    private boolean userExists(String username) {
        try {
            checkUsernameStatement.clearParameters();
            checkUsernameStatement.setString(1, username);
            ResultSet rs = checkUsernameStatement.executeQuery();
            rs.next();
            int count = rs.getInt("count");
            rs.close();
            return count != 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Generate a salt to encrypt the password
    private byte[] getSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return salt;
    }

    // Hash and salt the password.
    private byte[] getHash(String password, byte[] salt) {
        KeySpec spec = new PBEKeySpec(password.toCharArray(), salt, HASH_STRENGTH, KEY_LENGTH);

        SecretKeyFactory factory = null;
        byte[] hash = null;
        try {
            factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
            hash = factory.generateSecret(spec).getEncoded();
            return hash;
        } catch (NoSuchAlgorithmException | InvalidKeySpecException ex) {
            throw new IllegalStateException();
        }
    }

    private void prepareStatements() throws SQLException {
        checkUsernameStatement = conn.prepareStatement(CHECK_USERNAME);
        addUserStatement = conn.prepareStatement(ADD_USER);

        getUserSaltStatement = conn.prepareStatement(GET_USER_SALT);
        getUserHashStatement = conn.prepareStatement(GET_USER_HASH);
    }
}