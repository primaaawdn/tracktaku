import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginRegisterPage() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [activeTab, setActiveTab] = useState("login");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"https://tracktaku.primawidiani.online/user/login",
				{
					email,
					password,
				}
			);
			localStorage.setItem("access_token", response.data.access_token);
			navigate("/manga");
		} catch (error) {
			console.error("Login failed. Please retry.", error);
		}
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			const userData = {
				username,
				email,
				password,
				role: "User",
			};
			await axios.post(
				"https://tracktaku.primawidiani.online/user/register",
				userData
			);
			console.log("Registration successful");
			setActiveTab("login");
		} catch (error) {
			console.error("Registration failed. Please retry.", error);
		}
	};

	async function handleCredentialResponse(response) {
		try {
			console.log("Encoded JWT ID token: " + response.credential);
			const { data } = await axios.post(
				`https://tracktaku.primawidiani.online/user/google-login`,
				{
					headers: {
						token: response.credential,
					},
				}
			);
			localStorage.setItem("access_token", `Bearer ${data.access_token}`);
			navigate("/manga");
		} catch (error) {
			console.log("🚀 ~ handleCredentialResponse ~ error:", error);
		}
	}

	useEffect(() => {
		window.google.accounts.id.initialize({
			client_id:
				"983946789523-grl8f08nibjto9jl20e5r6mk2ikv3li0.apps.googleusercontent.com",
			callback: handleCredentialResponse,
		});
		window.google.accounts.id.renderButton(
			document.getElementById("buttonDiv"),
			{ theme: "outline", size: "large" }
		);
		window.google.accounts.id.prompt();
	}, []);

	return (
		<div className="container-fluid d-flex justify-content-center align-items-center py-5">
			<div className="border border-2 rounded-2 w-50 p-5 text-center">
				{/* Tab Navigation */}
				<ul className="nav nav-pills nav-justified mb-3">
					<li className="nav-item">
						<button
							className={`nav-link ${activeTab === "login" ? "active" : ""}`}
							onClick={() => setActiveTab("login")}>
							Login
						</button>
					</li>
					<li className="nav-item">
						<button
							className={`nav-link ${activeTab === "register" ? "active" : ""}`}
							onClick={() => setActiveTab("register")}>
							Register
						</button>
					</li>
				</ul>

				{/* Tab Content */}
				<div className="tab-content">
					{activeTab === "login" && (
						<div className="tab-pane fade show active">
							<form onSubmit={handleLogin}>
								<div className="form-outline mb-4">
									<input
										type="email"
										className="form-control"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Email"
										required
									/>
								</div>
								<div className="form-outline mb-4">
									<input
										type="password"
										className="form-control"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Password"
										required
									/>
								</div>
								<button
									type="submit"
									className="btn btn-primary btn-block mb-4">
									Sign in
								</button>

								<div className="justify-item-center mb-4">
									<div id="buttonDiv"></div>
								</div>

								<div className="text-center">
									<p>
										Not a member?{" "}
										<span
											onClick={() => setActiveTab("register")}
											style={{ cursor: "pointer", color: "blue" }}>
											Register
										</span>
									</p>
								</div>
							</form>
						</div>
					)}

					{activeTab === "register" && (
						<div className="tab-pane fade show active">
							<form onSubmit={handleRegister}>
								<div className="mb-3">
									<p>Sign up with:</p>
									<button type="button" className="btn btn-secondary mx-1">
										<i className="fab fa-google" />
									</button>
								</div>
								<p className="text-center">or:</p>
								<div className="form-outline mb-4">
									<input
										type="text"
										className="form-control"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										placeholder="Username"
										required
									/>
								</div>
								<div className="form-outline mb-4">
									<input
										type="email"
										className="form-control"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Email"
										required
									/>
								</div>
								<div className="form-outline mb-4">
									<input
										type="password"
										className="form-control"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Password"
										required
									/>
								</div>
								<button
									type="submit"
									className="btn btn-primary btn-block mb-3">
									Register
								</button>
							</form>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
