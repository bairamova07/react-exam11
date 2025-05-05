
import { useState } from "react";
import axios from "axios";

const GeminiSearch = () => {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState([]); 
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSearch = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResponse("");

    try {
      const res = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD5esYIRPMG4yU9QwWLO0__ImVJW023BHo",
        {
          contents: [
            {
              parts: [{ text: input }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const generatedText =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        setResponse(generatedText);
        setQuestions([input, ...questions]);
      } else {
        setResponse("Жауап бос немесе құрылымы дұрыс емес.");
      }
    } catch (err) {
      console.error(err);
      setError("Gemini API-ге сұраныс кезінде қате шықты.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Gemini AI Іздеу</h2>

      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Сұрағыңызды жазыңыз"
        style={{ width: "300px", padding: "8px" }}
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        style={{ marginLeft: "10px", padding: "8px 12px" }}
      >
        {loading ? "Жүктелуде..." : "Іздеу"}
      </button>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {response && (
        <div style={{ marginTop: "1.5rem", whiteSpace: "pre-wrap" }}>
          <h3>Жауап:</h3>
          <p>{response}</p>
        </div>
      )}

      {questions.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Қойылған сұрақтар:</h3>
          <ul>
            {questions.map((q, index) => (
              <li key={index}>{q}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GeminiSearch;
