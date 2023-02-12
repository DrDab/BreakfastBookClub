import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import utils.SQLTokenStore;

import static org.junit.jupiter.api.Assertions.*;

public class TestSQLTokenStore {
    public static final int NUM_TOKEN_ENTRIES = 1000;

    private SQLTokenStore store;
    private final String[] tokens = new String[NUM_TOKEN_ENTRIES];

    @BeforeEach
    public void initTokenStore() {
        store = new SQLTokenStore();

        for (int i = 0; i < NUM_TOKEN_ENTRIES; i++) {
            tokens[i] = store.getUserToken("user" + i);
        }
    }

    @Test
    public void testTokensMapProperly() {
        for (int i = 0; i < NUM_TOKEN_ENTRIES; i++) {
            assertNotNull(store.resolveUsername(tokens[i]));
            assertEquals("user" + i, store.resolveUsername(tokens[i]));
        }
    }

    @Test
    public void testTokensRemoveProperly() {
        for (int i = 0; i < NUM_TOKEN_ENTRIES; i++) {
            assertNotNull(store.resolveUsername(tokens[i]));
            store.deauthToken(tokens[i]);
            assertNull(store.resolveUsername(tokens[i]));
        }
    }


}
