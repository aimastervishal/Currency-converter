const { useState, useEffect, useMemo } = React;
async function getCountryMap() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const data = await res.json();

  const map = {};

  data.forEach(c => {
    if (c.currencies) {
      Object.keys(c.currencies).forEach(code => {
        map[code] = `${c.name.common} ${c.flag || "🌍"}`;
      });
    }
  });

  return map;
}


const countryMap = {
  USD: "United States 🇺🇸",
  EUR: "Eurozone 🇪🇺",
  GBP: "United Kingdom 🇬🇧",
  INR: "India 🇮🇳",
  JPY: "Japan 🇯🇵",
  AUD: "Australia 🇦🇺",
  CAD: "Canada 🇨🇦",
  CHF: "Switzerland 🇨🇭",
  CNY: "China 🇨🇳",
  HKD: "Hong Kong 🇭🇰",
  SGD: "Singapore 🇸🇬",
  NZD: "New Zealand 🇳🇿",
  AED: "United Arab Emirates 🇦🇪",
  SAR: "Saudi Arabia 🇸🇦",
  PKR: "Pakistan 🇵🇰",
  BDT: "Bangladesh 🇧🇩",
  LKR: "Sri Lanka 🇱🇰",
  NPR: "Nepal 🇳🇵",
  AFN: "Afghanistan 🇦🇫",
  THB: "Thailand 🇹🇭",
  IDR: "Indonesia 🇮🇩",
  MYR: "Malaysia 🇲🇾",
  PHP: "Philippines 🇵🇭",
  KRW: "South Korea 🇰🇷",
  VND: "Vietnam 🇻🇳",
  TRY: "Turkey 🇹🇷",
  IRR: "Iran 🇮🇷",
  ILS: "Israel 🇮🇱",
  QAR: "Qatar 🇶🇦",
  KWD: "Kuwait 🇰🇼",
  OMR: "Oman 🇴🇲",
  BHD: "Bahrain 🇧🇭",
  ZAR: "South Africa 🇿🇦",
  EGP: "Egypt 🇪🇬",
  NGN: "Nigeria 🇳🇬",
  KES: "Kenya 🇰🇪",
  GHS: "Ghana 🇬🇭",
  BRL: "Brazil 🇧🇷",
  ARS: "Argentina 🇦🇷",
  CLP: "Chile 🇨🇱",
  COP: "Colombia 🇨🇴",
  MXN: "Mexico 🇲🇽",
  PEN: "Peru 🇵🇪",
  UYU: "Uruguay 🇺🇾",
  RUB: "Russia 🇷🇺",
  UAH: "Ukraine 🇺🇦",
  PLN: "Poland 🇵🇱",
  CZK: "Czech Republic 🇨🇿",
  HUF: "Hungary 🇭🇺",
  SEK: "Sweden 🇸🇪",
  NOK: "Norway 🇳🇴",
  DKK: "Denmark 🇩🇰",
  ISK: "Iceland 🇮🇸",
  RON: "Romania 🇷🇴",
  BGN: "Bulgaria 🇧🇬"
};

export function CurrencyConverter() {
  const [rates, setRates] = useState({});
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(res => res.json())
      .then(data => {
        setRates(data.rates);
        setCurrencies(Object.keys(data.rates));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const baseConverted = useMemo(() => {
    if (!rates[from]) return 0;
    return amount / rates[from];
  }, [amount, from, rates]);

  const finalAmount = useMemo(() => {
    if (!rates[to]) return 0;
    return (baseConverted * rates[to]).toFixed(2);
  }, [baseConverted, to, rates]);

  return (
    <div className="container">
      <h1>💱 Welcome to Vishal’s Exchange Currency</h1>

      {loading ? <p>Loading live rates...</p> : (
        <>
          <div className="converter-box">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />

            <select value={from} onChange={e => setFrom(e.target.value)}>
              {currencies.map(cur => (
                <option key={cur} value={cur}>
                  {cur} - {countryMap[cur] || "Global 🌍"}
                </option>
              ))}
            </select>

            <span>➡</span>

            <select value={to} onChange={e => setTo(e.target.value)}>
              {currencies.map(cur => (
                <option key={cur} value={cur}>
                  {cur} - {countryMap[cur] || "Global 🌍"}
                </option>
              ))}
            </select>
          </div>

          <h2 className="result">
            {finalAmount} {to}
          </h2>

          <div className="feedback-box">
            <h3>How was your experience?</h3>

            <div className="feedback-buttons">
              <button onClick={() => setFeedback("Excellent")}>😍 Excellent</button>
              <button onClick={() => setFeedback("Good")}>🙂 Good</button>
              <button onClick={() => setFeedback("Poor")}>😐 Poor</button>
            </div>

            <button
              className="submit-btn"
              onClick={() => feedback && setSubmitted(true)}
            >
              Submit
            </button>

            {submitted && (
              <p className="thanks-msg">
                Thanks for your feedback: <b>{feedback}</b> ❤️
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
