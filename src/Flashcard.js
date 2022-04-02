import React, { useState, useEffect, useRef } from 'react';

export default function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false)
  const [height, setHeight] = useState('initial')

  const frontElement = useRef()
  const backElement = useRef()

  // Card has a flexible height
  function setMaxHeight() {
    const frontHeight = frontElement.current.getBoundingClientRect().height
    const backHeight = backElement.current.getBoundingClientRect().height
    // Card has a minimum height of 100px and a maximum height of whichever is higher between the front height and the back height
    setHeight(Math.max(frontHeight, backHeight, 100))
  }

  // Change the card's height when the question, the answer, the options or the size of the user's window changes
  useEffect(setMaxHeight, [flashcard.question, flashcard.answer, flashcard.options])
  useEffect(() => {
    window.addEventListener('resize', setMaxHeight)
    return () => window.removeEventListener('resize', setMaxHeight)
  }, [])

  return (
    <div
      // Dynamic class depending on if the card is flipped or not
      className={`card ${flip ? 'flip' : ''}`}
      // Dynamic height
      style={{ height: height }}
      onClick={() => setFlip(!flip)}
    >
      <div className="front" ref={frontElement}>
        {flashcard.question}

        <div className="flashcard-options">
          {flashcard.options.map(option => {
            return <div className="flashcard-option" key={option}>{option}</div>
          })}
        </div>

      </div>

      <div className="back" ref={backElement}>{flashcard.answer}</div>
    </div>
  )
}