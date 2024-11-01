import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import GeminiRecom from "./GeminiRecom";

export default function Navbar() {
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [showRecomModal, setShowRecomModal] = useState(false); 
	const { id } = useParams();

	const fetchUser = async () => {
		try {
			const token = localStorage.getItem("access_token");
			if (!token) return;

			const { data } = await axios.get(
				`http://localhost:80/user/${id}`
			);
			setUser(data.data);
		} catch (error) {
			console.error("Failed to fetch user data:", error);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("access_token");
		setIsLoggedIn(!!token);
		if (token) fetchUser();
	}, []);

	const toggleModal = () => setShowModal((prev) => !prev);
	const toggleRecomModal = () => setShowRecomModal((prev) => !prev);

	const handleLogout = () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("user_id");
		setIsLoggedIn(false);
		navigate("/");
	};

	return (
		<>
			<nav
				className="navbar navbar-expand-lg sticky-top py-4"
				style={{
					backgroundColor: "#16423C",
					color: "#FFFFFF",
					fontFamily: "Arial, sans-serif",
					boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
				}}>
				<div className="container-fluid">
					{isLoggedIn ? (
						<Link
							className="navbar-brand d-flex align-items-center text-light"
							to="/manga">
							<img
								src="./assets/TrackTaku.svg"
								height={30}
								alt="TrackTaku Logo"
								loading="lazy"
								style={{ marginRight: "8px" }}
							/>
						</Link>
					) : (
						<Link
							className="navbar-brand d-flex align-items-center text-light"
							to="/">
							<img
								src="./assets/TrackTaku.svg"
								height={30}
								alt="TrackTaku Logo"
								loading="lazy"
								style={{ marginRight: "8px" }}
							/>
						</Link>
					)}

					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarContent"
						aria-controls="navbarContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
						style={{ border: "none" }}>
						<i className="fas fa-bars text-light" />
					</button>

					<div className="collapse navbar-collapse" id="navbarContent">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							{isLoggedIn && (
								<li className="nav-item">
									<Link
										className="nav-link text-light px-3"
										to="/mylist"
										style={{ fontSize: "1rem" }}>
										My Reading List
									</Link>
								</li>
							)}
						</ul>
						<div className="d-flex align-items-center">
							{isLoggedIn ? (
								<>
									<span
										className="nav-link text-light ms-3"
										onClick={toggleModal}
										style={{ fontSize: "1rem", cursor: "pointer" }}>
										Profile
									</span>
									<span
										className="nav-link text-light ms-3"
										onClick={toggleRecomModal}
										style={{ fontSize: "1rem", cursor: "pointer" }}>
										Gemini AI
									</span>
									<span
										className="nav-link text-light ms-3"
										onClick={handleLogout}
										style={{ fontSize: "1rem", cursor: "pointer" }}>
										Sign Out
									</span>
								</>
							) : (
								<Link
									className="nav-link text-light ms-3"
									to="/user/login"
									style={{
										fontSize: "1rem",
										padding: "8px 12px",
										borderRadius: "20px",
										backgroundColor: "#1D5C50",
										textDecoration: "none",
									}}>
									Sign In
								</Link>
							)}
						</div>
					</div>
				</div>
			</nav>

			{showModal && (
				<div className="modal fade show d-block" tabIndex="-1" role="dialog">
					<div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">User Profile</h5>
								<button
									type="button"
									className="btn-close"
									onClick={toggleModal}
									aria-label="Close"
								/>
							</div>
							<div className="modal-body">
								{user ? (
									<div className="container d-flex justify-content-center mt-3">
										<div className="card p-3">
											<div className="top-container d-flex align-items-center">
												<div className="ml-3">
													<h5 className="name">{user.name} : {user.username}</h5>
													<p className="mail">{user.email}</p>
												</div>
											</div>
										</div>
									</div>
								) : (
									<p>Loading...</p>
								)}
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={toggleModal}>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{showRecomModal && (
				<div className="modal fade show d-block" tabIndex="-1" role="dialog">
					<div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<button
									type="button"
									className="btn-close"
									onClick={toggleRecomModal}
									aria-label="Close"
								/>
							</div>
							<div className="modal-body">
								<GeminiRecom />
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={toggleRecomModal}>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
