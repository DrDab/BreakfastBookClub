package utils;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Deprecated
public class TokenStore {
    private Map<String, String> tokenMap;

    public TokenStore() {
        tokenMap = new HashMap<>();
    }

    public String getUserToken(String username) {
        String token = UUID.randomUUID().toString();

        while (tokenMap.containsKey(token)) {
            token = UUID.randomUUID().toString();
        }

        tokenMap.put(token, username);
        return token;
    }

    public String resolveUsername(String token) {
        if (tokenMap.containsKey(token)) {
            return tokenMap.get(token);
        }

        return null;
    }

    public boolean deauthToken(String token) {
        return tokenMap.remove(token) != null;
    }
}
