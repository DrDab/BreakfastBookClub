export const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

export const formatOpenLibraryData = (openlibraryJson) => {
  let formattedData = [];
  for (let i = 0; i < openlibraryJson.docs.length; i++ ) {
    let book = openlibraryJson.docs[i];
    let key = book.key;
    let title = book.title;
    let author = book.author_name;
    let coverUrl = book.cover_i ? "https://covers.openlibrary.org/b/id/" + book.cover_i  + "-M.jpg" : "";
    formattedData.push({key, title, author, coverUrl})
  }
  return formattedData;
}

export const handleFetch = async (route, id) => {
  console.log("fetch " + route + id)
  let query = "http://localhost:4567/api/" + route + id ;
  try {
    const response = await fetch(query);
    const json = await response.json();
    return json;
  } catch (error) {
    return error;
  }
}