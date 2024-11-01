import { createBrowserRouter, redirect } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Homepage from "./pages/Homepage";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import Manga from "./pages/Manga";
import MyList from "./pages/MyList";

export const router = createBrowserRouter([
	{
		path: "/user/login",
		element: <LoginRegisterPage />,
	},
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				path: "",
				element: <Homepage />,
			},
		],
	},
	{
		path: "/mylist",
		element: <RootLayout />,
		loader: () => {
			const access_token = localStorage.getItem("access_token");
			if (!access_token) {
				throw redirect("/login");
			}
			return null;
		},
		children: [
			{
				path: "",
				element: <MyList />,
			},
		],
	},

	{
		path: "/manga",
		element: <RootLayout />,
		loader: () => {
			const access_token = localStorage.getItem("access_token");
			if (!access_token) {
				throw redirect("/login");
			}
			return null;
		},
		children: [
			{
				path: "",
				element: <Manga />,
			},
		],
	},
]);
