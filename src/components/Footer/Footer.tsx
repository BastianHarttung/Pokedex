import './Footer.scss';
import { FaGithub } from "react-icons/fa";
import packageJson from "../../../package.json"


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_content">
        <div className="copyright">
          <a href="https://pokeapi.co/" target="_blank">API by Pokeapi.co</a>
        </div>

        <div className="copyright">
          <div>©20{packageJson.version} by</div>
          <a href="https://github.com/BastianHarttung"
             target="_blank">
            Bastian Harttung
            <FaGithub size={24}/>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
