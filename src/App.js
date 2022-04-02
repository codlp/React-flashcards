import React, { useState, useEffect, useRef } from 'react';
import FlashcardList from './FlashcardList';
import './app.css';
import axios from 'axios';

function App() {
  const [flashcards, setFlashcards] = useState([])
  const [categories, setCategories] = useState([])

  const categoryElement = useRef()
  const amountElement = useRef()

  // API call to get all the question categories
  useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then(res => {
        setCategories(res.data.trivia_categories)
      })
  }, [])

  useEffect(() => {
   
  }, [])

  // Transform HTML into text in order to avoid weird characters
  function decodeString(str) {
    const textArea = document.createElement('textarea')
    textArea.innerHTML= str
    return textArea.value
  }

  // API call to get questions and answers corresponding to the criteria (category and number of questions) selected by the user
  function handleSubmit(e) {
    e.preventDefault()
    axios
    .get('https://opentdb.com/api.php', {
      params: {
        amount: amountElement.current.value,
        category: categoryElement.current.value
      }
    })
    .then(res => {
      setFlashcards(res.data.results.map((questionItem, index) => {
        const answer = decodeString(questionItem.correct_answer)
        const options = [
          ...questionItem.incorrect_answers.map(a => decodeString(a)),
          answer
        ]
        return {
          // Add a timestamp to the question id so that it's unique
          id: `${index}-${Date.now()}`,
          question: decodeString(questionItem.question),
          answer: answer,
          options: options.sort(() => Math.random() - .5)
        }
      }))
    })
  }

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryElement}>
            {categories.map(category => {
              return <option value={category.id} key={category.id}>{category.name}</option>
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Number of Questions</label>
          <input type="number" id="amount" min="1" step="1" defaultValue={10} ref={amountElement} />
        </div>

        <div className="form-group">
          <button className="btn">Generate</button>
        </div>

      </form>
      
      <div className="container">
        <FlashcardList flashcards={flashcards} />
      </div>
    </>
  );
}

export default App;