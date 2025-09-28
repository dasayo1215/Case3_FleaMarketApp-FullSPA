// import lodash
import _ from "lodash";
window._ = _;

// import axios
import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
