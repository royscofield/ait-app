import { useEffect } from "react";

module.exports = {
  isEmail: (email) => {
    if ((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) && !(email.length === 0)) {
      return false;
    }
    return true;
  },
  hasWhiteSpaceAndValidLength: (s) => {
    return (s.indexOf(" ") >= 0 || s.length < 6) && !(s.length === 0);
  },
  enoughNumCountPass: (s) => {
    return (s.length < 6 && !(s.length === 0))
  },
  isEmpty: (s) => {
    return s === "" || s.length === 0;
  },
  isLoggedIn: (user) => {
    if(Object.keys(user).length === 0){
      alert("Please Log In to access to this feature!")
      return false//False: chưa đăng nhập / đã đăng xuất
    }
  },
  pressEscToClose: (setState, value) => {
    // setState is a state updating function. For example, [showMenu, setShowMenu] is a state to handle show/hide menu. Then you will pass setShowMenu and new state's value to this function so whenever Esc is pressed, it will use the setShowMenu to change the state to value.
    useEffect(() => {
      const handleEscape = (event) => {
          if (event.keyCode === 27) {
              setState(value)
          }
      }
      window.addEventListener('keydown', handleEscape);
      return () => {
        window.removeEventListener('keydown', handleEscape);
      };
    }, [])
  },
  logo: "https://cdn.123job.vn/123job/uploads/2019/09/18/2019_09_18______f334ace51b475d2c562648c2ee9058d3.png",
};
