
import React, {useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom';
const Navbar = () => {
  let location = useLocation();
  useEffect(()=>{
    console.log(location.pathname);
  }, [location]); 
  return (
    <div>
<nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <Link className="navbar-brand" to="/">iNote</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="/navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarScroll">
      <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"style={{ '--bs-scroll-height': '100px' }}>
        <li className="nav-item">
          <Link className={`nav-link ${location.pathname === "/"? "active": ""}`}  aria-current="page" to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link ${location.pathname === "/about"? "active": ""}`}to="/about">About</Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
    </div>
  )
}

export default Navbar