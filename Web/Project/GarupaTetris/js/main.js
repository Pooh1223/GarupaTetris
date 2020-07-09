//red,purple,blue,green,orange,yellow,gray
const colors = ['#FFFFFF','#FF5151','#AE00AE','#0000C6','#02C874','#FF8000','#F9F900','#5B5B5B']

// Poppin'Party, Afterglow, Pastel*Palettes, Roselia,
// Raise A Suilen, Morfonica, Hello Happy World
const Member = ['','Kasumi','Otae','Rimi','Saya','Arisa'
,'Ran','Moka','Himari','Tomoe','Tsugu'
,'Aya','Hina','Chisato','Maya','Eve'
,'Yukina','Sayo','Lisa','Ako','Rinko'
,'Layer','Rokka','Pareo','Masuki','Chuchu'
,'Mashiro','Touko','Nanami','Tsukushi','Rui'
,'Kokoro','Kaoru','Hagumi','Kanon','Misaki','Michelle']

const MemberNum = [];
const nextMember = [];

//height,width per layer
const Width = 7;
const Height = 12;

//variable to control flow
var finish = true;

//score
var Score = 0;

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

	for(let i = 1;i <= 36;++i){
		MemberNum.push(i);
	}

	Score = 0;
}

// function giveBlockId(){
// 	let index = Math.floor(Math.random() * Math.floor(36));;

// 	while(BlockId[index] == 1){
// 		index = Math.floor(Math.random() * Math.floor(36));
// 	}

// 	return index + 1;

// 	// for(let i = 1;i < 45;++i){
// 	// 	if(BlockId[i] == 0){
// 	// 		BlockId[i] = 1;
// 	// 		return i;
// 	// 	}
// 	// }
// }

// function giveColor(){
// 	let index = Math.floor(Math.random() * Math.floor(7));
// 	return index + 1;
// }

function giveIdData(){
	//pick a pos in MemberNum
	let index = Math.floor(Math.random() * Math.floor(MemberNum.length));
	let MemberId = MemberNum[index];

	while(BlockId[MemberId] == 1){
		MemberNum.splice(index,1);
		
		index = Math.floor(Math.random() * Math.floor(MemberNum.length));
		MemberId = MemberNum[index];
	}

	BlockId[MemberId] = 1;
	MemberNum.splice(index,1);

	//colorId(BandId), BlockId
	if(MemberId < 6){
		return {colorId : 1,blockId : MemberId};
	} else if(MemberId < 11){
		return {colorId : 2,blockId : MemberId};
	} else if(MemberId < 16){
		return {colorId : 3,blockId : MemberId};
	} else if(MemberId < 21){
		return {colorId : 4,blockId : MemberId};
	} else if(MemberId < 26){
		return {colorId : 5,blockId : MemberId};
	} else if(MemberId < 31){
		return {colorId : 6,blockId : MemberId};
	} else {
		return {colorId : 7,blockId : MemberId};
	}
}

function createNewBlock(){
	//always vertical,0 for vertical, 1 for horizontal
	console.log('createNewBlock : in');

	while(nextMember.length < 2){
		let tmp = giveIdData();
		let block = {
			first : {x : 0,y : 3},
			second : {x : 1,y : 3},
			colorId : tmp.colorId,
			blockId : tmp.blockId,
			deg : 0
		};

		nextMember.unshift(block);
	}

	//show next member 
	
	console.log('createNewBlock : out');
	return nextMember.pop();
}

//validaty functions

// function checkAlive(nowHeight){
// 	if(nowHeight < 8) return true;
// 	else {
// 		for(let i = 0;i < 2;++i){
// 			for(let j = 0;j < Height;++j){
// 				//Game over
// 				if(Board[i][j].colorId != 0) return false;
// 			}
// 		}
// 	}
// }

// clear blocks function

function boom(x,y){
	if(x < 2 || y < 0 || x >= Height || y >= Width) return true;
	else return false;
}

