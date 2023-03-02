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

export const handleGetFetch = async (route) => {
  let url = "http://localhost:4567/api/" + route;
   // console.log("get " + url)
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    return error;
  }
}


export const handlePostFetch = (route) => {
  let url = "http://localhost:4567/api/" + route;
  // console.log("post " + url)
  fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.log(error);
  });

}