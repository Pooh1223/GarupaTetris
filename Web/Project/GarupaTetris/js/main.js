const colors = ['#FF5151','#AE00AE','#0000C6','#02C874','#FF8000','#F9F900','#5B5B5B']
//red,purple,blue,green,orange,yellow,gray

//height,width per layer
const Width = 7;
const Height = 12;

//first two row for negative position situation

const Board = [];
const BlockId = [];


function init(){
	for(let i = 0;i < 12;++i){
		Board.push([]);

		for(let j = 0;j < 7;++j){
			Board[i].push({
				blockId : 0,
				colorId : 0,
				link : null
			});

			if(i > 1){
				var gridId = 'grid_';

				Board[i][j].link = document.getElementById(gridId + String((i - 2) * 7 + j + 1));
			}
		}
	}

	for(let i = 0;i < 45;++i){
		BlockId.push(0);
	}
}

function giveBlockId(){
	for(let i = 1;i < 45;++i){
		if(BlockId[i] == 0){
			return i;
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
		blockId : giveBlockId(),
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
				if(Board[i][j].colorId != 0) return false;
			}
		}
	}
}

function dropping(block){
	let oldBlock = {
		first : {x : block.first.x,y : block.first.y},
		second : {x : block.second.x,y : block.second.y},
		colorId : block.colorId,
		blockId : block.blockId,
		type : block.type,
	};

	if(block.type == 0){
		//vertivcal

		if(block.first.x + 1 >= Height || block.second.x + 1 >= Height
			|| Board[block.first.x + 1][block.first.y].colorId != 0
			|| Board[block.second.x + 1][block.second.y].colorId != 0){
			//hit the bottom or block

			if(block.first.x <= 1 || block.second.x <= 1){
				alert('you lose the game!');
				clearInterval(window.refreshId);
			} else {
				console.log('1\n\n');
				updateBoard(oldBlock,block);

				Board[block.first.x][block.first.y].colorId = block.colorId + 1;
				Board[block.second.x][block.second.y].colorId = block.colorId + 1;

				Board[block.first.x][block.first.y].blockId = block.blockId;
				Board[block.second.x][block.second.y].blockId = block.blockId;

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

		if(block.first.x + 1 >= Height || block.second.x + 1 >= Height
			|| Board[block.first.x + 1][block.first.y].colorId != 0
			|| Board[block.second.x + 1][block.second.y].colorId != 0){
			//hit the bottom or block

			if(block.first.x <= 1){
				alert('you lose the game!');
				clearInterval(window.refreshId);
			} else {
				updateBoard(oldBlock,block);

				Board[block.first.x][block.first.y].colorId = block.colorId + 1;
				Board[block.second.x][block.second.y].colorId = block.colorId + 1;

				Board[block.first.x][block.first.y].blockId = block.blockId;
				Board[block.second.x][block.second.y].blockId = block.blockId;

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

function moving(block,keyCode){
	let oldBlock = {
		first : {x : block.first.x,y : block.first.y},
		second : {x : block.second.x,y : block.second.y},
		colorId : block.colorId,
		blockId : block.blockId,
		type : block.type,
	};

	if(keyCode == 37 || keyCode == 39){
		//left , right

		if(block.type == 0){
			//vertical
			if(keyCode == 37){
				if(block.first.y == 0 || Board[block.first.x][block.first.y - 1].colorId != 0
					|| Board[block.second.x][block.second.y - 1].colorId != 0){

					//wall or already had block there

				} else {
					block.first.y -= 1;
					block.second.y -= 1;

					updateBoard(oldBlock,block);
				}
			} else {
				if(block.first.y == Width - 1 || Board[block.first.x][block.first.y + 1].colorId != 0
					|| Board[block.second.x][block.second.y + 1].colorId != 0){

					//wall or already had block there

				} else {
					block.first.y += 1;
					block.second.y += 1;

					updateBoard(oldBlock,block);
				}
			}
		} else {
			//horizontal

			if(keyCode == 37){
				if(block.first.y == 0 || Board[block.first.x][block.first.y - 1].colorId != 0
					|| Board[block.second.x][block.second.y - 1].colorId != 0){

					//wall or already had block there

				} else {
					block.first.y -= 1;
					block.second.y -= 1;

					updateBoard(oldBlock,block);
				}
			} else {
				if(block.first.y == Width - 1 || Board[block.first.x][block.first.y + 1].colorId != 0
					|| Board[block.second.x][block.second.y + 1].colorId != 0){

					//wall or already had block there

				} else {
					block.first.y += 1;
					block.second.y += 1;

					updateBoard(oldBlock,block);
				}
			}
		}

	} else if(keyCode == 38){
		//up
	} else if(keyCode == 40){
		//down
		dropping(block);
	}
}

function rotating(block){
	let oldBlock = {
		first : {x : block.first.x,y : block.first.y},
		second : {x : block.second.x,y : block.second.y},
		colorId : block.colorId,
		blockId : block.blockId,
		type : block.type,
	};

	if(block.type == 0){
		if(block.first.x < block.second.x){
			if(block.first.y != Width - 1 && Board[block.first.x][block.first.y + 1].colorId == 0){
				block.type = 1;
				block.second.x = block.first.x;
				block.second.y = block.first.y + 1;

				updateBoard(oldBlock,block);
			}
		} else {
			if(block.first.y != 0 && Board[block.first.x][block.first.y - 1].colorId == 0){
				block.type = 1;
				block.second.x = block.first.x;
				block.second.y = block.first.y - 1;

				updateBoard(oldBlock,block);
			}
		}
	} else {
		if(block.first.y < block.second.y){
			if(block.first.x != 0 && Board[block.first.x - 1][block.first.y].colorId == 0){
				block.type = 0;

				block.second.x = block.first.x - 1;
				block.second.y = block.first.y;

				updateBoard(oldBlock,block);
			}
		} else {
			if(block.first.x != Height - 1 && Board[block.first.x + 1][block.first.y].colorId == 0){
				block.type = 0;

				block.second.x = block.first.x + 1;
				block.second.y = block.first.y;

				updateBoard(oldBlock,block);
			}
		}
		
	}
}

function updateBoard(oldBlock,block){

	if(oldBlock.first.x > 1){
		Board[oldBlock.first.x][oldBlock.first.y].link.style.backgroundColor = '#FFFFFF';
	}

	if(oldBlock.second.x > 1){
		Board[oldBlock.second.x][oldBlock.second.y].link.style.backgroundColor = '#FFFFFF';
	} 

	//paint new block's color
	if(block.first.x > 1){
		Board[block.first.x][block.first.y].link.style.backgroundColor = colors[block.colorId];
	}
	
	if(block.second.x > 1){
		Board[block.second.x][block.second.y].link.style.backgroundColor = colors[block.colorId];
	}	
}

function gameProcess(){
	window.BLOCK = Object.assign({},createNewBlock());
	let again = true;

	window.refreshId = setInterval(dropping,1500,BLOCK);
	
}

window.addEventListener('keydown',function(key){
	console.log(key.keyCode);
	if(key.keyCode >= 37 && key.keyCode <= 40){
		moving(BLOCK,key.keyCode);
	} else if(key.keyCode == 32){
		rotating(BLOCK);
	}
	//pause(?)
})

init();

gameProcess();
//setInterval(gameProcess,500);