const Footer = () => {
  return (
    <footer>
      <div className="f-info text-center py-4">
        <div className="f-info-socials mb-2">
          <i className="fa-brands fa-square-facebook"></i> 
          <i className="fa-brands fa-square-instagram"></i> 
          <i className="fa-brands fa-square-twitter"></i> 
        </div>
        <div className="f-info-brand">&copy; StayFinder Private Limited 2026</div>
        <div className="f-info-links">
          <a href="/Privacy">Privacy</a> &nbsp;&nbsp;
          <a href="/Terms">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;