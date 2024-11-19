import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Main from "./components/Main";
import SideBar from "./components/SideBar";

function App() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);

	function handleToggleModal() {
		setShowModal(!showModal);
	}

	useEffect(() => {
		async function fetchAPIData() {
			const API_KEY = import.meta.env.VITE_NASA_API_KEY;
			const url = "https://api.nasa.gov/planetary/apod" + `?api_key=${API_KEY}`;

			const today = new Date().toDateString();
			const localKey = `NASA-${today}`;
			if (localStorage.getItem(localKey)) {
				const apiDate = JSON.parse(localStorage.getItem(localKey));
				setData(apiDate);
				console.log("Fetched data from local cached storage today ");
				return;
			}
			localStorage.clear();
			try {
				const response = await fetch(url);
				const apiData = await response.json();
				localStorage.setItem(localKey, JSON.stringify(apiData));
				setData(apiData);
				console.log("Fetched data from API today " + apiData);
			} catch (err) {
				console.error(err);
			}
		}
		fetchAPIData();
	}, []);
	return (
		<>
			{data ? (
				<Main data={data} />
			) : (
				<div className="loadingstate">
					<i className="fa-solid fa-spinner"></i>
				</div>
			)}
			{showModal && (
				<SideBar data={data} handleToggleModal={handleToggleModal} />
			)}
			{data && <Footer data={data} handleToggleModal={handleToggleModal} />}
		</>
	);
}

export default App;
