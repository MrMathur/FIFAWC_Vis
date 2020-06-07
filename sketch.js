let mappa;

let dataToShow = [];

let sketchL = (p) => {

	p.preload = () => {
		p.data = p.loadTable('./data.csv', 'csv', 'header');
		p.country = p.loadTable('country.csv', 'csv', 'header');
	}

	p.setup = () => {
		p.canvas = p.createCanvas(p.windowWidth/2,p.windowHeight);
		p.canvas.parent('c1');

		mappa = new Mappa('Leaflet');

		p.myMap = mappa.tileMap({
			lat: 0,
			lng: 0,
			zoom: 1.5,
			style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
		});

		p.myMap.overlay(p.canvas);

		for (let worldcup of p.data.rows) {
			let result = p.country.rows.find(p => p.obj.name == worldcup.obj.Country).obj;

			dataToShow.push({
				latitude: result.latitude,
				longitude: result.longitude,
				year: worldcup.obj.Year,
				name: result.name
			});
		}

		p.size = 4;
	}

	p.draw = () => {
		p.clear();

		for (let worldcup of dataToShow) {
			p.toDraw = p.myMap.latLngToPixel(worldcup.latitude, worldcup.longitude);
			let d = p.int(p.dist(p.mouseX, p.mouseY,p.toDraw.x,p.toDraw.y));
			if (d<p.size*p.myMap.zoom()) {
				worldcup.showText = true;	
			} else {
				worldcup.showText = false;
			}
			if (worldcup.showText) {
				p.textSize(16);
				p.textAlign(p.CENTER,p.CENTER);
				p.noStroke();
				p.fill(18);
				p.text(worldcup.name, p.toDraw.x, p.toDraw.y + 15);	
			}

			p.fill(0,255,0);
			p.noStroke();	
			p.ellipse(p.toDraw.x, p.toDraw.y, p.size*p.myMap.zoom(), p.size*p.myMap.zoom());
			worldcup.y = p.toDraw.y;
			worldcup.size = p.size*p.myMap.zoom();
			worldcup.x = p.toDraw.x;

		}
	}
}

let sketchR = (p) => {
	p.setup = () => {
		p.canvas = p.createCanvas(p.windowWidth/2,p.windowHeight);
		p.canvas.parent('c2');

		console.log(dataToShow);
	}

	p.draw = () => {
		p.background(255);
		for (let worldcup of dataToShow) {
			if (worldcup.x > 0 && worldcup.x < p.width) {
				let x = p.map(worldcup.year, 1930, 2018, 80, p.width-80);

				p.fill(0,255,0);
				p.noStroke();
				p.ellipse(x,worldcup.y,worldcup.size,worldcup.size);	

				let d =p.int(p.dist(p.mouseX, p.mouseY, x, worldcup.y));
				if (d<worldcup.size) {
					worldcup.showText = true;
				}

				if (worldcup.showText) {
					p.textSize(16);
					p.textAlign(p.CENTER,p.CENTER);
					p.noStroke();
					p.fill(18);
					p.text(worldcup.name, x, worldcup.y + 15);	
					p.text(worldcup.year, x, p.height - 90)
				}
			}
		}

		p.stroke(18);
		p.strokeWeight(2);
		p.line(80,p.height - 100,p.width-80, p.height - 100);

		p.textSize(32);
		p.textAlign(p.CENTER,p.CENTER);
		p.noStroke();
		p.fill(18);
		p.text('FIFA WORLD CUP HOSTS', p.width/2, 35);

		p.textSize(16);
		p.text('1930', 80, p.height - 90);
		p.text('2018', p.width - 80, p.height - 90);
	}
}

let myp5 = new p5(sketchL);
let other = new p5(sketchR);
