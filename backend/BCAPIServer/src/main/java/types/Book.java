package types;

public class Book {

  public final String book_key;
  public final String title;
  public final String author;
  public final String thumbnail;

  public Book(String book_key, String title, String author, String thumbnail) {
    this.book_key = book_key;
    this.title = title;
    this.author = author;
    this.thumbnail = thumbnail;
  }

  public Book(String book_key, String title, String author) {
    this(book_key, title, author, null);
  }
}
