package utils;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;

public class BCGsonUtils {

  /**
   * Gets a JsonObject from the given JSON object in the string body.
   *
   * @param body, the string containing the JSON object to parse.
   * @return the parsed JSON Object from body, or null if parsed body doesn't have valid JSON
   * object, has multiple top-level JSON elements, or has trailing data.
   */
  public static JsonObject fromStr(String body) {
    JsonElement bodyElement;

    try {
      bodyElement = JsonParser.parseString(body);
    } catch (JsonSyntaxException ex) {
      return null;
    }
    
    if (!bodyElement.isJsonObject()) {
      return null;
    }

    return bodyElement.getAsJsonObject();
  }
}