function findBlock(stx,sty){
	//used block (if this is a param, you can optimize it)
	console.log('findBlock : in');
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

				//console.log("in");
				queue.unshift({x : tmp.x,y : tmp.y,colorId : coor.colorId});
				posRecord.unshift({x : tmp.x,y : tmp.y});
				tmpBoard[tmp.x][tmp.y] = true;
				cnt++;
			}
		}
	}

	//console.log("pos : " + posRecord.length);

	if(cnt >= 6){
		//return the block pos that should be clear
		//add the blocks that are ready to be clear back to choosable array
		for(let i = 0;i < posRecord.length;++i){
			let nx = posRecord[i].x;
			let ny = posRecord[i].y;

			if(MemberNum.indexOf(Board[nx][ny].blockId) == -1){
				MemberNum.unshift(Board[nx][ny].blockId);
			}
		}

		console.log('findBlock : out');
		return posRecord;
	} else {
		console.log('findBlock : out');
		return [];
	}
}

function droppingAfterClear(){
	console.log('droppingAfterClear : in');
	const dx = [0,0,1,-1];
	const dy = [1,-1,0,0];

	for(let i = Height - 1;i >= 2;--i){
		for(let j = 0;j < Width;++j){
			if(Board[i][j].colorId != 0){
				//find which block is paired

				for(let k = 0;k < 4;++k){
					let tx = i + dx[k];
					let ty = j + dy[k];

					if(boom(tx,ty) == false && Board[tx][ty].blockId == Board[i][j].blockId
						&& Board[tx][ty].colorId == Board[i][j].colorId){

						let tmpBlock = {
							first : {x : 0,y : 0},
							second : {x : 0,y : 0},
							colorId : Board[i][j].colorId,
							blockId : Board[i][j].blockId,
							deg : 0
						};

						//check which is first block

						if(Board[i][j].number == 1 && Board[tx][ty].number == 2){
							tmpBlock.first.x = i;
							tmpBlock.first.y = j;
							tmpBlock.second.x = tx;
							tmpBlock.second.y = ty;

							if(i != tx){
								//vertical
								if(i < tx){
									tmpBlock.deg = 0;
								} else {
									tmpBlock.deg = 180;
								}
							} else {
								//horizontal
								if(j < ty){
									tmpBlock.deg = 90;
								} else {
									tmpBlock.deg = 270;
								}
							}
						} else if(Board[tx][ty].number == 1 && Board[i][j].number == 2){
							tmpBlock.first.x = tx;
							tmpBlock.first.y = ty;
							tmpBlock.second.x = i;
							tmpBlock.second.y = j;

							if(i != tx){
								//vertical
								if(tx < i){
									tmpBlock.deg = 0;
								} else {
									tmpBlock.deg = 180;
								}
							} else {
								//horizontal
								if(ty < j){
									tmpBlock.deg = 90;
								} else {
									tmpBlock.deg = 270;
								}
							}
						}

						Board[i][j].colorId = 0;
						Board[i][j].blockId = 0;
						Board[i][j].number = 0;
						Board[tx][ty].colorId = 0;
						Board[tx][ty].blockId = 0;
						Board[tx][ty].number = 0;

						while(dropping(tmpBlock,'droppingAfterClear'));
					}
				}
			}
		}
	}
	console.log('droppingAfterClear : out');
}

function clearBlock(){
	console.log('clearBlock : in');
	for(let i = Height - 1;i >= 2;--i){
		for(let j = 0;j < Width;++j){
			if(Board[i][j].colorId != 0){
				//bfs
				let clearBlocks = findBlock(i,j);

				for(let k = 0;k < clearBlocks.length;++k){
					let tmp = Board[clearBlocks[k].x][clearBlocks[k].y].blockId;
					let nx = clearBlocks[k].x;
					let ny = clearBlocks[k].y;

					BlockId[tmp] = 0;
					Board[nx][ny].number = 0;
					Board[nx][ny].blockId = 0;
					Board[nx][ny].colorId = 0;
					//Board[nx][ny].link.style.backgroundColor = '#FFFFFF';
					Board[nx][ny].link.style.backgroundImage = "url()"

					if(Board[nx][ny].link.classList.contains("deg90")){
						Board[nx][ny].link.classList.remove("deg90");
					}

					if(Board[nx][ny].link.classList.contains("deg180")){
						Board[nx][ny].link.classList.remove("deg180");
					}

					if(Board[nx][ny].link.classList.contains("deg270")){
						Board[nx][ny].link.classList.remove("deg270");
					}
				}

				//console.log("clearBlocks : " + String(clearBlocks.length));

				if(clearBlocks.length != 0){
					droppingAfterClear();
				}

				//console.log('done!');
			}
		}
	}
	console.log('clearBlock : out');
}

