import React, { useState, useEffect } from "react";

export default function App() {
  const [stations, setStations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [current, setCurrent] = useState(null);

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All");
  const [language, setLanguage] = useState("All");
  const [darkMode, setDarkMode] = useState(true);

  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    fetch("/api/stations")
      .then(res => res.json())
      .then(data => {
        const top = data.slice(0, 150);
        setStations(top);
        setFiltered(top);
        if (top.length > 0) setCurrent(top[0]);

        const uniqueCountries = Array.from(new Set(top.map(st => st.country).filter(Boolean))).sort();
        const uniqueLanguages = Array.from(new Set(top.map(st => st.language).filter(Boolean))).sort();
        setCountries(["All", ...uniqueCountries]);
        setLanguages(["All", ...uniqueLanguages]);
      });
  }, []);

  useEffect(() => {
    let filteredData = stations;

    if (search) {
      filteredData = filteredData.filter(st =>
        st.name.toLowerCase().includes(search.toLowerCase()) ||
        (st.country || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    if (country !== "All") {
      filteredData = filteredData.filter(st => st.country === country);
    }
    if (language !== "All") {
      filteredData = filteredData.filter(st => st.language === language);
    }

    setFiltered(filteredData);
  }, [search, country, language, stations]);

  const getFlagEmoji = (countryCode) => {
    if (!countryCode) return "🌐";
    return countryCode
      .toUpperCase()
      .replace(/./g, char =>
        String.fromCodePoint(127397 + char.charCodeAt())
      );
  };

  return (
    <div className={`${darkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black" : "bg-gradient-to-br from-indigo-100 via-pink-100 to-white"} min-h-screen flex flex-col items-center p-6 transition-colors duration-500`}>
      
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-xl border border-white/30 text-sm shadow-lg hover:scale-105 transition">
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1 className="text-5xl font-extrabold mb-6 text-center drop-shadow-2xl text-white">
        🌍 Worldwide FM Radio
      </h1>

      {/* Search and Filters */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mb-8">
        <input
          type="text"
          placeholder="🔍 Search stations or countries"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`flex-1 p-3 rounded-2xl ${darkMode ? "bg-white/20 text-white placeholder-gray-200" : "bg-white text-gray-800 placeholder-gray-500"} backdrop-blur-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition shadow-lg`}
        />

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="flex-1 p-3 rounded-2xl bg-white/20 text-white backdrop-blur-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-lg"
        >
          {countries.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
        </select>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="flex-1 p-3 rounded-2xl bg-white/20 text-white backdrop-blur-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-lg"
        >
          {languages.map((l, idx) => <option key={idx} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Current Player */}
      {current && (
        <div className="relative mb-8 p-6 bg-white/20 rounded-3xl backdrop-blur-xl shadow-2xl border border-white/30 text-center w-full max-w-2xl text-white">
          <div className="text-6xl mb-2">{getFlagEmoji(current.countrycode)}</div>
          <h2 className="text-2xl font-bold">{current.name}</h2>
          <p className="text-sm opacity-80">{current.country} • {current.language}</p>
          <audio controls autoPlay className="mt-4 w-full rounded-xl">
            <source src={current.url_resolved} type="audio/mpeg" />
          </audio>
        </div>
      )}

      {/* Trending */}
      <h2 className="text-2xl font-semibold mb-4 text-yellow-300">🔥 Trending Stations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-7xl mb-10">
        {stations.slice(0, 8).map((station, idx) => (
          <div key={idx}
               onClick={() => setCurrent(station)}
               className="p-4 bg-yellow-400/20 hover:bg-yellow-500/30 rounded-2xl backdrop-blur-md border border-yellow-200/40 shadow-xl cursor-pointer transform hover:scale-105 transition duration-200">
            <div className="flex items-center space-x-3 text-white">
              <span className="text-2xl">{getFlagEmoji(station.countrycode)}</span>
              <div>
                <h3 className="text-lg font-semibold">{station.name}</h3>
                <p className="text-sm opacity-80">{station.country}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* All Stations */}
      <h2 className="text-2xl font-semibold mb-4 text-white">🎧 All Stations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-7xl">
        {filtered.map((station, idx) => (
          <div key={idx}
               onClick={() => setCurrent(station)}
               className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl cursor-pointer transform hover:scale-105 transition duration-200 text-white">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getFlagEmoji(station.countrycode)}</span>
              <div>
                <h3 className="text-lg font-semibold">{station.name}</h3>
                <p className="text-sm opacity-80">{station.country} • {station.language}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
