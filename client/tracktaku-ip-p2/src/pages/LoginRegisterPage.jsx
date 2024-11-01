import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

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
				"http://localhost:80/user/login",
				{
					email,
					password,
				}
			);
			localStorage.setItem("access_token", response.data.access_token);
			navigate("/manga");
		} catch (error) {
			Swal.fire(`${error}.\nPlease come back later.`)
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
				"http://localhost:80/user/register",
				userData
			);
			Swal.fire("Registration successful");
			setActiveTab("login");
		} catch (error) {
			Swal.fire(`${error}.\nPlease come back later.`);
		}
	};

	async function handleCredentialResponse(response) {
		try {
			console.log("Encoded JWT ID token: " + response.credential);
			const { data } = await axios.post(
				`http://localhost:80/user/google-login`, null,
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
				<ul className="nav nav-pills nav-justified mb-3">
					<li className="nav-item">
						<button
							className={`btn ${activeTab === "login" ? "active btn-success" : ""}`}
							onClick={() => setActiveTab("login")}>
							Login
						</button>
					</li>
					<li className="nav-item">
						<button
							className={`btn ${activeTab === "register" ? "active btn-success" : ""}`}
							onClick={() => setActiveTab("register")}>
							Register
						</button>
					</li>
				</ul>

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
									className="btn btn-success btn-block mb-4">
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
											style={{ cursor: "pointer", color: "green" }}>
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
									className="btn btn-success btn-block mb-3">
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
