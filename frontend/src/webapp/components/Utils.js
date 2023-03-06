// tabs
export const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

// fetch
export const formatOpenLibraryData = (openlibraryJson) => {
  let formattedData = [];
  for (let i = 0; i < openlibraryJson.docs.length; i++) {
    let book = openlibraryJson.docs[i];
    let key = book.key;
    let title = book.title;
    let author = book.author_name;
    let coverUrl = book.cover_i ? "https://covers.openlibrary.org/b/id/" + book.cover_i  + "-M.jpg" : "";
    formattedData.push({key, title, author, coverUrl})
  }
  return formattedData;
}

export const handleGetFetchBase = async (url) => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    return error;
  }
}

export const handleGetFetch = async (route) => {
  let url = "https://34.145.15.228:4567/api/" + route;
  return handleGetFetchBase(url);
}

export const handlePostFetch = async (route, jsonData) => {
  let url = "https://34.145.15.228:4567/api/" + route;
  console.log("POST " + url);

  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData)
    });
    const json = await response.json();
    return json;
  } catch (error) {
    return error;
  }
}

// avatar color
const componentToHex = (c) => {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export const hashUserIdToColor = (userId) => {
  let isUpperCase = userId.charAt(0) === userId.charAt(0).toUpperCase();

  let r = userId.charCodeAt(1);
  let b = userId.charCodeAt(2);
  let g = userId.charCodeAt(3);

  if (isUpperCase) {
    r = (r + 60) % 255;
    g = (g + 30) % 255;
    b = (b + 20) % 255;
  } else {
    r = (r + 10) % 255;
    g = (g + 20) % 255;
    b = (b + 50) % 255;
  }
  return rgbToHex(r, g, b);
}
