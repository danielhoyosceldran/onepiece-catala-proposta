import { NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  return (
    <header className={"navbar" + (isLanding ? " navbar-transparent" : "")}>
      <NavLink to="/" className="navbar-brand">
        <img src="/brand/one_piece_catala_logo.png" alt="One Piece Cat" className="navbar-logo" />
      </NavLink>
      <nav className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}>
          Inici
        </NavLink>
        <NavLink to="/capitols" className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}>
          Capítols
        </NavLink>
      </nav>
    </header>
  );
}
