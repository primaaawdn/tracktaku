import axios from "axios";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAAS3HW0JQRNWaBArIZvizCMiffwkTk54I");

const GeminiRecom = () => {
	const [userPrompt, setUserPrompt] = useState("");
	const [recommendation, setRecommendation] = useState("");
	const [mangaList, setMangaList] = useState([]);
	const [isExpanded, setIsExpanded] = useState(false);
	const maxLength = 100;
	const maxDisplay = 5;

	const fetchMangaList = async () => {
		try {
			const response = await axios.get(
				"https://api.mangadex.org/manga?limit=100"
			);
			setMangaList(response.data.data);
		} catch (error) {
			console.error("Error fetching manga list:", error);
		}
	};

	const getRecommendation = async () => {
		if (!userPrompt) return;

		try {
			const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
			const result = await model.generateContent(userPrompt);
			setRecommendation(result.response.text());
		} catch (error) {
			console.error("Error generating recommendation:", error);
		}
	};

	const handleInputChange = (e) => {
		setUserPrompt(e.target.value);
	};

	const handleRecommendationClick = () => {
		fetchMangaList();
		getRecommendation();
	};

	const removeBoldText = (text) => {
		return text.replace(/\*\*.*?\*\*/g, "").trim();
	};

	const cleanRecommendation = removeBoldText(recommendation);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const getRandomMangaList = (mangas) => {
		const shuffled = mangas.sort(() => 0.5 - Math.random());
		return shuffled.slice(0, maxDisplay);
	};

	const randomMangaList = getRandomMangaList(mangaList);

	return (
		<div className="container my-4">
			<div className="card shadow-lg">
				<div className="card-body">
					<div className="mb-3">
						<input
							type="text"
							className="form-control"
							placeholder="Tell Gemini what kind of manga you like to read"
							value={userPrompt}
							onChange={handleInputChange}
						/>
					</div>

					<div className="text-center mb-4">
						<button
							className="btn btn-success"
							onClick={handleRecommendationClick}>
							Ask Gemini
						</button>
					</div>

					{cleanRecommendation && (
						<div>
							<strong>Recommendation:</strong>{" "}
							{isExpanded
								? cleanRecommendation
								: `${cleanRecommendation.substring(0, maxLength)}...`}
							{cleanRecommendation.length > maxLength && (
								<span
									style={{
										cursor: "pointer",
										color: "green",
										textDecoration: "underline",
									}}
									onClick={toggleExpand}>
									{isExpanded ? " Show Less" : " Read More"}
								</span>
							)}
						</div>
					)}

					<div className="mt-4">
						<h3 className="text-center">List of Manga Recommendations</h3>
						<ul className="list-group list-group-flush mt-3">
							{randomMangaList.length > 0 ? (
								randomMangaList.map((manga) => (
									<li className="list-group-item" key={manga.id}>
										{manga.attributes.title.en || "Unknown Title"}
									</li>
								))
							) : (
								<li className="list-group-item text-center">No manga found</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GeminiRecom;
