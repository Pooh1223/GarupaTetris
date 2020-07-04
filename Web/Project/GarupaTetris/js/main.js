const colors = ['#FF5151','#AE00AE','#0000C6','#02C874','#FF8000','#F9F900','#5B5B5B']
//red,purple,blue,green,orange,yellow,gray

//height,width per layer
const Width = 7;
const Height = 12;

//first two row for negative position situation

const Board = [
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0]
];

var BoardLink = [];

function init(){
	for(let i = 0;i < 12;++i){
		BoardLink.push([]);

		if(i > 1){
			for(let j = 0;j < 7;++j){
				var gridId = 'grid_';

				BoardLink[i][j] = document.getElementById(gridId + String((i - 2) * 7 + j + 1));
			}
		}
		
	}
}

function giveColor(){
	let index = Math.floor(Math.random() * Math.floor(7));
	return index;
}

function createNewBlock(){
	//always vertical,0 for vertical, 1 for horizontal
	let block = {
		first : {x : 0,y : 3},
		second : {x : 1,y : 3},
		colorId : giveColor(),
		type : 0,
		firstTurn : true
	};
	return block;
}

function checkAlive(nowHeight){
	if(nowHeight < 8) return true;
	else {
		for(let i = 0;i < 2;++i){
			for(let j = 0;j < Height;++j){
				//Game over
				if(Board[i][j] != 0) return false;
			}
		}
	}
}

function dropping(block){
	let oldBlock = {
		first : {x : block.first.x,y : block.first.y},
		second : {x : block.second.x,y : block.second.y},
		colorId : block.colorId,
		type : block.type,
		firstTurn : true
	};

	if(block.type == 0){
		//vertivcal

		if(block.second.x + 1 >= Height || Board[block.second.x + 1][block.second.y] != 0){
			//hit the bottom or block

			if(block.first.x <= 1){
				alert('you lose the game!');
				clearInterval(window.refreshId);
			} else {
				console.log('1\n\n');
				updateBoard(oldBlock,block);

				Board[block.first.x][block.first.y] = block.colorId + 1;
				Board[block.second.x][block.second.y] = block.colorId + 1;

				clearInterval(window.refreshId);
				gameProcess();
				//return newBlock : block;
			}

		} else {
			//keep dropping

			block.first.x += 1;
			block.second.x += 1;

			console.log('2\n\n');
			console.log('old:\n')
			console.log(oldBlock.first.x);
			console.log(oldBlock.first.y);
			console.log(oldBlock.second.x);
			console.log(oldBlock.second.y + '\n\n');

			console.log('new:\n')
			console.log(block.first.x);
			console.log(block.first.y);
			console.log(block.second.x);
			console.log(block.second.y + '\n\n');

			updateBoard(oldBlock,block);

			//return {newBlock : block,again : true};
		}

	} else {
		//horizontal

		if(block.second.x + 1 >= Height || Board[block.second.x + 1][block.second.y] != 0){
			//hit the bottom or block

			if(block.first.x <= 1){
				alert('you lose the game!');
				clearInterval(window.refreshId);
			} else {
				updateBoard(oldBlock,block);

				Board[block.first.x][block.first.y] = block.colorId + 1;
				Board[block.second.x][block.second.y] = block.colorId + 1;

				clearInterval(window.refreshId);
				gameProcess();
				//return {newBlock : block,again : false};
			}

		} else {
			//keep dropping

			block.first.x += 1;
			block.second.x += 1;

			updateBoard(oldBlock,block);

			//return {newBlock : block,again : true};
		}
	}
	
}

function updateBoard(oldBlock,block){
	//clear old block's color
	// console.log('old:\n')
	// console.log(oldBlock.first.x);
	// console.log(oldBlock.first.y);
	// console.log(oldBlock.second.x);
	// console.log(oldBlock.second.y + '\n\n');

	// console.log('new:\n')
	// console.log(block.first.x);
	// console.log(block.first.y);
	// console.log(block.second.x);
	// console.log(block.second.y + '\n\n');

	if(oldBlock.first.x > 1){
		BoardLink[oldBlock.first.x][oldBlock.first.y].style.backgroundColor = '#FFFFFF';
	}

	if(oldBlock.second.x > 1){
		BoardLink[oldBlock.second.x][oldBlock.second.y].style.backgroundColor = '#FFFFFF';
	} 

	//paint new block's color
	if(block.first.x > 1){
		BoardLink[block.first.x][block.first.y].style.backgroundColor = colors[block.colorId];
	}
	
	if(block.second.x > 1){
		BoardLink[block.second.x][block.second.y].style.backgroundColor = colors[block.colorId];
	}	
}

function gameProcess(){
	let block = Object.assign({},createNewBlock());
	let again = true;

	window.refreshId = setInterval(dropping,1500,block);
	
}

init();

gameProcess();
//setInterval(gameProcess,500);