//moving blocks functions

function dropping(block,whereItCalled){
	console.log('dropping : in');
	let oldBlock = {
		first : {x : block.first.x,y : block.first.y},
		second : {x : block.second.x,y : block.second.y},
		colorId : block.colorId,
		blockId : block.blockId,
		deg : block.deg
	};

	if(block.deg % 180 == 0){
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
				//console.log('1\n\n');
				updateBoard(oldBlock,block);

				Board[block.first.x][block.first.y].colorId = block.colorId;
				Board[block.first.x][block.first.y].number = 1;
				Board[block.second.x][block.second.y].colorId = block.colorId;
				Board[block.second.x][block.second.y].number = 2;

				Board[block.first.x][block.first.y].blockId = block.blockId;
				Board[block.second.x][block.second.y].blockId = block.blockId;

				if(whereItCalled == 'gameProcess'){
					clearInterval(window.refreshId);
					clearBlock();
					finish = true;
				} else if(whereItCalled == 'droppingAfterClear'){
					console.log('dropping : out');
					return false;
				}
				
				//return newBlock : block;
			}

		} else {
			//keep dropping

			block.first.x += 1;
			block.second.x += 1;

			// console.log('2\n\n');
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

			updateBoard(oldBlock,block);

			if(whereItCalled == 'droppingAfterClear'){
				console.log('dropping : out');
				return true;
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

				Board[block.first.x][block.first.y].colorId = block.colorId;
				Board[block.first.x][block.first.y].number = 1;
				Board[block.second.x][block.second.y].colorId = block.colorId;
				Board[block.second.x][block.second.y].number = 2;

				Board[block.first.x][block.first.y].blockId = block.blockId;
				Board[block.second.x][block.second.y].blockId = block.blockId;

				if(whereItCalled == 'gameProcess'){
					clearInterval(window.refreshId);
					clearBlock();
					finish = true;
				} else if(whereItCalled == 'droppingAfterClear'){
					console.log('dropping : out');
					return false;
				}

				//return {newBlock : block,again : false};
			}

		} else {
			//keep dropping

			block.first.x += 1;
			block.second.x += 1;

			updateBoard(oldBlock,block);

			if(whereItCalled == 'droppingAfterClear'){
				console.log('dropping : out');
				return true;
			}

			//return {newBlock : block,again : true};
		}
	}
	console.log('dropping : out');
}

