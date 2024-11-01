import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Homepage() {
	const [manga, setManga] = useState([]);
	const [covers, setCovers] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;

	const fetchManga = async () => {
		try {
			const { data } = await axios.get(
				`https://api.mangadex.org/manga?limit=52`,
			);
			setManga(data.data || []);
			console.log("Fetched Manga:", data.data);
		} catch (error) {
			Swal.fire(`${error}.\nPlease come back later.`);
		}
	};

	const fetchCoversByIds = async () => {
		try {
			const coverIds = manga
				.map(
					(item) =>
						item.relationships.find((rel) => rel.type === "cover_art")?.id
				)
				.filter((id) => id);

			const coverRequests = coverIds.map((id) =>
				axios.get(`https://api.mangadex.org/cover/${id}`)
			);
			const coverResponses = await Promise.all(coverRequests);

			const coverMap = coverResponses.reduce((acc, response) => {
				const fileName = response.data.data.attributes.fileName;
				const mangaId = response.data.data.relationships.find(
					(rel) => rel.type === "manga"
				)?.id;
				if (mangaId) {
					acc[
						mangaId
					] = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
				}
				return acc;
			}, {});

			setCovers(coverMap);
		} catch (error) {
			console.error("Error fetching covers:", error);
		}
	};

	useEffect(() => {
		fetchManga();
	}, []);

	useEffect(() => {
		if (manga.length > 0) {
			fetchCoversByIds();
		}
	}, [manga]);

	const totalPages = Math.ceil(manga.length / itemsPerPage);
	const currentItems = manga.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const paginate = (pageNumber) => {
		if (pageNumber < 1 || pageNumber > totalPages) return;
		setCurrentPage(pageNumber);
	};

	return (
		<>
			<div
				className="homepage container-flex"
				style={{ backgroundColor: "#E9EFEC", color: "#333333" }}>
				<section
					className="hero text-center py-5"
					style={{ backgroundColor: "#16423C", color: "#ffffff" }}>
					<h1 className="fs-1">TrackTaku</h1>
					<p className="fs-4" style={{ color: "#E9EFEC" }}>Track your manga reading progress</p>
				</section>

				<div className="container-md bg-white my-5 py-5">
					<div className="container row row-cols-3 row-cols-sm-2 row-cols-md-4 g-4 my-auto mx-auto align-items-start">
						{currentItems.map((item) => (
							<div
								key={item.id}
								className="col max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden align-items-start">
								<div
									className="card shadow-sm border-0 h-100"
									style={{
										overflow: "hidden",
										transform: "scale(1)",
										transition: "transform 0.3s ease",
									}}
									onMouseEnter={(e) =>
										(e.currentTarget.style.transform = "scale(1.05)")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.transform = "scale(1)")
									}>
									<img
										src={covers[item.id] || "https://via.placeholder.com/150"}
										className="card-img-top img-fluid"
										style={{
											width: "100%",
											height: "500px",
											objectFit: "cover",
										}}
										alt="Manga cover"
									/>
									<div className="card-body">
										<h5
											className="card-title"
											style={{
												whiteSpace: "nowrap",
												overflow: "hidden",
												textOverflow: "ellipsis",
											}}>
											{item.attributes?.title?.en || "Untitled"}
										</h5>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="pagination mt-4 text-center justify-content-center">
						<button
							className="btn btn-secondary mx-1"
							onClick={() => paginate(currentPage - 1)}
							disabled={currentPage === 1}>
							Previous
						</button>
						{Array.from({ length: totalPages }, (_, index) => (
							<button
								key={index + 1}
								onClick={() => paginate(index + 1)}
								className={`btn ${
									currentPage === index + 1 ? "btn-success" : "btn-secondary"
								} mx-1`}>
								{index + 1}
							</button>
						))}
						<button
							className="btn btn-secondary mx-1"
							onClick={() => paginate(currentPage + 1)}
							disabled={currentPage === totalPages}>
							Next
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
