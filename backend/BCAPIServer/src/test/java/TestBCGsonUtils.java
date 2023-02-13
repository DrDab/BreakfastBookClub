import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import org.junit.jupiter.api.Test;
import utils.BCGsonUtils;

public class TestBCGsonUtils {

  @Test
  public void testJsonifyJsonArr() {
    assertNull(BCGsonUtils.fromStr("[{\"owo\":\"uwu\"}]"));
  }

  @Test
  public void testJsonifyInvalidStr() {
    assertNull(BCGsonUtils.fromStr("asfkljasfkl"));
  }

  @Test
  public void testJsonifyEmptyStr() {
    assertNull(BCGsonUtils.fromStr(""));
  }

  @Test
  public void testJsonifyMultipleTLObjsReturnNull() {
    assertNull(BCGsonUtils.fromStr("{} {}"));
    assertNull(BCGsonUtils.fromStr("{},{}"));
  }

  @Test
  public void testJsonifyEmptyJsonStr() {
    JsonObject jsonObject = BCGsonUtils.fromStr("{}");
    assertNotNull(jsonObject);
    assertEquals(0, jsonObject.size());
    assertFalse(jsonObject.has("member"));
  }

  @Test
  public void testJsonifyOneFieldJsonStr() {
    JsonObject jsonObject = BCGsonUtils.fromStr("{\"name\":\"Fido\"}");
    assertNotNull(jsonObject);
    assertEquals(1, jsonObject.size());
    assertFalse(jsonObject.has("member"));
    assertTrue(jsonObject.has("name"));
    assertEquals("Fido", jsonObject.get("name").getAsString());
  }

  @Test
  public void testJsonifyTwoFieldsJsonStr() {
    JsonObject jsonObject = BCGsonUtils.fromStr("{\"name\":\"Fido\", \"age\":12}");
    assertNotNull(jsonObject);
    assertEquals(2, jsonObject.size());
    assertFalse(jsonObject.has("member"));
    assertTrue(jsonObject.has("name"));
    assertTrue(jsonObject.has("age"));
    assertEquals("Fido", jsonObject.get("name").getAsString());
    assertEquals(12, jsonObject.get("age").getAsInt());
  }

  @Test
  public void testJsonifyThreeFieldsJsonStr() {
    JsonObject jsonObject = BCGsonUtils.fromStr("{\"name\":\"Fido\", \"age\":12, \"bad\":null }");
    assertNotNull(jsonObject);
    assertEquals(3, jsonObject.size());
    assertFalse(jsonObject.has("member"));
    assertTrue(jsonObject.has("name"));
    assertTrue(jsonObject.has("age"));
    assertTrue(jsonObject.has("bad"));
    assertEquals("Fido", jsonObject.get("name").getAsString());
    assertEquals(12, jsonObject.get("age").getAsInt());
    assertTrue(jsonObject.get("bad").isJsonNull());
  }
}
