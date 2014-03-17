var TrelloInvisDepApp = function(){
	
	this.baseTrelloUrl = 'https://api.trello.com/1/';
	this.trelloKey = '&key=30ba6112a9c864cb0ef59ee7f62478d7&token=';
	this.boardShortlink = 'uhWqWXC9';
	
	
	this.board = 'boards/' + this.boardShortlink;
	
	this.nodeW = 100;
	this.nodeH = 100;
	
	this.w = 800;
	this.h = 600;
	
	//Bad
	cssClone = false;
	
	this.dependent = null, 
	this.dependency = null;
};

TrelloInvisDepApp.prototype = function(){
	
	var init = function()
	{
			
			var results = []
			
			$('.loadingMessage').hide();
			var cards = results[0];
			var lists = results[1];
			
			var dataset = {nodes:[{name: 'Anchor', nodeType : 'Anchor'},
								  {name: 'SomeNode', nodeType : 'Card'}
								 ], edges: [{source : 0, target : 1}]};
			
			this.invis = new InVis();
			
			var markerHtml = '<marker id="markerArrow" markerWidth="30" markerHeight="13" refx="2" refy="7" orient="auto"> <path d="M25,7 L2,13 L8,7 L2,2"></path> </marker>';
			//var markerHtml = '<marker id="markerArrow" markerWidth="30" markerHeight="30" refX="15" refY="15" orient="auto"> <path d="M30,15 L0,30 L5,15 L2,0"></path> </marker>';
			//var markerHtml = '<marker id="markerCircle" markerWidth="8" markerHeight="8" refx="5" refy="5">    <circle cx="5" cy="5" r="3" style="stroke: none; fill:#000000;"/></marker>';
			
			setInterval(function(){
				
				var endX = 30;
				var ma = $('#markerArrow');
				if($('#markerArrow').length < 0) {return;}
				
				var newX = parseInt( ma[0].getAttribute('refX')) - 1;
				if(newX <= -endX) {newX = endX-1;}
				
				ma[0].setAttribute('refX',newX);			
			},10);
			
			this.settings = buildSettings(markerHtml);
					
			this.invis.create(this.settings,dataset);
			
			$('#removeDependencyButton').click(function(){this.removeDependencyClick(this.settings,dataset);}.bind(this));
			$('#addDependencyButton').click(function(){this.addDependencyClicked(this.settings,dataset);}.bind(this));
			$('#cancelDependencyButton').click(function(){this.resetDependencyFlow();}.bind(this));
			
			$('#removeAllDependencies').click(function(){this.removeAllDependencies(this.settings,dataset);}.bind(this));
			
	};
	
	var resetDependencyFlow = function (){
			$('#dependency').text('Add dependency');
			
			$('#cancelDependencyButton').hide();
			
			$('#addDependencyButton').show();
			$('#removeDependencyButton').show();
			
			$('#dependency').text('');
			$('#dependant').text('');
			
			this.dependency = null,this.dependent = null;
			$(this.settings.svgElement[0]).unbind('mousedown',removeDependencyMouseDown);
			$(this.settings.svgElement[0]).unbind('mousedown',addDependencyMouseDown);
			
		};
	
	var removeAllDependencies = function(settings,dataset){		
		var dependent = null, dependency = null;
		
		var data = this.invis.data;
		
		this.invis.updateGraph(this.settings,{nodes: data.nodes, edges : []});
	};
	
	var getCardDataFromTarget = function(target)
	{
		var cardObject = $(target).parents('foreignObject').first();
		return dependency = d3.select(cardObject[0]).data()[0];
	};
	
	var buildSettings = function(markerHtml){
		var settings = new VisSettings();
				settings.svgElement = d3.select("body").append("svg");
										//.attr('viewBox','0 0 1920 1024')
										//.attr('perserveAspectRatio','xMinYMid');
										
				settings.svgElement.append('defs')
								   .html(markerHtml);
										
				settings.svgHeight = $(document).height();
				settings.svgWidth = $(document).width();
				
				settings.forceSettings.linkDistance = function(d,i){
					return 150;
				};
				
				
				var buildTemplate = function(templateName){
					var template = $('#templates #'+templateName+' > div').clone();
					return template;
				};
				
				var convertTemplateToHtml = function(t){
					return $('<p><p/>').append(t).html();
				}
				
				settings.nodeSettings.buildNode = function(d){
				if(d.nodeType == 'Card')
				{
					var template = buildTemplate('anchorTemplate');
					template.find('.name').text(d.name);
					return convertTemplateToHtml(template);
					
				}
				
				if(d.nodeType == 'Anchor')
				{
					var template = buildTemplate('anchorTemplate');
					template.find('.name').text(d.name);
					return convertTemplateToHtml(template);
				}
				
				
				};
		return settings;
	};
	
	return {
		init:init,
		resetDependencyFlow : resetDependencyFlow
	};
}();

var app = new TrelloInvisDepApp();
app.init();