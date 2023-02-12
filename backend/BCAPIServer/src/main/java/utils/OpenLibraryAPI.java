package utils;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import types.Book;

public class OpenLibraryAPI {

  private static final String WORKS_URL = "https://openlibrary.org/works/";
  private static final String AUTHOR_URL = "https://openlibrary.org";
  private static final String COVERS_URL = "https://covers.openlibrary.org/b/id/";

  private HttpRequest buildGetHttpRequest(URI targetURI) {
    return HttpRequest.newBuilder()
        .uri(targetURI)
        .GET()
        .build();
  }

  public String getAuthorByKey(String authorKey)
      throws URISyntaxException, IOException, InterruptedException {
    URI targetURI = new URI(AUTHOR_URL + authorKey);
    HttpRequest httpRequest = buildGetHttpRequest(targetURI);
    HttpClient httpClient = HttpClient.newHttpClient();
    HttpResponse<String> response = httpClient.send(httpRequest,
        HttpResponse.BodyHandlers.ofString());

    JsonObject jsonObject = BCGsonUtils.fromStr(response.body());

    if (jsonObject.has("error")) {
      return null;
    }

    return jsonObject.get("personal_name").toString();
  }

  public Book getBookByKey(String bookKey)
      throws URISyntaxException, IOException, InterruptedException {
    URI targetURI = new URI(WORKS_URL + bookKey + ".json");
    HttpRequest httpRequest = buildGetHttpRequest(targetURI);
    HttpClient httpClient = HttpClient.newHttpClient();
    HttpResponse<String> response = httpClient.send(httpRequest,
        HttpResponse.BodyHandlers.ofString());

    JsonObject jsonObject = BCGsonUtils.fromStr(response.body());

    if (jsonObject.has("error")) {
      return null;
    }

    String title = jsonObject.get("title").toString();
    String author = null;

    JsonArray authorsArr = jsonObject.getAsJsonArray("authors");

    if (!authorsArr.isEmpty()) {
      JsonObject firstElement = authorsArr.get(0).getAsJsonObject();
      JsonObject authorObj = firstElement.getAsJsonObject("author");
      author = getAuthorByKey(authorObj.get("key").getAsString());
    }

    String coverUrl = null;

    JsonArray coversArr = jsonObject.getAsJsonArray("covers");
    if (!coversArr.isEmpty()) {
      coverUrl = COVERS_URL + coversArr.get(0).getAsString() + "-M.jpg";
    }

    return new Book(bookKey, title, author, coverUrl);
  }
}
