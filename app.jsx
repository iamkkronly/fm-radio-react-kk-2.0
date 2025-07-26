function App() {
  const [stations, setStations] = React.useState([]);
  const [filtered, setFiltered] = React.useState([]);
  const [current, setCurrent] = React.useState(null);

  const [search, setSearch] = React.useState("");
  const [country, setCountry] = React.useState("All");
  const [language, setLanguage] = React.useState("All");
  const [darkMode, setDarkMode] = React.useState(true);

  const [countries, setCountries] = React.useState([]);
  const [languages, setLanguages] = React.useState([]);

  React.useEffect(() => {
    fetch("https://de1.api.radio-browser.info/json/stations")
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

  React.useEffect(() => {
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

  const getFlagEmoji = (code) => {
    if (!code) return "🌐";
    return code.toUpperCase().replace(/./g, c =>
      String.fromCodePoint(127397 + c.charCodeAt())
    );
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen p-6`}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 px-4 py-2 bg-yellow-400 rounded-xl shadow">
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1 className="text-4xl font-bold text-center mb-6">🌍 Worldwide FM Radio</h1>

      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search stations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded-xl border"
        />
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="p-3 rounded-xl border">
          {countries.map((c, i) => <option key={i} value={c}>{c}</option>)}
        </select>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="p-3 rounded-xl border">
          {languages.map((l, i) => <option key={i} value={l}>{l}</option>)}
        </select>
      </div>

      {current && (
        <div className="max-w-2xl mx-auto mb-6 bg-white/10 p-4 rounded-xl text-center">
          <div className="text-5xl mb-2">{getFlagEmoji(current.countrycode)}</div>
          <h2 className="text-xl font-bold">{current.name}</h2>
          <p className="opacity-80">{current.country} • {current.language}</p>
          <audio controls autoPlay className="mt-4 w-full">
            <source src={current.url_resolved} type="audio/mpeg" />
          </audio>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {filtered.map((st, idx) => (
          <div key={idx}
               onClick={() => setCurrent(st)}
               className="p-3 bg-white/10 rounded-xl cursor-pointer hover:bg-yellow-400/30 transition">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getFlagEmoji(st.countrycode)}</span>
              <div>
                <h3 className="font-semibold">{st.name}</h3>
                <p className="text-sm opacity-70">{st.country} • {st.language}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