function moving(block,keyCode){
	let oldBlock = {
		first : {x : block.first.x,y : block.first.y},
		second : {x : block.second.x,y : block.second.y},
		colorId : block.colorId,
		blockId : block.blockId,
		deg : block.deg,
	};

	if(keyCode == 37 || keyCode == 39){
		//left , right

		if(block.deg % 180 == 0){
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
	//can be optimized : if can't rotate 90 ,then try 180 or 270
	let oldBlock = {
		first : {x : block.first.x,y : block.first.y},
		second : {x : block.second.x,y : block.second.y},
		colorId : block.colorId,
		blockId : block.blockId,
		deg : block.deg
	};

	if(block.deg % 180 == 0){
		//vertical
		if(block.first.x < block.second.x){
			//deg 0 -> deg 90
			if(block.first.y != Width - 1 && Board[block.first.x][block.first.y + 1].colorId == 0){
				block.deg = 90;
				block.second.x = block.first.x;
				block.second.y = block.first.y + 1;

				updateBoard(oldBlock,block);
			}
		} else {
			//deg 180 -> deg 270
			if(block.first.y != 0 && Board[block.first.x][block.first.y - 1].colorId == 0){
				block.deg = 270;
				block.second.x = block.first.x;
				block.second.y = block.first.y - 1;

				updateBoard(oldBlock,block);
			}
		}
	} else {
		if(block.first.y < block.second.y){
			//deg 90 -> deg 180
			if(block.first.x != 0 && Board[block.first.x - 1][block.first.y].colorId == 0){
				block.deg = 180;

				block.second.x = block.first.x - 1;
				block.second.y = block.first.y;

				updateBoard(oldBlock,block);
			}
		} else {
			//deg 270 -> deg 0
			if(block.first.x != Height - 1 && Board[block.first.x + 1][block.first.y].colorId == 0){
				block.deg = 0;

				block.second.x = block.first.x + 1;
				block.second.y = block.first.y;

				updateBoard(oldBlock,block);
			}
		}
		
	}
}

//painting functions

function updateBoard(oldBlock,block,degree){
	console.log('updateBoard : in');
	if(oldBlock.first.x > 1){
		// Board[oldBlock.first.x][oldBlock.first.y].colorId = 0;
		// Board[oldBlock.first.x][oldBlock.first.y].blockId = 0;
		// Board[oldBlock.first.x][oldBlock.first.y].number = 0;
		// Board[oldBlock.first.x][oldBlock.first.y].link.style.backgroundColor = '#FFFFFF';
		Board[oldBlock.first.x][oldBlock.first.y].link.classList.remove('deg' + String(oldBlock.deg));
		Board[oldBlock.first.x][oldBlock.first.y].link.style.backgroundImage = "url()";
	}

	if(oldBlock.second.x > 1){
		// Board[oldBlock.second.x][oldBlock.second.y].colorId = 0;
		// Board[oldBlock.second.x][oldBlock.second.y].blockId = 0;
		// Board[oldBlock.second.x][oldBlock.second.y].number = 0;
		// Board[oldBlock.second.x][oldBlock.second.y].link.style.backgroundColor = '#FFFFFF';
		Board[oldBlock.second.x][oldBlock.second.y].link.classList.remove('deg' + String(oldBlock.deg));
		Board[oldBlock.second.x][oldBlock.second.y].link.style.backgroundImage = "url()";
	} 

	//paint new block's color
	if(block.first.x > 1){
		// Board[block.first.x][block.first.y].colorId = block.colorId;
		// Board[block.first.x][block.first.y].blockId = block.blockId;
		// Board[block.first.x][block.first.y].number = 1;
		// Board[block.first.x][block.first.y].link.style.backgroundColor = colors[block.colorId];
		Board[block.first.x][block.first.y].link.classList.add('deg' + String(block.deg));
		Board[block.first.x][block.first.y].link.style.backgroundImage
	 	= "url(./res/" + Member[block.blockId] + "-1.jpg)";
	}
	
	if(block.second.x > 1){
		// Board[block.second.x][block.second.y].colorId = block.colorId;
		// Board[block.second.x][block.second.y].blockId = block.blockId;
		// Board[block.second.x][block.second.y].number = 2;
		// Board[block.second.x][block.second.y].link.style.backgroundColor = colors[block.colorId];
		Board[block.second.x][block.second.y].link.classList.add('deg' + String(block.deg));
		Board[block.second.x][block.second.y].link.style.backgroundImage
		 = "url(./res/" + Member[block.blockId] + "-2.jpg)";
	}
	//console.log(block.blockId + " : " + Member[block.blockId]);
	console.log('updateBoard : out');
}

//main function

function gameProcess(){

	if(finish){
		finish = false;
		//the block is dropping now
		window.BLOCK = Object.assign({},createNewBlock());

		window.refreshId = setInterval(dropping,1500,BLOCK,'gameProcess');
	}
	//console.log(finish);
}

//input from keyboard

window.addEventListener('keydown',function(key){
	//console.log(key.keyCode);
	if(key.keyCode >= 37 && key.keyCode <= 40){
		moving(BLOCK,key.keyCode);
	} else if(key.keyCode == 32){
		rotating(BLOCK);
	}
	//pause(?)
});


init();

setInterval(gameProcess,100);

//problem:
//stuck on createNewBlock, maybe wrong at MemberId?

//todo:
//show next block (maybe use queue to generate one more block standby)
//score
//photo should consider the black line px