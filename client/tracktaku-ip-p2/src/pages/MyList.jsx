import { useState, useEffect } from "react";
import axios from "axios";

export default function MyList() {
	const [myList, setMyList] = useState([]);

	const fetchMyList = async () => {
		try {
			const { data } = await axios.get("https://tracktaku.primawidiani.online/manga/mylist", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("access_token")}`,
				},
			});
			setMyList(data || []);
		} catch (error) {
			console.error("Error fetching my list:", error);
		}
	};

	useEffect(() => {
		fetchMyList();
	}, []);

	return (
		<div className="container mt-5 text-center">
			<h2>My Reading List</h2>
			<div className="row">
				{myList.map((item) => (
					<div key={item.id} className="col-md-4 mb-4">
						<div className="card">
							<img
								src={`https://uploads.mangadex.org/covers/${item.mangaId}/${item.coverFileName}`}
								className="card-img-top"
								alt="Manga cover"
							/>
							<div className="card-body">
								<h5 className="card-title">{item.title}</h5>
								<p className="card-text">
									<strong>Progress:</strong> Chapter {item.progress}
								</p>
								<p className="card-text">
									<strong>Status:</strong> {item.progress > 0 ? "Reading" : "Not Started"}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
