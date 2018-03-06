import { LitElement, html } from '../node_modules/@polymer/lit-element/lit-element.js';
import { repeat } from '../node_modules/lit-html/lib/repeat.js';

import '../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../node_modules/@polymer/paper-input/paper-input.js';
import '../node_modules/@polymer/paper-item/paper-item.js';
import '../../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../node_modules/@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '../../node_modules/@polymer/app-layout/app-drawer/app-drawer.js';
import '../../node_modules/@polymer/app-layout/app-header-layout/app-header-layout.js';
import '../../node_modules/@polymer/app-layout/app-header/app-header.js';
import '../../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js';

class GeodanDemo extends LitElement {
    render({resultaat}){
        return html`
    <style include="iron-flex iron-flex-alignment">
 
    .demo {
        display: inline-block;
        width: 200px;
        cursor: pointer;
        margin: 5px;
        background: white;
        border-radius: 4px;
    }
    .content {
        background: white;        
        padding: 5px; 
        height: 200px;        
    }           
    .content img {
        max-width: 188px; 
        max-height: 125px;
    }   
    
    .card-content {
        overflow: auto;
        text-decoration: none !important;
    }
    a.card-content:hover {
        text-decoration: none !important;
    }
    a{
        text-decoration: none ;
        color: #333
    }
    a:hover {
        color: #e41e26 !important
    }  
    h2 {
        height: 25px;
        margin-top: 5px;
    }
    h2:hover , .tag a:hover{
        text-decoration: underline;
    }
    .headcontent {
        padding: 5px;
    }
    .subcontent {
        overflow: auto;
    }

    .tag {
        margin:5px;
        background: white;
    }
    .tag.shadow {
        padding:3px;
    }
    .demoname {
        font-size: 120%;
    }
    .tags {
        font-size: 80%;
        color: #333;
    }
    .date {
        color: #aab;
        font-style: italic;
        font-variant: small-caps;
    }
 </style>
 
 <app-drawer-layout fullbleed="">
    <app-drawer slot="drawer" id="menu">
        <app-toolbar class="medium-tall">
        <a href="https://www.geodan.nl"><img src="./img/Geodan_logo_rgb.png" height="80px"></a>
        </app-toolbar>
 
        <div class="headcontent">
            Dit zijn demonstratie sites die in de loop der tijd door Geodan Research zijn ontwikkeld. Niet alle sites zijn voor publiek gebruik en sommige hebben een login nodig. Er is geen garantie dat de sites ook altijd werken en het is niet de bedoeling dat de links zomaar worden gedeeld met een groot publiek.
            <paper-input id="zoekVeld" on-value-changed="${(e)=>this.searchChanged(e)}" label="Zoek een demo">
            </paper-input>
            <div class="subcontent">
                
                ${repeat(resultaat || [], (demo) => demo.title, (demo, index) => html`
                    <div class="tag" on-mouseover="${(e)=>this.hover(e)}}" on-mouseout="${(e)=>this.unhover(e)}">
                        <div class="shadow">
                            <div class="demoname"><a href="${demo.url}">${demo.title}</a></div>
                            <div class="tags">
                            <strong>tags:</strong> ${this.toArray(demo.tags)}</div>
                        </div>
                    </div>
                `)}
                
            </div>
        </div>
 </app-drawer>
 <app-header-layout fullbleed="">
    <app-header>
        <app-toolbar>
            <h4 condensed-title="demos">Geodan Research demos</h4>

        </app-toolbar>
    </app-header>


    <div class="layout horizontal wrap">
    ${repeat(this.resultaat || [], (demo) => demo.title, (demo, index) => html`
        
            <a class="demo" href="${demo.url}" style="display:${demo.disabled?"None":"inline-block"}">
            <div class="content" on-mouseover="${(e)=>demo.hover=true}" on-mouseout="${(e)=>demo.hover=false}">
                <h2>${demo.title}</h2>
                <div class="card-content">
                    <div style="display:${(!demo.hover || !demo.description)?"block":"None"}">
                        <div style="display:${this.isvideo(demo.thumbnail)?"block":"None"}">
                            <video src="${demo.thumbnail}" width="100%" height="100%" autoplay="" loop=""></video>
                        </div>
                        <div style="display:${this.isvideo(demo.thumbnail)?"None":"block"}">
                            <img src="${demo.thumbnail}">
                        </div>
                        <div class="date">${demo.date}</div>
                    </div>
                    <div style="display:${demo.hover?"block":"None"}">
                        ${demo.description}
                    </div>
                </div>
            </div>
            
            </a>
        
    `)}
    </div>
    </app-header-layout>
</app-drawer-layout>
 
<iron-ajax id="getConfig" 
    auto="" 
    url="../config.json" 
    handle-as="json" 
    on-response="${(e)=>this.handleResponse(e)}"
    withcredentials="true"></iron-ajax>
     `;
   } //end of render

  static get is() { return 'geodan-demo'; }
  static get properties() {
    return {
        resultaat: {
            type: Array,
            value: function(){
                return [];
            }
        },
        search: {
            type: String
        }
    }
  }
  isvideo(string){
    	return string.endsWith('mp4');
  }

  toArray(value) {
      if(value) {
          return value.join(' ');
      }
  }

  searchChanged(e) {
      var zoek =e.target.value;
      var resultaat = [];
      let tag = '';
      for(tag in this.tags) {
          if(tag.toLowerCase().indexOf(zoek.toLowerCase())>=0) {
              var demos = this.tags[tag].demos;
              demos.forEach(function(d){
                  var url = d.url;
                  var add = true;
                  resultaat.forEach(function(r){
                      if(r.url==url ) add= false;
                  });
                  if(add) resultaat.push(d)
              })
              
                  
          }
      }
      this.resultaat= resultaat;        
  }

  handleResponse(d) {
      var taglist ={};        
      this.demos = d.detail.response;             
      this.demos.forEach(function(d){
          d.tags=d.tags?d.tags:[];
          d.thumbnail=d.thumbnail?d.thumbnail:"blank.gif";
          if(!d.disabled)d.tags.push(d.title);
          d.tags.forEach(function(t){
              if(taglist[t]===undefined){
                  taglist[t] = {tag:t,demos:[d]}
              }
              else {
                  taglist[t].demos.push(d)
              }
          })
      });
      this.resultaat = d.detail.response;
      this.tags= taglist;        
  }

  ready(){
      super.ready();
      this.demos = this.demos || [];        
      this.tags = this.tags || [];        
      this.resultaat = this.resultaat || []; 
     
  } 
}
window.customElements.define(GeodanDemo.is, GeodanDemo);
