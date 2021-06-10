import React, { useEffect, useState } from "react";
import "./App.css";

const arrayRandomiser = (array: string[]) =>
  array.sort(() => 0.5 - Math.random());

function Question({
  question,
  setAnswer,
}: {
  question: QuestionModel;
  setAnswer: (id: number, answer: string) => void;
}) {
  const answers = arrayRandomiser(
    question.incorrect_answers.concat(question.correct_answer)
  );

  return (
    <section>
      <h2>
        {question.question}{" "}
        {question.correct !== undefined ? (question.correct ? "✔" : "❌") : ""}{" "}
      </h2>
      <ul>
        {answers.map((a) => (
          <li key={a}>
            <label>
              <input
                type="radio"
                name={question.question}
                onChange={() => setAnswer(question.id, a)}
              />
              &nbsp;{a}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

type QuestionModel = {
  id: number;
  correct_answer: string;
  incorrect_answers: string[];
  question: string;
  correct: boolean;
};

type AnswerModel = {
  [key: number]: string;
};

function App() {
  const [questions, setQuestions] = useState<QuestionModel[]>([]);
  const [answers, setAnswers] = useState<AnswerModel>({});

  useEffect(() => {
    const getQuestions = async () => {
      const res = await fetch("/api/get-questions");
      const questions = await res.json();

      setQuestions(questions);
    };

    getQuestions();
  }, []);

  const saveAnswer = (questionId: number, answer: string) => {
    setAnswers((answers) => {
      answers[questionId] = answer;

      return answers;
    });
  };

  const submitAnswers = async () => {
    const res = await fetch("/api/submit-answers", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        Object.keys(answers).map((key) => ({
          questionId: key,
          answer: answers[Number(key)],
        }))
      ),
    });
    if (res.ok) {
      setQuestions((questions) => {
        const questionsWithAnswers = [];
        for (const q of questions) {
          if (answers[q.id]) {
            questionsWithAnswers.push({
              ...q,
              correct: answers[q.id] === q.correct_answer,
            });
          } else {
            questionsWithAnswers.push(q);
          }
        }
        return questionsWithAnswers;
      });
    }
  };

  if (!questions.length) {
    <div className="App">
      <header className="App-header">
        <h1>Loading...</h1>
      </header>
    </div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        {questions.map((q) => (
          <Question question={q} key={q.id} setAnswer={saveAnswer} />
        ))}

        <button onClick={submitAnswers}>Save Answers</button>
      </header>
    </div>
  );
}

export default App;
