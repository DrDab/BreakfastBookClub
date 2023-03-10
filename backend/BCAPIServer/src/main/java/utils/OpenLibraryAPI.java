package utils;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import daos.Books;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;
import types.Book;

public class OpenLibraryAPI {

  private static final String WORKS_URL = "https://openlibrary.org/works/";
  private static final String AUTHOR_URL = "https://openlibrary.org";
  private static final String COVERS_URL = "https://covers.openlibrary.org/b/id/";

  private static HttpRequest buildGetHttpRequest(URI targetURI) {
    return HttpRequest.newBuilder()
        .uri(targetURI)
        .GET()
        .build();
  }

  private static URI getAuthorTargetURI(String authorKey) {
    try {
      return new URI(AUTHOR_URL + authorKey + ".json");
    } catch (URISyntaxException ex) {
      ex.printStackTrace();
    }
    return null;
  }

  private static URI getBookTargetURI(String bookKey) {
    try {
      return new URI(WORKS_URL + bookKey + ".json");
    } catch (URISyntaxException ex) {
      ex.printStackTrace();
    }

    return null;
  }

  public static String getAuthorByKey(String authorKey)
      throws IOException, InterruptedException {
    URI targetURI = getAuthorTargetURI(authorKey);

    if (targetURI == null) {
      return null;
    }

    HttpRequest httpRequest = buildGetHttpRequest(targetURI);
    HttpClient httpClient = HttpClient.newHttpClient();
    HttpResponse<String> response = httpClient.send(httpRequest,
        HttpResponse.BodyHandlers.ofString());

    String body = response.body();
    JsonObject jsonObject = BCGsonUtils.fromStr(body);

    if (jsonObject.has("error") || !jsonObject.has("personal_name")) {
      return null;
    }

    return jsonObject.get("personal_name").getAsString();
  }

  public static boolean bookExists(String bookKey) throws IOException, InterruptedException {
    URI targetURI = getBookTargetURI(bookKey);

    if (targetURI == null) {
      return false;
    }

    HttpRequest httpRequest = buildGetHttpRequest(targetURI);
    HttpClient httpClient = HttpClient.newHttpClient();
    HttpResponse<String> response = httpClient.send(httpRequest,
        HttpResponse.BodyHandlers.ofString());

    JsonObject jsonObject = BCGsonUtils.fromStr(response.body());
    return !jsonObject.has("error");
  }

  public static Book getBookByKey(String book_key)
      throws IOException, InterruptedException {
    URI targetURI = getBookTargetURI(book_key);

    if (targetURI == null) {
      return null;
    }

    HttpRequest httpRequest = buildGetHttpRequest(targetURI);
    HttpClient httpClient = HttpClient.newHttpClient();
    HttpResponse<String> response = httpClient.send(httpRequest,
        HttpResponse.BodyHandlers.ofString());

    JsonObject jsonObject = BCGsonUtils.fromStr(response.body());

    if (jsonObject.has("error")) {
      return null;
    }

    String title = jsonObject.has("title") ? jsonObject.get("title").getAsString() : null;
    String author = null;

    if (jsonObject.has("authors")) {
      JsonArray authorsArr = jsonObject.getAsJsonArray("authors");

      if (!authorsArr.isEmpty()) {
        JsonObject firstElement = authorsArr.get(0).getAsJsonObject();
        JsonObject authorObj = firstElement.getAsJsonObject("author");
        author = getAuthorByKey(authorObj.get("key").getAsString());
      }
    }

    String coverUrl = null;

    if (jsonObject.has("covers")) {
      JsonArray coversArr = jsonObject.getAsJsonArray("covers");
      if (!coversArr.isEmpty()) {
        coverUrl = COVERS_URL + coversArr.get(0).getAsString() + "-M.jpg";
      }
    }

    return new Book(book_key, title, author, coverUrl);
  }

  public static Book getBookByKeyWithCache(Books books, Map<String, Book> requestCache,
      String bookKey) throws IOException, InterruptedException {
    // STEP 1: Check if requestCache (the cached books for the request)
    // has the requested book.
    if (requestCache.containsKey(bookKey)) {
      return requestCache.get(bookKey);
    }

    // STEP 2: Check if the local books database has the requested book.
    Book dbBook = books.getCachedBookByKey(bookKey);
    if (dbBook != null) {
      requestCache.put(bookKey, dbBook);
      return dbBook;
    }

    // STEP 3: Local database doesn't have the requested book.
    // Add to local DB from OpenLibrary API call and add to cache.
    dbBook = getBookByKey(bookKey);
    if (dbBook != null) {
      books.insertBook(dbBook);
      requestCache.put(bookKey, dbBook);
      return dbBook;
    }

    return null;
  }
}
