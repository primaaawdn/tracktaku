import { createBrowserRouter, redirect } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Homepage from "./pages/Homepage";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import Manga from "./pages/Manga";
import MangaDetail from "./pages/MangaDetail";
// import UserPage from "./pages/UserPage";
// import AllUser from "./pages/AllUser";

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
	// {
	// 	path: "/my-list",
	// 	element: <RootLayout />,
	// 	loader: () => {
	// 		const access_token = localStorage.getItem("access_token");
	// 		if (!access_token) {
	// 			throw redirect("/login");
	// 		}
	// 		return null;
	// 	},
	// },

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
			{
				path: "manga/:id",
				element: <MangaDetail />,
			},
		],
	},
	// {
	// 	path: "/user",
	// 	element: <RootLayout />,
	// 	loader: () => {
	// 		const access_token = localStorage.getItem("access_token");
	// 		if (!access_token) {
	// 			throw redirect("/login");
	// 		}
	// 		return null;
	// 	},
	// 	children: [
	// 		{
	// 			path: "user/:id",
	// 			element: <UserPage />,
	// 		},
	// 	],
	// },
]);
