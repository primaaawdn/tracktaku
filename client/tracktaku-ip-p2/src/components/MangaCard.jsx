export default function MangaCard() {
	return (
		<>
			<div className="container-flex row row-cols-3 g-4">
				<div className="col-md-4 mb-4">
					<div className="card shadow-sm border-0">
						<img
							src="https://via.placeholder.com/150"
							className="card-img-top"
							alt="Card image"
						/>
						<div className="card-body">
							<h5 className="card-title">Card Title 1</h5>
							<p className="card-text">
								This is a quick example of a card that you can use in your
								project.
							</p>
							<a href="#" className="btn btn-primary w-100">
								Learn More
							</a>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
