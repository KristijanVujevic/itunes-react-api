import React, { useState, useEffect, useRef } from "react";

const ItunesSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (searchTerm === "") {
        setLoading(false);
        setResults([]);
        return;
      }

      const apiUrl = `https://itunes.apple.com/search?term=${searchTerm}&limit=10&offset=${
        (currentPage - 1) * 10
      }`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        setLoading(false);
        setResults((prevResults) => [...prevResults, ...data.results]);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchTerm, currentPage]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleScroll = () => {
    const container = containerRef.current;

    if (
      container &&
      container.scrollHeight - container.scrollTop === container.clientHeight
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <div>
      <input
        type="text"
        id="searchTerm"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Enter search term"
      />
      <div
        ref={containerRef}
        style={{ height: "100vh", overflowY: "auto", border: "1px solid #ccc" }}
      >
        <div id="loader" style={{ display: loading ? "block" : "none" }}>
          Loading...
        </div>
        <div id="results">
          {results.length > 0 ? (
            <table>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.artistName}</td>
                  <td>{result.trackName}</td>
                  <td>
                    <audio controls>
                      <source src={result.previewUrl} type="audio/mpeg" />
                    </audio>
                  </td>
                  <td>{result.collectionName}</td>
                  <td>
                    <img
                      src={result.artworkUrl100}
                      alt="Artwork"
                      width="150"
                      height="150"
                    />
                  </td>
                </tr>
              ))}
            </table>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItunesSearch;
