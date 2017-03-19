
var socket = io.connect('http://192.168.168.48:8080');//on se connecte au serveur

window.addEventListener("DOMContentLoaded",function(){
//on récupère l'user grace à l'attribut data-user passé au body

/* var employe = new Employe();
Employe.nom = "Test";
alert(Employe.nom); */

var user = document.getElementsByTagName("body")[0].getAttribute('data-user');
var users;
console.log("user="+user);
socket.emit('ident',user); //On envoie l'user dans le tableau des users
//on demande la liste complète des users pour vérifier que l'autre joueur est connecté
socket.emit("liste","x");

socket.on("liste", function(liste){
  console.log(liste);
  users = liste;
  
  if (liste.length == 2){
  
    // Envoie du labyrinthe ->> 
    sendLab();
	// <-- Recuperation du labyrinthe 
    socket.on("laby", function(laby){
		monLab = JSON.parse(laby);
		getLab();
		// <-- On ecoute les entrees au clavier. 
		document.addEventListener("keydown",function(e){
			alert('touche appuyee');
			ecouteurClavier(e);
		},false);
		// <-- Recuperation des coordonnees des joueurs. 
		socket.on("position", function(pos){
			joueur1.posX = pos.perso1.x;
			joueur1.posY = pos.perso1.y;
	
			persX2 = pos.perso2.x;
			persY2 = pos.perso2.y;
				
		});
		// <-- Recuperation des coordonnees du boss. 
		socket.on("positionBoss", function(pos){
			boss.posX = pos.boss.x;
			boss.posY = pos.boss.y;
		 });
		 
		socket.on("positionBossTest", function(positionX, positionY){
			boss2.posX = positionX;
			boss2.posY = positionY;
		}); 
		 
	})	
 }
})

var monLab; //objet contenant le labyrinthe
const LINEWIDTH = 4;//épaisseur des murs
const STROKESTYLE = "white";
const FILLSTYLE = "black";
const CASE = 30; //Taille en pixel de la case
var imgLab;
var dim;

var posX1=0;
var posY1=0;




var persX1 = LINEWIDTH;
var persY1 = LINEWIDTH;
var persX2 = 0;
var persY2 = 0;

//var boss = new Boss();

var boss2 = new Boss();

function Boss(){
	this.imgBoss = "asset/img/perso/megamanFace.png";
	this.posX;
	this.posY;
	this.persY;
	this.persX;
	this.vitesse = 1
	this.listeDirections = ["Nord"];
	this.direction = this.listeDirections[Math.floor(Math.random() * this.listeDirections.length)];
	/* Dessiner le boss */
	this.draw = function(g){
		var imgDuBoss = new Image();
		imgDuBoss.src = this.imgBoss;
		g.drawImage(imgDuBoss,this.posX,this.posY,CASE-LINEWIDTH,CASE-LINEWIDTH);
		imgDuBoss.onload = function(){
			g.drawImage(imgDuBoss,this.posX,this.posY,CASE-LINEWIDTH,CASE-LINEWIDTH);
		}
		g.drawImage(imgDuBoss,this.posX,this.posY,CASE-LINEWIDTH,CASE-LINEWIDTH);
    }
	/* Animer le bosss */
	this.move = function(){
	switch(this.direction) {
		case "Nord":
		alert("nord");	
		
		alert("posY"+posY);
		
		/* this.persY= Math.ceil(this.posY/CASE);
		this.persX= Math.ceil(this.posX/CASE); 
		if(monLab[this.persY*dim+this.persX].N>=0){ */
		
		//if(monLab[this.posY*dim+this.posX].N>=0) {
		
		// if(monLab[posY*dim+posX].N>=0) {
		
		var posX = (persX1 - LINEWIDTH)/CASE;
		var posY = (persY1 - LINEWIDTH)/CASE;
		var roundX = Math.floor(posX);
		var roundY = Math.floor(posY);
		var index = roundY*dim+roundX;
		if (roundX==-1) roundX=0;
		if (roundY==-1) roundY=0;
		
		roundX = Math.ceil(posX);
        index = roundY*dim+roundX;

        if(monLab[index].O>=0){
		
			alert('pas de mur.');
			posY = posY-5;
			//g.drawImage(this.posX,this.posY,CASE-LINEWIDTH,CASE-LINEWIDTH);
		}
		else{
			alert('mur au dessus');
			this.direction = this.listeDirections[Math.floor(Math.random() * this.listeDirections.length)];
			alert(this.direction);
			//this.move(); 
		}		
		break;
		case "Sud": 
			alert("sud");	
	
		//if(this.posX%CASE==0||this.posX%CASE>CASE-this.vitesse-1){
		
		if(monLab[this.posY*dim+this.posX].N>=0) {
		
			this.posY = this.posY-this.vitesse;
		} else {
			this.direction = this.listeDirections[Math.floor(Math.random() * this.listeDirections.length)];
			//this.move();
		}
	
		break;
		case "Est":
			//this.bossX=this.bossX+30;

			break;	
		case "Ouest": 
			//this.bossX=this.bossX-30;
	}	
	// Transmettre la position du boss 
	//socket.emit("positionBoss", {"boss": {x:boss.posX, y:boss.posY } });
	}
}


this.move = function(evt){
    switch(evt){
			case 37 :
				//console.log("gauche");
				//on arrondit à la case d'au dessus pour ne s'arréter que lorsqu'on arrive à la bonne case
				alert("gauche");
				this.persY= Math.ceil(this.posY/CASE);
				this.persX= Math.ceil(this.posX/CASE);
        //console.log("x : "+persX1+", y : "+persY1)
        //console.log("x : "+posX1+", y : "+posY1)
        //console.log(posY1%CASE)
				//on vérifie que le mouvement précédent est bien terminé sur une case
				if(this.posY%CASE==0||this.posY%CASE>CASE-this.vitesse-1){
					if(monLab[this.persY*dim+this.persX].O>=0)
						this.posX = this.posX-this.vitesse;
				}
				break;
			case 38 :
				//console.log("haut");
				//on arrondit à la case d'au dessus pour ne s'arréter que lorsqu'on arrive à la bonne case
				this.persY= Math.ceil(this.posY/CASE);
				this.persX= Math.ceil(this.posX/CASE);
				//on vérifie que le mouvement précédent est bien terminé sur une case
				if(this.posX%CASE==0||this.posX%CASE>CASE-this.vitesse-1){
					if(monLab[this.persY*dim+this.persX].N>=0)
						this.posY = this.posY-this.vitesse;
				}
				break;
			case 39 :
				//console.log("droite");
				//on arrondit à la case d'en dessous pour ne s'arréter que lorsqu'on arrive à la bonne case
				this.persY= Math.trunc(this.posY/CASE);
				this.persX= Math.trunc(this.posX/CASE);
				//on vérifie que le mouvement précédent est bien terminé sur une case
				if(this.posY%CASE==0||this.posY%CASE>CASE-this.vitesse-1){
					if(monLab[this.persY*dim+this.persX].E>=0)
						this.posX = this.posX+this.vitesse;
				}
				break;
			case 40 :
				//console.log("bas");
				//on arrondit à la case d'en dessous pour ne s'arréter que lorsqu'on arrive à la bonne case
				this.persY= Math.trunc(this.posY/CASE);
				this.persX= Math.trunc(this.posX/CASE);
				//on vérifie que le mouvement précédent est bien terminé sur une case
				if(this.posX%CASE==0||this.posX%CASE>CASE-this.vitesse-1){
					if(monLab[this.persY*dim+this.persX].S>=0)
						this.posY = this.posY+this.vitesse;
				}
				break;
		}
    
  }

  
  function Joueur(posX, posY, persX, persY){
  this.persPosX;
  this.persPosY;
  this.posX = posX;
  this.posY = posY;
  this.persX = persX;
  this.persY = persY;
  this.vitesse = 10;
  this.spriteSrc = "asset/img/perso/megamanFace.png";
  
  this.draw = function(g){
    var imagePers = new Image();
    imagePers.src = this.spriteSrc;
    imagePers.onload = function(){
      //console.log("chargement image joueur")
      g.drawImage(imagePers,this.posX,this.posX,CASE-LINEWIDTH,CASE-LINEWIDTH);
	 // g.drawImage(imgDuBoss,this.posX,this.posY,CASE-LINEWIDTH,CASE-LINEWIDTH);
    }
     g.drawImage(imagePers,this.posX,this.posX,CASE-LINEWIDTH,CASE-LINEWIDTH);
  }
  //méthode pour gérer le mouvement du perso du joueur
 

this.move = function(evt){
    switch(evt){
			case 37 :
				//console.log("gauche");
				//on arrondit à la case d'au dessus pour ne s'arréter que lorsqu'on arrive à la bonne case
				alert("gauche");
				this.persY= Math.ceil(this.posY/CASE);
				this.persX= Math.ceil(this.posX/CASE);
        //console.log("x : "+persX1+", y : "+persY1)
        //console.log("x : "+posX1+", y : "+posY1)
        //console.log(posY1%CASE)
				//on vérifie que le mouvement précédent est bien terminé sur une case
				if(this.posY%CASE==0||this.posY%CASE>CASE-this.vitesse-1){
					if(monLab[this.persY*dim+this.persX].O>=0)
						this.posX = this.posX-this.vitesse;
				}
				break;
			case 38 :
				//console.log("haut");
				//on arrondit à la case d'au dessus pour ne s'arréter que lorsqu'on arrive à la bonne case
				this.persY= Math.ceil(this.posY/CASE);
				this.persX= Math.ceil(this.posX/CASE);
				//on vérifie que le mouvement précédent est bien terminé sur une case
				if(this.posX%CASE==0||this.posX%CASE>CASE-this.vitesse-1){
					if(monLab[this.persY*dim+this.persX].N>=0)
						this.posY = this.posY-this.vitesse;
				}
				break;
			case 39 :
				//console.log("droite");
				//on arrondit à la case d'en dessous pour ne s'arréter que lorsqu'on arrive à la bonne case
				this.persY= Math.trunc(this.posY/CASE);
				this.persX= Math.trunc(this.posX/CASE);
				//on vérifie que le mouvement précédent est bien terminé sur une case
				if(this.posY%CASE==0||this.posY%CASE>CASE-this.vitesse-1){
					if(monLab[this.persY*dim+this.persX].E>=0)
						this.posX = this.posX+this.vitesse;
				}
				break;
			case 40 :
				//console.log("bas");
				//on arrondit à la case d'en dessous pour ne s'arréter que lorsqu'on arrive à la bonne case
				this.persY= Math.trunc(this.posY/CASE);
				this.persX= Math.trunc(this.posX/CASE);
				//on vérifie que le mouvement précédent est bien terminé sur une case
				if(this.posX%CASE==0||this.posX%CASE>CASE-this.vitesse-1){
					if(monLab[this.persY*dim+this.persX].S>=0)
						this.posY = this.posY+this.vitesse;
				}
				break;
		}
    
  }
  
  
}
  
function sendLab(){
	var requete = new XMLHttpRequest();
	var url = "drawLab.php";
	requete.open("GET",url,true);
	requete.send();
	requete.onreadystatechange = function(){
		if((requete.readyState==4)&&(requete.status==200)){
		  monLab = requete.responseText;
		  socket.emit("laby",monLab);
		}
	}
}

function getLab(){
	dim = Math.floor(Math.sqrt(monLab.length));
	
	persX2 = (dim-1)*CASE+LINEWIDTH;
	persY2 = (dim-1)*CASE+LINEWIDTH;

	imageLabyrinthe();

	var persX1 = LINEWIDTH;
	var persY1 = LINEWIDTH;
	
	joueur1 = new Joueur(posX1,posY1,persX1,persY1);
	
	joueur2 = new Joueur(persX2,persY2,CASE-LINEWIDTH,CASE-LINEWIDTH);
  
  //g.drawImage(imagePers2,persX2,persY2,CASE-LINEWIDTH,CASE-LINEWIDTH);
	
	/* INITIALISATION des coordonnees du boss */
	
	if (users.indexOf(user)==0){
	
		alert(users.indexOf(user));
		

		// Envoie des coordonnes du boss. 
		//socket.emit("positionBoss", {"boss": {x:boss.posX, y:boss.posY } });
		socket.emit("positionBossTest", {"pnj1": {x:boss2.posX, y:boss2.posY } });
	
	}
	socket.emit("positionBossTest", {"pnj1": {x:boss2.posX, y:boss2.posY } });
	dessine();
}


function dessine(){
	imageLabyrinthe();
	var zoneDessin = document.getElementById("labyrinthe");
	zoneDessin.width = dim*CASE+LINEWIDTH*2;
	zoneDessin.height = dim*CASE+LINEWIDTH*2;
	var g = zoneDessin.getContext("2d");
	

	var imagePers2 = new Image();
	imagePers2.src = "asset/img/perso/megamanFace.png";
	

	/* Au chargement */
    imgLab.onload = function(){
	
	  if (users.indexOf(user)%2==0){
	    alert('JOUEUR 1');
		g.drawImage(imgLab,0,0);
		g.drawImage(imgLab,joueur1.posX,joueur1.posY,CASE-LINEWIDTH,CASE-LINEWIDTH);

		
		joueur1.draw(g);
		joueur2.draw(g);
		//boss.draw(g);
		boss2.draw(g);
		
		boss2.move(g);
	}
	else{
		alert('JOUEUR 2');
		g.drawImage(imgLab,0,0);
		g.drawImage(imgLab,joueur1.posX,joueur1.posY,CASE-LINEWIDTH,CASE-LINEWIDTH);
		

		
		joueur1.draw(g);
		
		joueur2.draw(g);
		//boss.draw(g);
		boss2.draw(g);
		
		boss2.move(g);
		

	}
	
	// boss.move(g);
	}
	/* Après chargement */

	
	
	g.drawImage(imgLab,joueur1.posX,joueur1.posY,CASE-LINEWIDTH,CASE-LINEWIDTH);
	
	
	//posX = (Math.floor((Math.random() * 20) + 1)*30) + 4;;
	//posY = (Math.floor((Math.random() * 20) + 1)*30) + 4;;
	
	//boss.posX = (Math.floor((Math.random() * 20) + 1)*30) + 4;;
	//boss.posY = (Math.floor((Math.random() * 20) + 1)*30) + 4;;

	
	joueur2.draw(g);
	joueur1.draw(g);
	boss2.move(g);
	//boss.draw(g);
	//boss.move(g);


	imagePers2.onload = function(){
		//g.drawImage(imagePers2,persX2,persY2,CASE-LINEWIDTH,CASE-LINEWIDTH);
	}
}

function imageLabyrinthe(){
  var canvasLab = document.createElement("canvas");
  canvasLab.width = dim*CASE+LINEWIDTH*2;
  canvasLab.height = dim*CASE+LINEWIDTH*2;
  var g = canvasLab.getContext("2d");
  g.beginPath();

  for(i=0; i<monLab.length;i++){
    x = (i%dim)*CASE+1;
    y = (Math.floor(i/dim)*CASE+1);
	
	// Lignes horizontales 
    if(monLab[i].N<0){
      g.moveTo(x,y);
      g.lineTo(x+CASE+LINEWIDTH,y);
    }

	// Cote droit (lignes verticales)
    if(monLab[i].E<0){
      g.moveTo(x+CASE+LINEWIDTH/2,y);
      g.lineTo(x+CASE+LINEWIDTH/2,y+CASE+LINEWIDTH/2);
    }

    if(monLab[i].O==-1){
     g.moveTo(x,y);
     g.lineTo(x,y+CASE+LINEWIDTH/2);
    }
    if(monLab[i].S==-1){
      g.moveTo(x,y+CASE+LINEWIDTH/2);
      g.lineTo(x+CASE+LINEWIDTH/2,y+CASE+LINEWIDTH/2);
    }
  }

  g.strokeStyle = STROKESTYLE;
  g.stroke();
  g.lineWidth = LINEWIDTH;
  var url = canvasLab.toDataURL();
  imgLab = new Image();
  imgLab.src = url;
}

var vitesse = 5;

function ecouteurClavier(evt){
	alert('passe ici');
	console.log('passeIici');
	if (users.indexOf(user)%2==0){
		joueur1.move(evt.keyCode);
	} else {
		joueur2.move(evt.keyCode);
  }
socket.emit("position", {"perso1":{x:joueur1.posX, y:joueur1.posY }, "perso2": {x:joueur2.posX, y:joueur2.posY} } );

/*

 if (users.indexOf(user)%2==0){
  
    //il faut convertir la position en pixel par la position dans le tableau pour vérifier qu'il n'y a pas de mur
    // la position en pixel est égale à pos*CASE+LINEWIDTH;
    //donc la position dans le tableau est égale à (pospixel - LINEWIDTH)/CASE

    var posX = (persX1 - LINEWIDTH)/CASE;
    var posY = (persY1 - LINEWIDTH)/CASE;
    var roundX = Math.floor(posX);
    var roundY = Math.floor(posY);
    var index = roundY*dim+roundX;
    if (roundX==-1) roundX=0;
    if (roundY==-1) roundY=0;
	//alert("ECOUTEUR EVENT"+index);
	
	 //joueur1.move(evt.keyCode);
	
    //console.log(evt.keyCode);
    switch(evt.keyCode){
	
      case 'q' :
        console.log("Gauche");
        roundX = Math.ceil(posX);
        index = roundY*dim+roundX;

        if(monLab[index].O>=0)
          persX1 = persX1-vitesse;
        //  dessine();
        break;
      case 'z' :
        console.log("haut");
        roundY = Math.ceil(posY);
        index = roundY*dim+roundX;

        if(monLab[index].N>=0)
          persY1 = persY1-vitesse;
         // dessine();
        break;
      case 'd' :
        console.log("droite");
        if(monLab[index].E>=0)
          persX1 = persX1+vitesse;
         // dessine();
        break;
      case 's' :
        console.log("bas");
        if(monLab[index].S>=0)
          persY1 = persY1+vitesse;
          //dessine();
        break;
    }
 }  else {

        var posX = (persX2 - LINEWIDTH)/CASE;
        var posY = (persY2 - LINEWIDTH)/CASE;
        var roundX = Math.floor(posX);
        var roundY = Math.floor(posY);
        var index = roundY*dim+roundX;
		
        if (roundX==-1) roundX=0;
        if (roundY==-1) roundY=0;
        //console.log(evt.keyCode);
        switch(evt.keyCode){
          case 37 :
          //  console.log("gauche");
            roundX = Math.ceil(posX);
            index = roundY*dim+roundX;

            if(monLab[index].O>=0)
              persX2 = persX2-vitesse;
              //dessine();
            break;
          case 38 :
          //  console.log("haut");
            roundY = Math.ceil(posY);
            index = roundY*dim+roundX;

            if(monLab[index].N>=0)
              persY2 = persY2-vitesse;
              //dessine();
            break;
          case 39 :
        //    console.log("droite");
            if(monLab[index].E>=0)
              persX2 = persX2+vitesse;
              //dessine();
            break;
          case 40 :
         //   console.log("bas");
            if(monLab[index].S>=0)
              persY2 = persY2+vitesse;
              //dessine();
            break;
      }
  }

	socket.emit("position", {"perso1":{x:persX1, y:persY1}, "perso2": {x:persX2, y:persY2} });
	
		  // socket.emit("positionBoss", {"boss": {x:boss.posX, y:boss.posY } });
		  */
}
},false);