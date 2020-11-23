import {useContext} from 'react';
import {Context} from '../utility/provider.js';
import {toggleAdmin, togglePage} from '../utility/callbacks';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';

const MenuButton = withStyles({
  root: {
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: '#0062cc',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#0062cc',
      borderColor: '#005cbf',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
  },
})(Button);

const Header = () => {
  const {state, dispatch} = useContext(Context);

  return (
    <header className="Header">
      <nav className="navBar">
        <MenuButton className="navBarItem" onClick={togglePage(dispatch, "EXAMS")}>
          Tentit
        </MenuButton>
        <MenuButton className="navBarItem" onClick={togglePage(dispatch, "EXAMS")}>
          Tietoa sovelluksesta
        </MenuButton>
        <MenuButton className="navBarItem" onClick={togglePage(dispatch, "VISUALIZATION")}>
          Visualisaatio
        </MenuButton>
        {!state.admin ? 
          <MenuButton className="navBarItem" onClick={toggleAdmin(dispatch)}>
            Admin-tilaan vaihto
          </MenuButton>
          :
          <MenuButton className="navBarItem" onClick={toggleAdmin(dispatch)}>
            Pois admin-tilasta
          </MenuButton>
        }
        <MenuButton className="navBarItem exitButton" onClick={togglePage(dispatch, "EXAMS")}>
          Kirjaudu ulos
        </MenuButton>
      </nav>
    </header>
  );
}

export default Header;