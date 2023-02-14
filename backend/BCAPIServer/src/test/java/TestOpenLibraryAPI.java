import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

import java.io.IOException;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import types.Book;
import utils.OpenLibraryAPI;

public class TestOpenLibraryAPI {

  @Test
  public void testBogusBookNonexistence() {
    try {
      assertFalse(OpenLibraryAPI.bookExists("THISIsANonExistentKEy" + System.currentTimeMillis()));
    } catch (IOException | InterruptedException e) {
      e.printStackTrace();
      fail("Test threw exception. Failed!");
    }
  }

  @Test
  public void testKnownBookExistence() {
    try {
      // Make sure OpenLibraryAPI correctly verifies books that exist
      UUID uuid = UUID.randomUUID();

      // Check if "The Terminal List" exists in OpenLibraryAPI (should be true)
      assertTrue(OpenLibraryAPI.bookExists("OL19732624W"));
      assertFalse(OpenLibraryAPI.bookExists("OL19732624W" + uuid.toString()));

      // Check if "Charlotte's Web" exists in OpenLibraryAPI (should be true)
      assertTrue(OpenLibraryAPI.bookExists("OL483391W"));
      assertFalse(OpenLibraryAPI.bookExists("OL483391W" + uuid.toString()));

      // Check if "Atlas Shrugged" exists in OpenLibraryAPI (should be true)
      assertTrue(OpenLibraryAPI.bookExists("OL731735W"));
      assertFalse(OpenLibraryAPI.bookExists("OL731735W" + uuid.toString()));

    } catch (IOException | InterruptedException e) {
      e.printStackTrace();
      fail("Test threw exception. Failed!");
    }
  }

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
      Book book1 = OpenLibraryAPI.getBookByKey("OL19732624W");
      assertNotNull(book1);
      assertEquals("The terminal list", book1.title);
      assertEquals("Carr, Jack", book1.author);
      assertEquals("OL19732624W", book1.book_id);

      Book book2 = OpenLibraryAPI.getBookByKey("OL731735W");
      assertNotNull(book2);
      assertEquals("Atlas Shrugged", book2.title);
      assertEquals("Ayn Rand", book2.author);
      assertEquals("OL731735W", book2.book_id);
    } catch (IOException | InterruptedException e) {
      e.printStackTrace();
      fail("Test threw exception. Failed!");
    }
  }
}
