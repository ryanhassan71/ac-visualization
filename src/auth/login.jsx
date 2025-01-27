import { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { ThemeChanger } from "../redux/action";
import { Link, useNavigate } from "react-router-dom";
import desktoplogo from "../assets/images/brand-logos/dma-logo-gif.gif";
import desktopdarklogo from "../assets/images/brand-logos/desktop-dark.png";
import { loginAndGetToken } from "../acApi";
import { LocalStorageBackup } from "../components/common/switcher/switcherdata/switcherdata";


const Login = ({ ThemeChanger }) => {
  localStorage.clear();
  const [passwordshow1, setpasswordshow1] = useState(false);
  const [err, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = data;
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };
  const navigate = useNavigate();
  const routeChange = () => {
    const path = `${import.meta.env.BASE_URL}10/2/main`;
    navigate(path);
  };
  const Login1 = async () => {
    setIsLoading(true);
    try {
      // Call your login API
      await loginAndGetToken(email, password);
      // If successful, redirect the user:
      routeChange();
    } catch (error) {
      // Capture any errors in setError
      setError("Incorrect email and/or password.");
      // (Optional) Reset form data if you want:

    } finally {
      setIsLoading(false); // Stop spinner
    }
  };

  const Login = (e) => {
    z;
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        routeChange();
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      });
  };

  useEffect(() => {
    LocalStorageBackup(ThemeChanger);
  }, []);
  return (
    <Fragment>
      <div className="container">
        <div className="flex justify-center authentication authentication-basic items-center h-full text-defaultsize text-defaulttextcolor">
          <div className="grid grid-cols-12">
            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-8 col-span-12">
              <div className="my-[1.5rem] flex justify-center">
                <Link to={`${import.meta.env.BASE_URL}dashboards/crm/`}>
                  <img
                    src={desktoplogo}
                    alt="logo"
                    className="desktop-logo h-[38px] w-[100px]"
                  />
                  <img
                    src={desktopdarklogo}
                    alt="logo"
                    className="desktop-dark h-[38px] w-[100px]"
                  />
                </Link>
              </div>

              <div className="box !p-[3rem]">
                <div
                  className="box-body"
                  role="tabpanel"
                  id="pills-with-brand-color-01"
                  aria-labelledby="pills-with-brand-color-item-1"
                >
                  <p className="h5 font-semibold mb-2 text-center">Sign In</p>

                  {err && (
                    <div
                      className="alert-danger px-4 py-3 shadow-md mb-2 md:text-[0.8rem] text-[0.6rem]"
                      role="alert"
                    >
                      <div className="flex">
                        <div className="py-1"></div>
                        <div>{err}</div>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-12 gap-y-4">
                    <div className="xl:col-span-12 col-span-12">
                      <label
                        htmlFor="signin-username"
                        className="form-label text-default"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        className={
                          `form-control form-control-lg w-full !rounded-md
                           ${err ? "!border-red !border-2" : ""}`
                        }
                        onChange={changeHandler}
                        value={email}
                        id="signin-username"
                        placeholder="user name"
                      />
                    </div>
                    <div className="xl:col-span-12 col-span-12 mb-2">
                      <label
                        htmlFor="signin-password"
                        className="form-label text-default block"
                      >
                        Password
                        {/** forget password */}
                        {/* <Link
                          to={`${
                            import.meta.env.BASE_URL
                          }authentication/resetpassword/resetbasic`}
                          className="float-end text-danger"
                        >
                          Forget password ?
                        </Link> */}
                      </label>
                      <div className="input-group">
                        <input
                          type={passwordshow1 ? "text" : "password"}
                          className={
                            `form-control form-control-lg !rounded-s-md
                             ${err ? "!border-red !border-2" : ""}`
                          }
                          name="password"
                          placeholder="password"
                          value={password}
                          onChange={changeHandler}
                        />
                        <button
                          onClick={() => setpasswordshow1(!passwordshow1)}
                          aria-label="button"
                          className={`ti-btn ti-btn-light !rounded-s-none !mb-0 ${err ? "!border-red !border-2" : ""}`}
                          type="button"
                          id="button-addon2"
                        >
                          <i
                            className={`${
                              passwordshow1 ? "ri-eye-line" : "ri-eye-off-line"
                            } align-middle`}
                          ></i>
                        </button>
                      </div>
                      {/* Remember password */}
                      {/* <div className="mt-2">
                        <div className="form-check !ps-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="defaultCheck1"
                          />
                          <label
                            className="form-check-label text-[#8c9097] dark:text-white/50 font-normal"
                            htmlFor="defaultCheck1"
                          >
                            Remember password ?
                          </label>
                        </div>
                      </div> */}
                    </div>
                    <div className="xl:col-span-12 col-span-12 grid mt-2">
                      <button
                        className="    ti-btn
    !text-white
    !font-medium
    !bg-gradient-to-r
    !from-[#020739]
    !to-[#050a3b]
"
                        onClick={Login1}
                      >
                        {isLoading ? (
                          // Replace the "Sign In" text with a spinner
                          <div className="ti-spinner !h-[21px]" role="status">
                          <span className="sr-only">Loading...</span>
                      </div>
                        ) : (
                          "Sign In"
                        )}
                      </button>
                    </div>
                  </div>
                  {/* <div className="text-center">
                                        <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-4">Dont have an account? <Link to={`${import.meta.env.BASE_URL}firebase/signup`} className="text-primary">Sign Up</Link></p>
                                    </div> */}

                  <div className="btn-list text-center"></div>
                </div>
                <div
                  className="box-body hidden"
                  role="tabpanel"
                  id="pills-with-brand-color-02"
                  aria-labelledby="pills-with-brand-color-item-2"
                >
                  <p className="h5 font-semibold mb-2 text-center">Sign In</p>

                  <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal text-center">
                    Welcome back Jhon !
                  </p>

                  {err && (
                    <div
                      className="alert-danger px-4 py-3 shadow-md mb-2"
                      role="alert"
                    >
                      <div className="flex">
                        <div className="py-1"></div>
                        <div>{err}</div>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-12 gap-y-4">
                    <div className="xl:col-span-12 col-span-12">
                      <label
                        htmlFor="signin-username"
                        className="form-label text-default"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-lg w-full !rounded-md"
                        placeholder="user name"
                        value={email}
                        onChange={changeHandler}
                      />
                    </div>
                    <div className="xl:col-span-12 col-span-12 mb-2">
                      <label
                        htmlFor="signin-password"
                        className="form-label text-default block"
                      >
                        Password
                        <Link
                          to={`${
                            import.meta.env.BASE_URL
                          }authentication/resetpassword/resetbasic`}
                          className="float-end text-danger"
                        >
                          Forget password ?
                        </Link>
                      </label>
                      <div className="input-group">
                        <input
                          name="password"
                          type="password"
                          className="form-control form-control-lg !rounded-s-md"
                          placeholder="password"
                          value={password}
                          onChange={changeHandler}
                        />
                        <button
                          onClick={() => setpasswordshow1(!passwordshow1)}
                          aria-label="button"
                          className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                          type="button"
                          id="button-addon2"
                        >
                          <i
                            className={`${
                              passwordshow1 ? "ri-eye-line" : "ri-eye-off-line"
                            } align-middle`}
                          ></i>
                        </button>
                      </div>
                      <div className="mt-2">
                        <div className="form-check !ps-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="defaultCheck1"
                          />
                          <label
                            className="form-check-label text-[#8c9097] dark:text-white/50 font-normal"
                            htmlFor="defaultCheck1"
                          >
                            Remember password ?
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="xl:col-span-12 col-span-12 grid mt-2">
                      <Link
                        to="#"
                        className="ti-btn ti-btn-primary !bg-primary !text-white !font-medium"
                        onClick={Login}
                      >
                        Sign In
                      </Link>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-4">
                      Dont have an account?{" "}
                      <Link
                        to={`${
                          import.meta.env.BASE_URL
                        }authentication/signup/signupbasic`}
                        className="text-primary"
                      >
                        Sign Up
                      </Link>
                    </p>
                  </div>
                  <div className="text-center my-4 authentication-barrier">
                    <span>OR</span>
                  </div>
                  <div className="btn-list text-center">
                    <button
                      aria-label="button"
                      type="button"
                      className="ti-btn ti-btn-icon ti-btn-light me-[0.365rem]"
                    >
                      <i className="ri-facebook-line font-bold text-dark opacity-[0.7]"></i>
                    </button>
                    <button
                      aria-label="button"
                      type="button"
                      className="ti-btn ti-btn-icon ti-btn-light me-[0.365rem]"
                    >
                      <i className="ri-google-line font-bold text-dark opacity-[0.7]"></i>
                    </button>
                    <button
                      aria-label="button"
                      type="button"
                      className="ti-btn ti-btn-icon ti-btn-light"
                    >
                      <i className="ri-twitter-line font-bold text-dark opacity-[0.7]"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  local_varaiable: state,
});

export default connect(mapStateToProps, { ThemeChanger })(Login);
