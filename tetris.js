var canvas=document.getElementById("tetris");
var context= canvas.getContext('2d');
context.scale(20,20);


var matrix=[
  [0,0,0],
  [1,1,1],
  [0,1,0],
];

function createPiece(Type){
  if(Type=='T'){
  	return [
  [0,0,0],
  [1,1,1],
  [0,1,0],
];
  }else if(Type=='O'){
  	return [
  [3,3],
  [3,3],
];
  }else if(Type=='L'){
  	return [
  [0,4,0],
  [0,4,0],
  [0,4,4],

  	];
  }else if(Type=='J'){
      return [
      [0,5,0],
      [0,5,0],
      [5,5,0],
      ];
  }else if(Type=='I'){
  	return[
      [0,6,0,0],
      [0,6,0,0],
      [0,6,0,0],
      [0,6,0,0],


  	];
  }else if(Type=='S'){
  	return[
  [0,7,7],
  [7,7,0],
  [0,0,0],
  	];
  }
  else if(Type=='Z'){
  	return[
  [0,2,2],
  [2,2,0],
  [0,0,0],


  	];
  }
}

function arenaSweep(arena){
   var rowCounter=1;

 out: for(var y=arena.length-1;y>=0;y--){
    for(var x=0;x <arena[y].length;x++){
      if(arena[y][x]==0){
        continue out;
      }
    }
    const row=arena.splice(y,1)[0].fill(0);
    arena.unshift(row);
    y++;

    player.score+=  rowCounter*10;
    rowCounter*=2;
  }
}
var player={
 matrix: null,
 pos : {x:4, y:0},
 score :0
};
var arena=createMatrix(12,20);

function collide(arena,player){
	let [m,o] =	[player.matrix,player.pos];
	for(var y=0;y<m.length ;y++){
		for(var x=0;x<m[y].length;x++){
			if(m[y][x]!==0 &&
			 (arena[y+o.y] && arena[y+o.y][x+o.x])!==0){
                  return true;
			}
		}
	}
	return false;
}
function draw(){
 	context.fillStyle='#000';
 	context.fillRect(0,0,canvas.width,canvas.height);
     

    drawMatrix(arena,{x:0,y:0});
	drawMatrix(player.matrix,player.pos);
}

function drawMatrix(matrix,offset){
matrix.forEach((row,y)=>{

	row.forEach((value,x)=>{
		
		if(value!=0){
			context.fillStyle=colors[value];
			context.fillRect(x+offset.x,y+offset.y,1,1);
		}
	});
});
}

function playerReset(){
	var list='ILJOTSZ';
	player.matrix=createPiece(list[list.length*Math.random()|0 ]);
	player.pos.y=0;
	player.pos.x=(arena[0].length/2 |0) -(player.matrix[0].length/2 |0);
if(collide(arena,player)){
 

	arena.forEach(row=>row.fill(0));
  player.score=0;
  updateScore();
}


}

var colors=[
  null,
  '#00ff00',
  '#ff33cc',
  '#0066ff',
  '#660066',
  '#ff9900',
  '#993333',
  '#5c5c3d',
];

function playerRotation(dir){
  var pos=player.pos.x;
	var offset=1;
	rotate(player.matrix,dir);
	while(collide(arena,player)){
		player.pos.x+=offset;
		offset =-(offset+(offset >0 ? 1 : -1));
		if(offset >player.matrix[0].length){
			rotate(player.matrix,-dir	);
			player.pos.x=pos;
			return;
		}
	}

}

function rotate(matrix,dir){
	

 for(var y=0;y<matrix.length;y++){
 	for(var x=0; x<y ;x++){
      [ matrix[x][y],
        matrix[y][x],
      ]=[
           matrix[y][x],
           matrix[x][y],
       ];

 	}
 }
  if(dir>0){
  	matrix.forEach(row=>row.reverse());
  }else{
  matrix.reverse();
  }
}

var lastTime=0;
var dropCounter=0;
 var dropInterval=1000;


function createMatrix(w,h){
		var matrix=[];
		while(h--){
		matrix.push(new Array(w).fill(0));
		}
return matrix;

}
function update(time=0){
    var deltaTime=time-lastTime;
     lastTime=time;
     
     dropCounter+=deltaTime;
     if(dropCounter >dropInterval){
     	playerDrop();
     }
   
 	 draw();
 	 requestAnimationFrame(update);
}


function merge(arena,player){
 player.matrix.forEach((row,y)=>{
       row.forEach((value,x)=>{
           if(value!=0){
           	arena[y+player.pos.y][x+player.pos.x] =	value;
           }
       });
 });
}

 function playerDrop(){
player.pos.y++;
 
  if(collide(arena,player)){
  	player.pos.y--;
  	merge(arena,player);
  	playerReset();
    arenaSweep(arena);
    updateScore();
  }
dropCounter=0;

}

function updateScore(){
  document.getElementById("scoreCard").innerHTML="Score: " + player.score;
 
}

function playermove(dir){
	player.pos.x+=dir;
	if(collide(arena,player)){
		player.pos.x-=dir;
	}
}

document.addEventListener('keydown',event=>{
 if(event.keyCode==37){
   playermove(-1);
 }else if(event.keyCode==39){
 	playermove(+1);
 }else if(event.keyCode==40){
 	playerDrop();
 }else if(event.keyCode==81){
  playerRotation(-1);
 }else if(event.keyCode==87){
 	playerRotation(+1);
 }
})


playerReset();
updateScore();
update();