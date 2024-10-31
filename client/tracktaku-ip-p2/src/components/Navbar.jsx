import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);

	const fetchUser = async () => {
		try {
			const { data } = await axios.get("https://tracktaku.primawidiani.online/user/all");
			setUser(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("access_token");
		setIsLoggedIn(!!token);
		if (token) {
			fetchUser();
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("access_token");
		setIsLoggedIn(false);
		navigate("/");
	};

	return (
		<nav
			className="navbar navbar-expand-lg sticky-top py-4"
			style={{
				backgroundColor: "#16423C",
				color: "#FFFFFF",
				fontFamily: "Arial, sans-serif",
				boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
			}}
		>
			<div className="container-fluid">
				<Link className="navbar-brand d-flex align-items-center text-light" to="/">
					<img
						src="./assets/TrackTaku.svg"
						height={30}
						alt="TrackTaku Logo"
						loading="lazy"
						style={{ marginRight: "8px" }}
					/>
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarContent"
					aria-controls="navbarContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
					style={{ border: "none" }}
				>
					<i className="fas fa-bars text-light" />
				</button>

				<div className="collapse navbar-collapse" id="navbarContent">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						{isLoggedIn && (
							<li className="nav-item">
								<Link className="nav-link text-light px-3" to="/my-list" style={{ fontSize: "1rem" }}>
									My Reading List
								</Link>
							</li>
						)}
					</ul>
					<div className="d-flex align-items-center">
						{isLoggedIn ? (
							<>
								<Link
									className="nav-link text-light ms-3"
									to={`/user/${user?.id}`}
									style={{ fontSize: "1rem", position: "relative" }}
								>
									Profile
								</Link>
								<Link
									className="nav-link text-light ms-3"
									onClick={handleLogout}
									style={{ fontSize: "1rem", cursor: "pointer" }}
								>
									Sign Out
								</Link>
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
								}}
							>
								Sign In
							</Link>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
