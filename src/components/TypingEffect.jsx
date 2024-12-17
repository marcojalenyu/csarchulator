import React, { useState, useEffect } from 'react';

const TypingEffect = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(displayedText + text[index]);
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
        const resetTimeout = setTimeout(() => {
            setDisplayedText('');
            setIndex(0);
        }, speed * 10);
        return () => clearTimeout(resetTimeout);
    }
  }, [index, text, displayedText, speed]);

  if (index === text.length) {
    return <span className='fs-5 m-2'>{displayedText}</span>;
  }

  return <span className='fs-5 m-2'>{displayedText}<span className="cursor"></span></span>;
};

export default TypingEffect;