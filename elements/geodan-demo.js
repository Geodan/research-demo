import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { repeat } from 'lit-html/lib/repeat.js';

import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-item/paper-item-body.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';

class GeodanDemo extends LitElement {
    render({resultaat}){
        return html`
    <style is="custom-style">
            :host {
                display: block;
                --geodan-regular-font: 'Open Sans Regular';
                --geodan-light-font: 'Open Sans',sans-serif;
                --geodan-heading1-fontsize: 36px;
                --geodan-heading2-fontsize: 24px;
                --geodan-heading3-fontsize: 17px;
                --geodan-light-fontweight: 300;
                --geodan-color: #333333;
        
                --geodan-button-normal: #ED3031;
                --geodan-button-hover:  #D60000;
                --geodan-button-pressed: #BB0C16;
                --geodan-button-disabled: #ECECEC;
                --geodan-button-corner-radius: 4px;
        
                --geodan-checkbox-unckeched: #E3E2E3;
                --geodan-checkbox-checked: #ED3031;
        
                --geodan-header-background:  #424242;
                
                color: var(--geodan-color);
            }
            
            h1 {
                font-family: var(--geodan-regular-font);
                font-size: var(--geodan-heading1-fontsize);
            }
            h2 {
                font-family: var(--geodan-regular-font);
                font-size: var(--geodan-heading2-fontsize);
            }
            h3 {
                font-family: var(--geodan-regular-font);
                font-size: var(--geodan-heading3-fontsize);
            }
        
            .title {
                font-family: var(--geodan-regular-font);
                font-size: var(--geodan-heading1-fontsize);
            }
            paper-button.geodan {
                background:var(--geodan-button-normal);
                color:white;
                border-radius:var(--geodan-button-corner-radius); 
                --paper-button-ink-color: var(--geodan-button-normal);
                --paper-button-disabled: var(--geodan-button-disabled);
            }
            paper-button.geodan:hover {
                background:var(--geodan-button-hover);
            }
        
            paper-button.geodan a{
                color: white;
            }
            paper-icon-button {
                color: var(--geodan-button-normal);
                --paper-icon-button-ink-color: var(--geodan-button-normal);
            }
        
            a {
                text-decoration: none;
                color: var(--geodan-color);
            }
        
            app-header {
                height: 80px;
            }
        
            app-toolbar {
                background: var(--geodan-header-background);
                color: white;
                --app-toolbar-font-size: 18px;
                font-family: var(--geodan-light-font);
                font-weight: var(--geodan-light-fontweight);
                height: 80px;
            }
        
            paper-tab {
                --paper-tab-ink: var(--geodan-button-normal);
            }
        
            paper-tabs {
                --paper-tabs-selection-bar-color: var(--geodan-button-normal);
        
            }
        
            paper-checkbox {
                --paper-checkbox-unchecked-color: var(--geodan-checkbox-unchecked);
                --paper-checkbox-unchecked-ink-color: var(--geodan-checkbox-checked);
                --paper-checkbox-checked-color: var(--geodan-checkbox-checked);
                --paper-checkbox-checked-ink-color: var(--geodan-checkbox-unchecked);
                --paper-checkbox-checkmark-color: white;
            }
        </style>    
    <style include="iron-flex iron-flex-alignment">
 
    .demo {
        display: inline-block;
        width: 200px;
        cursor: pointer;
        margin: 5px;
        background: white;
        border-radius: 4px;
    }
    paper-card {
        perspective: 500px;
    }
    
    paper-card:hover .card-content {
        transform: rotateY( 180deg ) ;
        transition: transform 0.5s;
    }

    .card-content {
        transition: transform 1s;
        transform-style: preserve-3d;
    }
    .card-content img {
        height: 100%;
        width: 100%;
    }


    .frontside, .backside {
        backface-visibility: hidden;
    }
    
    .backside {
        position: absolute;
        top: 5px;
        padding: 5px;
        transform: rotateY( 180deg );
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
        </div>
        <div class="subcontent">
                ${repeat(resultaat || [], (demo) => demo.title, (demo, index) => html`
                <a href="${demo.url}">
                    <paper-item class="tag">
                        <paper-item-body two-line>
                            <div class="demoname">${demo.title}</div>
                            <div secondary>
                                <strong>tags:</strong> ${this.toArray(demo.tags)}
                            </div>
                        </paper-item-body>
                    </paper-item>
                </a>
                `)}
        </div>
 </app-drawer>
 <app-header-layout fullbleed="">
    <app-header>
        <app-toolbar>
            <h4 condensed-title="demos">Geodan Research demos</h4>
        </app-toolbar>
    </app-header>


    <div class='layout horizontal wrap'>
    ${repeat(this.resultaat || [], (demo) => demo.title, (demo, index) => html`
            <a class="demo" href="${demo.url}" style="display:${demo.disabled?"none":"inline-block"}">
            <paper-card 
                heading="" 
                alt="${demo.title}">
                <div class="card-content">
                    <div class="frontside">
                        ${this.isvideo(demo.thumbnail)?html`
                            <video src="${demo.thumbnail}" width="100%" height="100%" autoplay="" loop=""></video>
                        `:html`
                            <img src="${demo.thumbnail}"/>
                        `}
                        <div>${demo.title}</div>
                        <div class="date">${demo.date}</div>
                    </div>
                    <div class="backside">
                        ${demo.description}
                    </div>
                </div>
            </paper-card>
            
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
