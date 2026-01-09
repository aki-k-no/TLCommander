import logo from './logo.svg';
import './style.css';
import React from "react";
import { Link } from 'react-router-dom';
import {
HashRouter as Router,
Routes,
Route,
} from "react-router-dom";
import Home from './Home.js';
import TwoPointSelector from './tools/TwoPointSelector.js';
import ImageToKillEffect from "./tools/ImageToKillEffect.js";

function App() {
  return (
  <div className="app">
		<Router>
			<Routes>
				<Route element={<Home />} />
				<Route path="/" element={<Home />} />
				<Route path="/Tools_TwoPointSelector" element={<TwoPointSelector />} />
				<Route path="/Tools_ImageToKillEffect" element={<ImageToKillEffect />} />
			</Routes>
		</Router>
	</div>
  );
}

export default App;
