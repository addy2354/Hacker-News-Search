import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import ClearIcon from '@mui/icons-material/Clear';

function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [largeTitle, setLargeTitle] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (text || text === "") {
      const query = text || "Software";

      const delayTimer = setTimeout(() => {
        fetchArticles(query);
      }, 0); // delay-time

      return () => clearTimeout(delayTimer);
    }
  }, [text]);

  const fetchArticles = async (query) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${query}`
      );
      const data = await res.json();
      const validItems = data.hits.filter(item => item.url);
      setItems(validItems);
      setLargeTitle(validItems[0] || {});
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching articles:", error);
    }
  };

  const handleCardClick = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchArticles(text || "Software");
  };

  const handleClearSearch = () => {
    setText("");
    fetchArticles("Software"); // Fetch default articles when search is cleared
  };

  return (
    <>
      <section className="section">
        <form autoComplete="off" onSubmit={handleSubmit} className="search-form">
          <div className="search-container">
            <input
              type="text"
              name="Search"
              id="search"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Search for something"
            />
            {text && (
              <ClearIcon className="search-clear-icon" onClick={handleClearSearch} fontSize="large" />
            )}
          </div>
        </form>

        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <>
            <article className="title">
              <h1>{largeTitle.title}</h1>
              <a href={largeTitle.url} target="_blank" rel="noreferrer">
                Read Full Article
              </a>
            </article>

            <p className="category">
              Category: <span>{text || "Software"}</span>
            </p>

            <article className="cards">
              {items.slice(1).map(({ author, created_at, title, url, objectID }) => (
                <div
                  key={objectID}
                  onClick={() => handleCardClick(url)}
                  className="card"
                >
                  <h2>{title}</h2>
                  <ul>
                    <li>By {author}</li>
                  </ul>
                  <p>{format(new Date(created_at), "dd MMMM yyyy")}</p>
                </div>
              ))}
            </article>
          </>
        )}
      </section>
      <footer className="footer">
        <a href="https://github.com/adeel-015/" target="_blank" rel="noreferrer">
          <h6>Made by Adeel Javed</h6>
        </a>
      </footer>
    </>
  );
}

export default App;
