// Display navigation header
const Header = ({adminMode, handleAdminClick}) => {
  return (
    <header className="Header">
      <nav className="navBar">
        <div className="navBarItem">Tentit</div>
        <div className="navBarItem">Tietoa sovelluksesta</div>
        {adminMode ? <div onClick={handleAdminClick} className="navBarItem exitButton" background-color="blue">Admin</div> : <div onClick={handleAdminClick} className="navBarItem exitButton" background-color="dark blue">Admin</div>}
        <div className="navBarItem exitButton">Poistu</div>
      </nav>
    </header>
  );
}

export default Header;