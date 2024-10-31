// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";

// import App from "./App";
// import { store } from "./redux/store";
// import { Provider } from "react-redux";

// const rootElement = document.getElementById("root");
// const root = createRoot(rootElement);

// root.render(
//   <StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </StrictMode>
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App.jsx";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
	<StrictMode>
		<GoogleOAuthProvider clientId="983946789523-grl8f08nibjto9jl20e5r6mk2ikv3li0.apps.googleusercontent.com">
		<App />
		</GoogleOAuthProvider>
	</StrictMode>
);