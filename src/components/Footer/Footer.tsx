import './Footer.scss';
import { FaGithub } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_content">
        <div className="copyright">
          <a href="https://pokeapi.co/" target="_blank">API by Pokeapi.co</a>
        </div>

        <div className="copyright">
          <div>© by Bastian Harttung</div>
          <a href="https://github.com/BastianHarttung"
             target="_blank">
            <FaGithub size={24}/>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
