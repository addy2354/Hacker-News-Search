import React, { useState, useEffect } from "react";
import { format } from "date-fns";

function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [largeTitle, setLargeTitle] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (text || text === "") {
      const query = text || "programming";

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
      setItems(data.hits);
      setLargeTitle(data.hits[0]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching articles:", error);
    }
  };

  const handleCardClick = (url) => {
    window.open(url, "_blank");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text) {
      fetchArticles("programming");
    } else {
      fetchArticles(text);
    }
  };

  return (
    <>
      <section className="section">
        <form autoComplete="off" onSubmit={handleSubmit}>
          <input
            type="text"
            name="Search"
            id="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search for something"
          />
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
              Category: <span>{text || "programming"}</span>
            </p>

            <article className="cards">
              {items.map(({ author, created_at, title, url, objectID }) => (
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
        <h6>Made by Adeel Javed</h6>
      </footer>
    </>
  );
}

export default App;
