import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import FeedbackForm from './components/FeedbackForm';
import ListEntityForm from './components/ListEntityForm';
import { contractAddress, contractABI } from './contractData';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
    <h1>Feedback DApp</h1>
    <ListEntityForm /> {/* Render the ListEntityForm component */}
    <FeedbackForm /> {/* Render the FeedbackForm component */}
</div>
  )
}

export default App;
