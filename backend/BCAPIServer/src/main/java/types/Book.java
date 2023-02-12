package types;

public class Book {

  public final String book_id;
  public final String title;
  public final String author;
  public final String thumbnail;

  public Book(String book_id, String title, String author, String thumbnail) {
    this.book_id = book_id;
    this.title = title;
    this.author = author;
    this.thumbnail = thumbnail;
  }

  public Book(String book_id, String title, String author) {
    this(book_id, title, author, null);
  }
}
