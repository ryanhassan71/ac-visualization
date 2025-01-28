import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/common/loader/loader';
import Footer from '../components/common/footer/footer';
import Sidebar from '../components/common/sidebar/sidebar';
import Switcher from '../components/common/switcher/switcher';
import Header from '../components/common/header/header';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import store from '../redux/store';
import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Tabtotop from '../components/common/tabtotop/tabtotop';


function App() {
  
  const [MyclassName, setMyClass] = useState("");
  const navigate = useNavigate();

  // const Bodyclickk = () => {
  //   if (localStorage.getItem("ynexverticalstyles") == "icontext") {
  //     setMyClass("");
  //   }
  //   if (window.innerWidth > 992) {
  //     let html = document.documentElement;
  //     if (html.getAttribute('icon-overlay') === 'open') {
  //         html.setAttribute('icon-overlay' ,"");
  //     }
  //   }
  // }


 
  useEffect(() => {
    import("preline");

  }, []);

  useEffect(() => {
    // 2) Check for token in localStorage

    const storedAuthData = localStorage.getItem('appAuthData');
    
    // If nothing is stored, or if it's invalid JSON, redirect to login
    if (!storedAuthData) {
      navigate(`/auth/login/`);
      return; 
    }
    

  }, []);
  return (
    <Fragment>
      <Loader/>
      <Provider store={store}>
        <HelmetProvider>
          <Helmet
            htmlAttributes={{
              lang: "en",
              dir: "ltr",
              "data-menu-styles": "dark",
              "class": "light",
              "data-nav-layout": "vertical",
              "data-header-styles": "light",
              "data-vertical-style": "overlay",
              "loader": "disable",
              "data-icon-text": MyclassName,
            }}
          />
          <Switcher />
          <div className='page'>
            <Header />
            <Sidebar/>
            <div className='content main-index'>
              <div className='main-content'
                // onClick={Bodyclickk}
              >
                <Outlet />
              </div>
            </div>
            <Footer />
          </div>
          <Tabtotop/>
        </HelmetProvider>
      </Provider>
    </Fragment>
  );
}

export default App;
