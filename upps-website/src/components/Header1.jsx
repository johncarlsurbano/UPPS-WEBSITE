import '../styles/Header1.css';

export const Header1 = () =>{
    return(
        <div className="header1">
            <div className="navbar1">
                <div className="navbar1-content"></div>
            </div>
            <div className="navbar2">
                <div className="navbar2-content">
                    <div className="navbar2-content-upps-logo">
                        <img src="" alt="" />
                    </div>
                    <div className="navbar2-content-links">
                        <a href="">Home</a>
                        <a href="">About Us</a>
                        <a href="">Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
}