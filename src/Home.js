import logo from './logo.svg';
import './style.css';
import React from "react";
import { Link } from 'react-router-dom';
import {
HashRouter as Router,
Routes,
Route,
} from "react-router-dom";

function Home() {
  return (
  <div className="app">
    <header>TLCommander</header>
		<hr />
		<div id="main">
			
			<div id="description">
				開発の役に立ちそうな小ツールの集合体です<br />
				サイトデザインは無いです
			</div>
			
			<hr />
			<div id="list">
				<a href="./tools/itemInTheChest/index.html">計算機:チェストのアイテム期待値</a><br />
				<a href="./tools/shapesgeneratorhelper/index.html">ツール:ShapesGeneratorHelper</a><br />
				<a href="./tools/ParticleShifter/index.html">ツール:ParticleShifter</a><br />
				<a href="./#/Tools_TwoPointSelector/">ツール:2点間セレクタ</a><br />
				<a href="./#/Tools_ImageToKillEffect/">ツール:画像をキルエフェクト変換</a>
			</div>
			
		</div>
	</div>
  );
}

export default Home;
