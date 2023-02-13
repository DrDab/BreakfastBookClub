import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.fail;

import java.io.IOException;
import org.junit.jupiter.api.Test;
import types.Book;
import utils.OpenLibraryAPI;

public class TestOpenLibraryAPI {

  @Test
  public void testSearchNonexistentBookNull() {
    try {
      assertNull(OpenLibraryAPI.getBookByKey("THISIsANonExistentKEy" + System.currentTimeMillis()));
    } catch (IOException | InterruptedException e) {
      e.printStackTrace();
      fail("Test threw exception. Failed!");
    }
  }

  @Test
  public void testSearchAuthor() {
    try {
      String authorName = OpenLibraryAPI.getAuthorByKey("/authors/OL7531556A");
      assertNotNull(authorName);
      assertEquals("Carr, Jack", authorName);
    } catch (IOException | InterruptedException e) {
      e.printStackTrace();
      fail("Test threw exception. Failed!");
    }
  }

  @Test
  public void testSearchBook() {
    try {
      Book book = OpenLibraryAPI.getBookByKey("OL19732624W");
      assertNotNull(book);
      assertEquals("The terminal list", book.title);
      assertEquals("Carr, Jack", book.author);
      assertEquals("OL19732624W", book.book_id);
    } catch (IOException | InterruptedException e) {
      e.printStackTrace();
      fail("Test threw exception. Failed!");
    }
  }
}
