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
  const navigate = useNavigate();

  // Update state as user types
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  // Actual sign-in logic
  const Login1 = async () => {
    setIsLoading(true);
    try {
      await loginAndGetToken(email, password);
      // If successful, redirect the user
      navigate(`${import.meta.env.BASE_URL}10/2/main`);
    } catch (error) {
      setError("Incorrect email and/or password.");
    } finally {
      setIsLoading(false);
    }
  };

  // Form submission handler: triggers the same sign-in logic
  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent page refresh
    Login1();
  };

  useEffect(() => {
    LocalStorageBackup(ThemeChanger);
  }, [ThemeChanger]);

  return (
    <Fragment>
      <div className="container">
        <div className="flex justify-center authentication authentication-basic items-center h-full text-defaultsize text-defaulttextcolor">
          <div className="grid grid-cols-12">
            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2" />
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
                        <div className="py-1" />
                        <div>{err}</div>
                      </div>
                    </div>
                  )}

                  {/*
                    Wrap the input fields and button in a form so that
                    pressing Enter triggers the same login logic.
                  */}
                  <form onSubmit={handleSubmit}>
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
                          required
                        />
                      </div>
                      <div className="xl:col-span-12 col-span-12 mb-2">
                        <label
                          htmlFor="signin-password"
                          className="form-label text-default block"
                        >
                          Password
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
                            required
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
                      </div>
                      <div className="xl:col-span-12 col-span-12 grid mt-2">
                        {/*
                          Use type="submit" so that hitting Enter
                          submits the form & calls handleSubmit -> Login1.
                        */}
                        <button
                          type="submit"
                          className="ti-btn !text-white !font-medium !bg-gradient-to-r !from-[#020739] !to-[#050a3b]"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="ti-spinner !h-[21px]" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                          ) : (
                            "Sign In"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>

                </div>
              </div>
            </div>
            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2" />
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
