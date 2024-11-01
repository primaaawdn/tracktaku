import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

export default function Homepage() {
	const [manga, setManga] = useState([]);
	const [covers, setCovers] = useState({});
	const [authors, setAuthors] = useState({});
	const [myList, setMyList] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;
	const [modalShow, setModalShow] = useState(false);
	const [selectedManga, setSelectedManga] = useState(null);

	const fetchManga = async () => {
		try {
			const { data } = await axios.get(
				"https://api.mangadex.org/manga?limit=52"
			);
			setManga(data.data || []);
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

	const fetchAuthorsByIds = async () => {
		try {
			const authorIds = manga
				.map(
					(item) => item.relationships.find((rel) => rel.type === "author")?.id
				)
				.filter((id) => id);

			const authorRequests = authorIds.map((id) =>
				axios.get(`https://api.mangadex.org/author/${id}`)
			);
			const authorResponses = await Promise.all(authorRequests);

			const authorMap = authorResponses.reduce((acc, response) => {
				const authorName = response.data.data.attributes.name;
				const mangaId = response.data.data.relationships.find(
					(rel) => rel.type === "manga"
				)?.id;
				if (mangaId) {
					acc[mangaId] = authorName;
				}
				return acc;
			}, {});

			setAuthors(authorMap);
		} catch (error) {
			console.error("Error fetching authors:", error);
		}
	};

	const handleAddToList = async (id) => {
		const mangaData = {
			userId: 1,
			mangaId: id,
			status: "reading",
			progress: 0,
			userRating: 0,
		};
		try {
			const response = await axios.post(
				"https://tracktaku.primawidiani.online/manga/add",
				mangaData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("access_token")}`,
					},
				}
			);
			if (response.status === 201) {
				setMyList((prevList) => [
					...prevList,
					{
						id,
						title: manga.find((item) => item.id === id)?.attributes.title.en,
					},
				]);
				console.log("Manga added to My List:", id);
			}
		} catch (error) {
			console.error("Error adding to list:", error);
		}
	};

	const handleViewDetail = (mangaId) => {
		const mangaDetail = manga.find((item) => item.id === mangaId);
		setSelectedManga(mangaDetail);
		setModalShow(true);
	};

	const closeModal = () => {
		setModalShow(false);
		setSelectedManga(null);
	};

	useEffect(() => {
		fetchManga();
	}, []);

	useEffect(() => {
		if (manga.length > 0) {
			fetchCoversByIds();
			fetchAuthorsByIds();
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
					<p style={{ color: "#E9EFEC" }}>Track your manga reading progress</p>
				</section>

				<div className="container-md bg-white my-5 py-5">
					<div className="container row row-cols-3 row-cols-sm-2 row-cols-md-4 g-4 my-auto mx-auto align-items-start">
						{currentItems.map((item) => (
							<div
								key={item.id}
								className="col max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden align-items-start">
								<div className="card shadow-sm border-0 h-100">
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
									<div className="card-body text-center">
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
									<button
										className="btn btn-success my-1"
										onClick={() => handleAddToList(item.id)}
										disabled={myList.some((manga) => manga.id === item.id)}>
										{myList.some((manga) => manga.id === item.id)
											? "Added to My List"
											: "Add to My List"}
									</button>
									<button
										className="btn btn-outline-success"
										onClick={() => handleViewDetail(item.id)}>
										Detail
									</button>
								</div>
							</div>
						))}
					</div>

					{modalShow && selectedManga && (
						<MangaDetailModal
							manga={selectedManga}
							covers={covers}
							authors={authors}
							onClose={closeModal}
						/>
					)}

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

function MangaDetailModal({ manga, authors, covers, onClose }) {
	const coverUrl = covers[manga.id]
		? covers[manga.id]
		: "https://via.placeholder.com/150";

	return (
		<div className="modal show d-block">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header d-flex p-2 mx-auto">
						<h5 className="modal-title">{manga.attributes.title.en}</h5>
						<button
							type="button"
							className="btn-close"
							onClick={onClose}></button>
					</div>
					<div className="modal-body">
						<div className="image text-center mb-3">
							<img
								src={coverUrl}
								className="img-fluid"
								alt={manga.attributes.title.en}
							/>
						</div>
						<p>
							<strong>Title:</strong> <br />
							{manga.attributes.title.en || "Unknown"}
						</p>
						<p>
							<strong>Description:</strong>
							<br />
							{manga.attributes.description.en || "No description available."}
						</p>
						<p>
							<strong>Author:</strong> <br />
							{authors[manga.id] || "Unknown"}
						</p>
						<p>
							<strong>Publication Date:</strong>{" "}
							{manga.attributes.year || "Unknown"}
						</p>
						<p>
							<strong>Pub. Demographic:</strong>{" "}
							{manga.attributes.publicationDemographic || "Unknown"}
						</p>
						<p>
							<strong>Last Chapter:</strong>{" "}
							{manga.attributes.lastChapter || "Unknown"}
						</p>
						<p>
							<strong>Status:</strong> {manga.attributes.status || "Unknown"}
						</p>
					</div>
					<div className="modal-footer justify-content-center">
						<button
							type="button"
							className="btn btn-secondary"
							onClick={onClose}>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

MangaDetailModal.propTypes = {
	manga: PropTypes.object.isRequired,
	authors: PropTypes.object.isRequired,
	covers: PropTypes.object.isRequired,
	onClose: PropTypes.func.isRequired,
};
