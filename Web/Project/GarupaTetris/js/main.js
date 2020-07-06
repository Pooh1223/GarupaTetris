const colors = ['#FF5151','#AE00AE','#0000C6','#02C874','#FF8000','#F9F900','#5B5B5B']
//red,purple,blue,green,orange,yellow,gray

//height,width per layer
const Width = 7;
const Height = 12;

//first two row for negative position situation

const Board = [];
const BlockId = [];

//creation functions

function init(){

	for(let i = 0;i < 12;++i){
		Board.push([]);

		for(let j = 0;j < 7;++j){
			Board[i].push({
				blockId : 0,
				colorId : 0,
				number : 0,
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
			BlockId[i] = 1;
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
		type : 0
	};
	return block;
}

//validaty functions

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

// clear blocks function

function boom(x,y){
	if(x < 2 || y < 0 || x >= Height || y >= Width) return true;
	else return false;
}

function findBlock(stx,sty){
	//used block
	var tmpBoard = [];

	//to store the past postion
	var posRecord = [];

	var queue = [];
	var cnt = 0;
	const dx = [0,0,1,-1];
	const dy = [1,-1,0,0];
	

	for(let i = 0;i < Height;++i){
		tmpBoard.push([]);
		for(let j = 0;j < Width;++j){
			tmpBoard[i].push(false);
		}
	}

	tmpBoard[stx][sty] = true;
	queue.unshift({x : stx , y : sty , colorId : Board[stx][sty].colorId});
	posRecord.unshift({x : stx , y : sty});
	cnt += 1;

	while(queue.length != 0){
		let coor = queue.pop();

		for(let i = 0;i < 4;++i){
			let tmp = {
				x : coor.x + dx[i],
				y : coor.y + dy[i],
				colorId : coor.color
			};

			//console.log(tmp.x + " " + tmp.y + " : " + boom(tmp.x,tmp.y));
			// if(boom(tmp.x,tmp.y) == false){
			// 	console.log(tmpBoard[tmp.x][tmp.y]);
			// 	console.log(coor.colorId);
			// }

			if(boom(tmp.x,tmp.y) == false && tmpBoard[tmp.x][tmp.y] == false
				&& Board[tmp.x][tmp.y].colorId == coor.colorId){

				console.log("in");
				queue.unshift({x : tmp.x,y : tmp.y,colorId : coor.colorId});
				posRecord.unshift({x : tmp.x,y : tmp.y});
				tmpBoard[tmp.x][tmp.y] = true;
				cnt++;
			}
		}
	}

	console.log("pos : " + posRecord.length);

	if(cnt >= 6){
		//return the block pos that should be clear
		return posRecord;
	} else {
		return [];
	}
}

function droppingAfterClear(){
	const dx = [0,0,1,-1];
	const dy = [1,-1,0,0];

	for(let i = Height - 1;i >= 2;--i){
		for(let j = 0;j < Width;++j){
			if(Board[i][j].colorId != 0){
				//find which block is paired

				for(let k = 0;k < 4;++k){
					let tx = i + dx[k];
					let ty = j + dy[k];

					if(boom(tx,ty) == false && Board[tx][ty].blockId == Board[i][j].blockId){
						let tmpBlock = {
							first : {x : 0,y : 0},
							second : {x : 0,y : 0},
							colorId : Board[i][j].colorId,
							blockId : Board[i][j].blockId,
							type : (k < 2 ? 1 : 0)
						};

						//check which is first block

						if(Board[i][j].number == 1 && Board[tx][ty].number == 2){
							tmpBlock.first.x = i;
							tmpBlock.first.y = j;
							tmpBlock.second.x = tx;
							tmpBlock.second.y = ty;
						} else if(Board[tx][ty].number == 1 && Board[i][j] == 2){
							tmpBlock.first.x = tx;
							tmpBlock.first.y = ty;
							tmpBlock.second.x = i;
							tmpBlock.second.y = j;
						}

						dropping(tmpBlock,'droppingAfterClear');
					}
				}
			}
		}
	}
}

function clearBlock(){

	for(let i = Height - 1;i >= 2;--i){
		for(let j = 0;j < Width;++j){
			if(Board[i][j].colorId != 0){
				//bfs
				let clearBlocks = findBlock(i,j);

				for(let k = 0;k < clearBlocks.length;++k){
					let tmp = Board[clearBlocks[k].x][clearBlocks[k].y].blockId;

					BlockId[tmp] = 0;
					Board[clearBlocks[k].x][clearBlocks[k].y].number = 0;
					Board[clearBlocks[k].x][clearBlocks[k].y].blockId = 0;
					Board[clearBlocks[k].x][clearBlocks[k].y].colorId = 0;
					Board[clearBlocks[k].x][clearBlocks[k].y].link.style.backgroundColor = '#FFFFFF';
				}

				console.log("clearBlocks : " + String(clearBlocks.length));

				if(clearBlocks.length != 0){
					droppingAfterClear();
				}
			}
		}
	}
}

//moving blocks functions

function dropping(block,whereItCalled){
	let oldBlock = {
		first : {x : block.first.x,y : block.first.y},
		second : {x : block.second.x,y : block.second.y},
		colorId : block.colorId,
		blockId : block.blockId,
		type : block.type
	};

	if(block.type == 0){
		//vertivcal

		if(block.first.x + 1 >= Height || block.second.x + 1 >= Height
			|| Board[block.first.x + 1][block.first.y].colorId != 0
			|| Board[block.second.x + 1][block.second.y].colorId != 0){
			//hit the bottom or block

			if(block.first.x <= 1 || block.second.x <= 1){
				alert('you lose the game!');

				if(whereItCalled == 'gameProcess'){
					clearInterval(window.refreshId);
				}
			} else {
				console.log('1\n\n');
				updateBoard(oldBlock,block);

				Board[block.first.x][block.first.y].colorId = block.colorId + 1;
				Board[block.first.x][block.first.y].number = 1;
				Board[block.second.x][block.second.y].colorId = block.colorId + 1;
				Board[block.second.x][block.second.y].number = 2;

				Board[block.first.x][block.first.y].blockId = block.blockId;
				Board[block.second.x][block.second.y].blockId = block.blockId;

				if(whereItCalled == 'gameProcess'){
					clearInterval(window.refreshId);
					clearBlock();
					gameProcess();
				}
				
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

			if(whereItCalled == 'droppingAfterClear'){
				dropping(block,whereItCalled);
			}

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

				if(whereItCalled == 'gameProcess'){
					clearInterval(window.refreshId);
				}
			} else {
				updateBoard(oldBlock,block);

				Board[block.first.x][block.first.y].colorId = block.colorId + 1;
				Board[block.first.x][block.first.y].number = 1;
				Board[block.second.x][block.second.y].colorId = block.colorId + 1;
				Board[block.second.x][block.second.y].number = 2;

				Board[block.first.x][block.first.y].blockId = block.blockId;
				Board[block.second.x][block.second.y].blockId = block.blockId;

				if(whereItCalled == 'gameProcess'){
					clearInterval(window.refreshId);
					clearBlock();
					gameProcess();
				}
				//return {newBlock : block,again : false};
			}

		} else {
			//keep dropping

			block.first.x += 1;
			block.second.x += 1;

			updateBoard(oldBlock,block);

			if(whereItCalled == 'droppingAfterClear'){
				droppingAfterClear(block,whereItCalled);
			}

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

//painting functions

function updateBoard(oldBlock,block){

	if(oldBlock.first.x > 1){
		// Board[oldBlock.first.x][oldBlock.first.y].colorId = 0;
		// Board[oldBlock.first.x][oldBlock.first.y].blockId = 0;
		// Board[oldBlock.first.x][oldBlock.first.y].number = 0;
		Board[oldBlock.first.x][oldBlock.first.y].link.style.backgroundColor = '#FFFFFF';
	}

	if(oldBlock.second.x > 1){
		// Board[oldBlock.second.x][oldBlock.second.y].colorId = 0;
		// Board[oldBlock.second.x][oldBlock.second.y].blockId = 0;
		// Board[oldBlock.second.x][oldBlock.second.y].number = 0;
		Board[oldBlock.second.x][oldBlock.second.y].link.style.backgroundColor = '#FFFFFF';
	} 

	//paint new block's color
	if(block.first.x > 1){
		// Board[block.first.x][block.first.y].colorId = block.colorId;
		// Board[block.first.x][block.first.y].blockId = block.blockId;
		// Board[block.first.x][block.first.y].number = 1;
		Board[block.first.x][block.first.y].link.style.backgroundColor = colors[block.colorId];
	}
	
	if(block.second.x > 1){
		// Board[block.second.x][block.second.y].colorId = block.colorId;
		// Board[block.second.x][block.second.y].blockId = block.blockId;
		// Board[block.second.x][block.second.y].number = 2;
		Board[block.second.x][block.second.y].link.style.backgroundColor = colors[block.colorId];
	}	
}

//main function

function gameProcess(){
	//the block is dropping now
	window.BLOCK = Object.assign({},createNewBlock());
	let again = true;

	window.refreshId = setInterval(dropping,1500,BLOCK,'gameProcess');
	
}

//input from keyboard

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