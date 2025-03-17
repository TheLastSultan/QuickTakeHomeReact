import React, { useState } from 'react';
import styled from 'styled-components';
import { search, SearchResult, SearchSource } from './services/searchService';
import logo from './assets/logo.png';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const Logo = styled.img`
  width: 200px;
  height: auto;
  margin: 0 auto 20px;
  display: block;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 700px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 4px 0 0 4px;
  outline: none;
  
  &:focus {
    border-color: #0077cc;
  }
`;

const SearchSelect = styled.select`
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-left: none;
  border-radius: 0 4px 4px 0;
  background-color: white;
  outline: none;
  cursor: pointer;
  
  &:focus {
    border-color: #0077cc;
  }
`;

const SearchButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #0077cc;
  border: none;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #005fa3;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const ResultItem = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  h3 {
    margin-top: 0;
    color: #0077cc;
  }
  
  p {
    margin-bottom: 10px;
    color: #555;
  }
  
  a {
    color: #0077cc;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Message = styled.div`
  text-align: center;
  color: #666;
  font-size: 16px;
  margin: 30px 0;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 119, 204, 0.3);
  border-radius: 50%;
  border-top-color: #0077cc;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [source, setSource] = useState<SearchSource>('stackoverflow');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const searchResults = await search(searchTerm, source);
      setResults(searchResults);
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
      console.error(err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <AppContainer>
      <Header>
        <Logo src={logo} alt="Search Logo" />
        <Title>Multi Search by Mohamed :)</Title>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SearchSelect 
            value={source}
            onChange={(e) => setSource(e.target.value as SearchSource)}
          >
            <option value="stackoverflow">Stack Overflow</option>
            <option value="wikipedia">Wikipedia</option>
            <option value="spotify">Spotify</option>
          </SearchSelect>
          <SearchButton 
            onClick={handleSearch}
            disabled={isLoading || !searchTerm.trim()}
          >
            Search
          </SearchButton>
        </SearchContainer>
      </Header>
      
      <ResultsContainer>
        {isLoading ? (
          <Message>
            <LoadingSpinner />
            <p>Searching {source}...</p>
          </Message>
        ) : error ? (
          <Message>{error}</Message>
        ) : results.length > 0 ? (
          results.map((result, index) => (
            <ResultItem key={index}>
              <h3>
                <a href={result.link} target="_blank" rel="noopener noreferrer">
                  {result.title}
                </a>
              </h3>
              {result.description && <p>{result.description}</p>}
              {result.image && <img src={result.image} alt={result.title} style={{ maxWidth: '100%', height: 'auto' }} />}
            </ResultItem>
          ))
        ) : hasSearched ? (
          <Message>No results found. Try a different search term.</Message>
        ) : (
          <Message>Enter a search term and select a source to get started.</Message>
        )}
      </ResultsContainer>
    </AppContainer>
  );
}

export default App;