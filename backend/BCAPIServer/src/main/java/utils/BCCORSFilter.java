package utils;

import spark.Spark;

import java.util.HashMap;

public class BCCORSFilter {

  private final HashMap<String, String> corsHeaders = new HashMap<>();

  public BCCORSFilter() {
    corsHeaders.put("Access-Control-Allow-Credentials", "true");
    corsHeaders.put("Access-Control-Allow-Headers",
        "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin");
    corsHeaders.put("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    corsHeaders.put("Access-Control-Allow-Origin", "*");
  }

  public void apply() {
    // Apply CORS headers to all routes regardless of exception status
    Spark.afterAfter((request, response) -> corsHeaders.forEach(response::header));
  }
}

