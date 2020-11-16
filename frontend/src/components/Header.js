import {useContext} from 'react';
import {Context} from '../utility/provider.js';
import {toggleAdmin} from '../utility/callbacks';

const Header = () => {
  const {state, dispatch} = useContext(Context);

  return (
    <header className="Header">
      <nav className="navBar">
        <div className="navBarItem">Tentit</div>
        <div className="navBarItem">Tietoa sovelluksesta</div>
        {state.admin ? 
          <div onClick={toggleAdmin(dispatch)} className="navBarItem exitButton" background-color="blue">User</div> : 
          <div onClick={toggleAdmin(dispatch)} className="navBarItem exitButton" background-color="dark blue">Admin</div>}
        <div className="navBarItem exitButton">Poistu</div>
      </nav>
    </header>
  );
}

export default Header;