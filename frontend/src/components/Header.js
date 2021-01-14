import {useContext} from 'react';
import {Context} from '../utility/provider.js';
import {toggleAdmin, togglePage, changeLanguage} from '../utility/callbacks';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';

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
          <FormattedMessage id="header_exams"/>
        </MenuButton>
        <MenuButton className="navBarItem" onClick={togglePage(dispatch, "EXAMS")}>
          <FormattedMessage id="header_info"/>
        </MenuButton>
        <MenuButton className="navBarItem" onClick={togglePage(dispatch, "VISUALIZATION")}>
          <FormattedMessage id="header_visualization"/>
        </MenuButton>
        {!state.admin ? 
          <MenuButton className="navBarItem" onClick={toggleAdmin(dispatch)}>
            <FormattedMessage id="header_admin_switch_admin"/>
          </MenuButton>
          :
          <MenuButton className="navBarItem" onClick={toggleAdmin(dispatch)}>
            <FormattedMessage id="header_admin_switch_user"/>
          </MenuButton>
        }
        {
          state.language === "fi" ?
            <MenuButton className="navBarItem languageButton" onClick={changeLanguage(dispatch, "en")}>
              <FormattedMessage id="language_selector_en"/>
            </MenuButton>
            :
            <MenuButton className="navBarItem languageButton" onClick={changeLanguage(dispatch, "fi")}>
              <FormattedMessage id="language_selector_fi"/>
            </MenuButton>
        }
        
        <MenuButton className="navBarItem exitButton" onClick={togglePage(dispatch, "EXAMS")}>
          <FormattedMessage id="header_logout"/>
        </MenuButton>
      </nav>
    </header>
  );
}

export default Header;