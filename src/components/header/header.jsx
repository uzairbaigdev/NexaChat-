import "./header.css";

function Header() {
  return (
    <header className="header">
      <nav className="navbar">

        <div className="logo-con">
          <div className="logo-icon">N</div>

          <div className="logo-text">
            <h3>Nexa</h3>
            <span>Real-Time Messaging</span>
          </div>
        </div>

        <ul className="nav-links">
          <li>Home</li>
          <li>Features</li>
          <li>Solutions</li>
          <li>Developers</li>
          <li>Pricing</li>
        </ul>

        <div className="nav-auth">
          <button className="login-btn">
            Login
          </button>

          <button className="start-btn">
            Start Chatting
          </button>
        </div>

      </nav>
    </header>
  );
}

export default Header;