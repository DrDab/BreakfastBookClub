package utils;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;

public class BCGsonUtils {

  public static JsonObject fromStr(String body) throws JsonSyntaxException {
    JsonElement bodyElement;
    bodyElement = JsonParser.parseString(body);

    if (!bodyElement.isJsonObject()) {
      return null;
    }

    return bodyElement.getAsJsonObject();
  }
}
