// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import Cart from './Cart';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/cart" component={Cart} />
//         {/* Other routes */}
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import React from 'react';
import Cart from './Cart';
import './index.css';

const App = () => {
  return (
    <div className="App">
      <Cart />
    </div>
  );
};

export default App;

