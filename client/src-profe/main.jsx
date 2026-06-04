import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import CartPage from './hooks/useContext/CartPage.jsx';
import Card from './ejemplos/Card.jsx';
import OnOff from './ejemplos/OnOff.jsx';
import UseStateExample from './hooks/UseStateExample.jsx';
import FollowButton from './hooks/FollowButton.jsx';
import ProductFilter from './hooks/ProductFilter.jsx';
import UseEffectExample from './hooks/UseEffectExample.jsx';
import CartPage from './hooks/useContext/CartPage.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <UseStateExample  /> */}
    {/* <FollowButton /> */}
    {/* <UseEffectExample /> */}
    {/* <ProductFilter />  */}
    {/* <CartPage /> */}
    <App />




    {/* <OnOff /> */}
    {/* <ProductCard /> */}
    {/* <TwitterCard userName='jperez' initialIsFollowing={false} >
      @ssanchez
    </TwitterCard> */}
    {/* <Card userName='jSuarez' onFollow='true' formatUserName={(name) => `@${name.toLowerCase()}`}>
      <p>Me gustan los deportes</p>
    </Card>
    <Card userName='jperez' onFollow='true' formatUserName={(name) => name.toUpperCase()}>
      <p>Me gustan la tecnología</p>
      <div>
        <a href="">Link a Instagram</a>
      </div>
      <div>
        <a href="">Link a Instagram</a>
      </div>
      <OnOff />
    </Card>
    <Card userName='hperez' onFollow='true' formatUserName={(name) => name.toUpperCase()}>
      <p>Me gustan viajar</p>
    </Card>     */}

  </StrictMode>,
)
