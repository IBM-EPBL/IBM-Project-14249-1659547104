import Head from "next/head";
import axios from "axios";

import { ChakraProvider, Heading, Flex, IconButton } from "@chakra-ui/react";

import Nav from "../components/Nav";
import UploadAndDisplayImage from "../components/UploadAndDisplayImage";

import { useRef, useState } from "react";

const navItems = [
	{
		label: "Home",
		href: "/",
	},
	{
		label: "Classify",
		href: "/classify",
	},
	{
		label: "About",
		children: [
			{
				label: "About the WebApp",
				// subLabel: "Find your dream design job",
				href: "/about-webapp",
			},
			{
				label: "About the Team",
				// subLabel: "An exclusive list for contract work",
				href: "/about-team",
			},
		],
	},
];

export default function Home() {
	const [selectedImage, setSelectedImage] = useState(null);
	const [ans, setAns] = useState("");
	const [fruit, setFruit] = useState("");

	const sendDataToParent = (image) => {
		// console.log(image);
		setSelectedImage(image);
	};

	const toBase64 = (file) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});

	async function sendFileToBackend() {
		console.log("TEST...");
		setFruit("Loading...");

		var imgData = "";
		var bodyFormData = new FormData();

		try {
			imgData = await toBase64(selectedImage);
		} catch (error) {
			console.error(error);
		}
		console.log("Img data");
		console.log(imgData);

		console.log("img data type: ");
		console.log(typeof imgData);

		bodyFormData.append("imageString", imgData);

		const headers = {
			"Content-Type": "multipart/form-data",
			"Access-Control-Allow-Origin": "*",
		};

		axios
			.post("http://localhost:5000/api/classify", bodyFormData, {
				headers: headers,
			})
			.then((response) => {
				console.log(response);
				setFruit(response.data.fruit);
				setAns(response.data.listItems);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	return (
		<ChakraProvider>
			<div>
				<Head>
					<title>APNA - Classify</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Nav NAV_ITEMS={navItems} />
				<Flex height="30vh" alignItems="center" justifyContent="center">
					<Heading as="h1" size="4xl" noOfLines={1} textColor="green.400">
						Classify
					</Heading>
				</Flex>
				<Flex height="50vh" justifyContent="center">
					<UploadAndDisplayImage
						sendDataToParent={sendDataToParent}
						sendFileToBackend={sendFileToBackend}
					/>
				</Flex>
				<Flex height="5vh" justifyContent="center">
					{fruit}
				</Flex>
				<Flex height="5vh" justifyContent="center">
					{ans}
				</Flex>
			</div>
		</ChakraProvider>
	);
}
