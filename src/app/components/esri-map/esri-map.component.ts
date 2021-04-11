/*
  Copyright 2019 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { loadModules } from "esri-loader";
//import Map from "arcgis-js-api/Map";
//import MapView from "arcgis-js-api/views/MapView";
import esri = __esri; // Esri TypeScript Types
import {PanelModule} from 'primeng/panel';
import {ListboxModule} from 'primeng/listbox';
import {DropdownModule} from 'primeng/dropdown';
import {SelectItem} from 'primeng/api';
import {InputTextModule} from 'primeng/inputtext';
import {TabViewModule} from 'primeng/tabview';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as shp from 'shpjs';
import { jsPanel } from 'jspanel4';


//import * as csvObj from 'csv-model'; 

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { stretch } from '@amcharts/amcharts4/.internal/core/utils/Math';
import { ɵAnimationGroupPlayer } from '@angular/animations';


am4core.useTheme(am4themes_animated);
interface Capa {
  name: string,
  code: number
}

@Component({
  selector: "app-esri-map",
  templateUrl: "./esri-map.component.html",
  styleUrls: ["./esri-map.component.scss"]
})

export class EsriMapComponent implements OnInit, OnDestroy {
  
  private chart: am4charts.XYChart;
  
  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;
  @ViewChild("uploadForm2", { static: true }) private pAddDataForm: ElementRef; 
  @ViewChild("LoadInicial", { static: true }) private pLoader: ElementRef; 
  /**
   * _zoom sets map zoom
   * _center sets map center
   * _basemap sets type of map          
   * _loaded provides map loaded status
   */
  private pNameComponent:string = 'app-esri-map';
  private pPanTOC;
  private pPanGeoref;
  private pPanPrint;
  private pPanAddData;
  private pPanProcess;
  private pPanTable;
  private pPanStats;


  private _zoom = 8;
  private _center: Array<number> = [-74, 4.8];
  private _basemap = "streets";
  private _loaded = false;
  private _view: esri.MapView = null;
  private _GraphicsBuffer: esri.FeatureLayer = null;
  private _tooglePanelTOC =  false; // Inicia apagado
  private _toogleLoadData =  false;
  private _tooglePanelPrint =  false; // Inicia apagado
  private _tooglePanelProces =  false;
  private _LoadPomcas = false;
  private _pGraphics;
  public _pGraphicsSave;
  private _GraphicsCSV;
  private _GraphicsSHP;
  public _pSketch;
  public _layer2;
  private Shapefile;

  public records: any[] = [];  
  

  private _esriRequest: esri.request; 
  public fileToUpload: File = null;

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }
  
  ConstPaneles():void{
    //////////// Construccion de paneles  //////////////////////
    let plistOper = this.CapasOper;
    let pthis = this;
    let pRect = this.mapViewEl.nativeElement.getBoundingClientRect();
    let pAreaDragPanel = [pRect.top + 10, - pRect.left + 20  , -pRect.top + 10 , 10];
    //console.log("Dimm:::", pRect);    
    this.pPanTOC = jsPanel.create({
        id: "pTOC",
        container: document.getElementsByTagName(this.pNameComponent),
        position: {
          my: "left-top",
          at: "left-top",
          offsetX: pRect.left + 10,
          offsetY: pRect.top + 10
      },
        headerTitle: 'Tabla de Contenidos',
        theme: 'primary',
        panelSize: '300 340',
        dragit: {containment: pAreaDragPanel},
        headerControls: {
          maximize: 'remove',
          minimize: 'remove',
          close: 'remove'
        },
        borderRadius: '1rem',
        content: '<div id = "mapLeyen"></div>'        
      });
    this.pPanStats = jsPanel.create({
        id: "pStats",
        container: document.getElementsByTagName(this.pNameComponent),
        position: {
          my: "left-top",
          at: "left-top",
          offsetX: pRect.left + 10,
          offsetY: pRect.top + 355
      },
        headerTitle: 'Estadisticas',
        theme: 'dark',
        panelSize: '470 320',
        dragit: {containment: pAreaDragPanel},
        headerControls: {
          minimize: 'remove',
          maximize: 'remove',
          close: 'remove'
        },
        borderRadius: '1rem',
        content: '<div id="chartdiv" style="width: 100%; height: 100%"></div>'        
      });   
    this.pPanTable = jsPanel.create({
        id: "pTable",
        container: document.getElementsByTagName(this.pNameComponent),
        position: {
          my: "right-top",
          at: "right-top", 
          offsetX: pRect.left + pRect.width - 460,
          offsetY: pRect.top + (700 - 239) ///Altura del componente
      },
        headerTitle: 'Tabla de Atributos',
        theme: 'dark',
        panelSize: '450 220',
        dragit: {containment: pAreaDragPanel},
        headerControls: {
          minimize: 'remove',
          maximize: 'remove',
          close: 'remove'
        },
        borderRadius: '1rem',
        content: '<div id="tableDiv"></div>'//'<div class="container"><div id="tableDiv"></div></div>'        
      });
    function openTab(evt, selTab, tcon, tlinks) {
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName(tcon);
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName(tlinks);
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      document.getElementById(selTab).style.display = "block";
      evt.currentTarget.className += " active";
    } 
    function getNameCapa (id){
      var nameCapa= "";
      for (var i = 0; i < plistOper.length; i++){if(id == plistOper[i].code){nameCapa =  plistOper[i].name;}}
      return nameCapa
    } 
    function InitComponentGeoPro() {
      var css = '.tab {overflow: hidden; border: 1px solid #ccc; background-color: #f1f1f1; }'+
      '.tab button {background-color: inherit;float: left;border: none;outline: none;cursor: pointer;padding: 10px 15px;transition: 0.3s;font-size: 17px;}'+
      '.tab button:hover {background-color: #ddd;} .tab button.active {background-color: #ccc;}'+
      '.tabcontent {display: none;padding: 6px 12px;border: 1px solid #ccc;border-top: none;}' +
      '.tabcontentAddData {display: none;padding: 6px 12px;border: 1px solid #ccc;border-top: none;}';
      var style = document.createElement('style');
      style.appendChild(document.createTextNode(css));
      document.getElementsByTagName('head')[0].appendChild(style);

      var pdTab = document.createElement('div');
      pdTab.setAttribute('class', 'tab');
      var pBufTab = document.createElement("BUTTON");   // Create a <button> element
      pBufTab.innerHTML = "Buffer";  
      pBufTab.setAttribute('class', 'tablinks');
      pBufTab.onclick = function() { openTab(event, 'pIdBuff', 'tabcontent', 'tablinks' ); }  
      var pIntersecTab = document.createElement("BUTTON");   // Create a <button> element
      pIntersecTab.innerHTML = "Intersección";  
      pIntersecTab.setAttribute('class', 'tablinks');
      pIntersecTab.onclick = function() { openTab(event, 'pIdInter', 'tabcontent', 'tablinks'); }          
      //this.CapasOper
      var pdTabCont1 = document.createElement('div');
      pdTabCont1.id ="pIdBuff"; 
      pdTabCont1.setAttribute('class', 'tabcontent');
      ///////////////  Construye pestaña de Buffer  ////////////
      var select = document.createElement("select");
        select.name = "Capa";
        select.id = "CapasOper"
      var option = document.createElement("option");
        option.value = "-1";
        option.text = "Seleccione una capa";
        option.selected = true;
        select.appendChild(option);
      for (const val of plistOper) {
          var option = document.createElement("option");
          option.value = val["code"].toString();
          option.text = val["name"];
          select.appendChild(option);
        }
      select.options[0].disabled = true;
        var label = document.createElement("label");
        label.innerHTML = "Capa de Entrada: "
        label.htmlFor = "CapasOper";
        var x = document.createElement("INPUT");
        x.setAttribute("type", "number");
        x.setAttribute("value", "5000");
        x.setAttribute("ngModel", "distBuff2");
        x.setAttribute("id", "xDistBuff");
        var labelDist = document.createElement("label");
        labelDist.innerHTML = "Distancia (m.): "
        labelDist.htmlFor = "xDistBuff";
      /////////////  Tabla ///////////
        var tabla   = document.createElement("table");
        var tblBody = document.createElement("tbody");
        // Crea las celdas
        for (var i = 0; i < 3; i++) {
          // Crea las hileras de la tabla
          var hilera = document.createElement("tr");
          var celda = document.createElement("td");
          if(i == 0){
            celda.appendChild(label);
            celda.appendChild(select);
          }
          if(i == 1){
            celda.appendChild(labelDist);
            celda.appendChild(x);
          }
          if(i == 2){
            var pSelecGraf = document.createElement("BUTTON");   // Create a <button> element
            pSelecGraf.innerHTML = '<i class = "esri-icon-cursor-filled"></i>Seleccionar Elemento'; 
            pSelecGraf.onclick = function() {
              var pValue = getNameCapa((<HTMLSelectElement>document.getElementById('CapasOper')).value);
              console.log("Val Capa", pValue); 
              pthis.ApplayBuffer(pValue);
            }
            celda.appendChild(pSelecGraf);
          }
          hilera.appendChild(celda);
          tblBody.appendChild(hilera);
        }
        tabla.appendChild(tblBody);
        pdTabCont1.appendChild(tabla);

  ///////////////  Construye pestaña de interseccion  //////////////////////
        var pdTabCont2 = document.createElement('div');
        pdTabCont2.id ="pIdInter"; 
        pdTabCont2.setAttribute('class', 'tabcontent');
        var selectInter = document.createElement("select");
        selectInter.name = "Capa";
        selectInter.id = "CapasOperInter";
        var option = document.createElement("option");
        option.value = "-1";
        option.text = "Seleccione una capa";
        option.selected = true;
        selectInter.appendChild(option);
        for (const val of plistOper) {
          var option = document.createElement("option");
          option.value = val["code"].toString();
          option.text = val["name"];
          selectInter.appendChild(option);
        }
        selectInter.options[0].disabled = true;
        var selectInter2 = document.createElement("select");
        selectInter2.name = "Capa";
        selectInter2.id = "CapasOperInter2";
        var option = document.createElement("option");
        option.value = "-1";
        option.text = "Seleccione una capa";
        option.selected = true;
        selectInter2.appendChild(option);
        for (const val of plistOper) {
          var option = document.createElement("option");
          option.value = val["code"].toString();
          option.text = val["name"];
          selectInter2.appendChild(option);
        }
        selectInter.options[0].disabled = true;
        var labelInter = document.createElement("label");
        labelInter.innerHTML = "Capa de Entrada: "
        labelInter.htmlFor = "CapasOperInter";
        var labelInter2 = document.createElement("label");
        labelInter2.innerHTML = "Intersectar Con: "
        labelInter2.htmlFor = "CapasOperInter2";
     
        var tabla   = document.createElement("table");
        var tblBody = document.createElement("tbody");
        // Crea las celdas
        for (var i = 0; i < 3; i++) {
          // Crea las hileras de la tabla
          var hilera = document.createElement("tr");
          var celda = document.createElement("td");
          if(i == 0){
            celda.appendChild(labelInter);
            celda.appendChild(selectInter);
          }
          if(i == 1){
            celda.appendChild(labelInter2);
            celda.appendChild(selectInter2);
          }
          if(i == 2){
            var pSelecGraf = document.createElement("BUTTON");   // Create a <button> element
            pSelecGraf.innerHTML = '<i class = "esri-icon-cursor-filled"></i>Seleccionar Elemento'; 
            pSelecGraf.onclick = function() {
              pthis.IntersectGraphics(getNameCapa((<HTMLSelectElement>document.getElementById('CapasOperInter')).value),
              getNameCapa((<HTMLSelectElement>document.getElementById('CapasOperInter2')).value));
            }
            celda.appendChild(pSelecGraf);
          }
          hilera.appendChild(celda);
          tblBody.appendChild(hilera);
        }
        tabla.appendChild(tblBody);
        pdTabCont2.appendChild(tabla);
        pdTab.appendChild(pBufTab);
        pdTab.appendChild(pIntersecTab);
        this.content.append(pdTab);
        this.content.append(pdTabCont1);
        this.content.append(pdTabCont2);
        pBufTab.click();
        //this.content.append(label);
        //this.content.append(select);
      }
    this.pPanProcess = jsPanel.create({
        id: "pGeoProces",
        container: document.getElementsByTagName(this.pNameComponent),
        //setStatus: 'smallified',
        position: {
          my: "left-top",
          at: "left-top",
          offsetX: pRect.left + 320,
          offsetY: pRect.top + 10
        },
        resizeit: {minWidth: 350, maxWidth: 350, minHeight: 185, maxHeight: 185},
        headerTitle: 'Cruces Geograficos',
        theme: 'primary',
        panelSize: '350 185',
        dragit: {containment: pAreaDragPanel},
        headerControls: {
          minimize: 'remove',
          maximize: 'remove',
          close: 'remove'
        },
        borderRadius: '1rem',
        content: InitComponentGeoPro//'<div id="GeoProDiv"></div>'
      });
    this.pPanPrint = jsPanel.create({
        id: "pPrint",
        container: document.getElementsByTagName(this.pNameComponent),
        position: {
          my: "right-bottom",
          at: "right-bottom", 
          offsetX: pRect.left + pRect.width - 310,
          offsetY: pRect.top + 190 
      },
        headerTitle: 'Exportar Mapa',
        theme: 'primary',
        panelSize: '300 340',
        dragit: {containment: pAreaDragPanel},
        headerControls: {
          maximize: 'remove',
          minimize: 'remove',
          close: 'remove'
        },
        borderRadius: '1rem',
        content: '<div id="PrintTool"></div>'        
      });
    function InitComponentGeoRef() {
            /////////////  Tabla ///////////
            var tabla   = document.createElement("table");
            var tblBody = document.createElement("tbody");
            // Crea las celdas
            for (var i = 0; i < 3; i++) {
              // Crea las hileras de la tabla
              var hilera = document.createElement("tr"); // (<HTMLInputElement>document.getElementById('xDistBuff'))
              var celda = document.createElement("td");
              if(i == 0){
                celda.setAttribute("colspan", "2");
                var pDrawtool= document.createElement('div');
                pDrawtool.setAttribute('id', 'DrawTool');
                celda.appendChild(pDrawtool);
                hilera.appendChild(celda);
              }
              if(i == 1){
                var pSelCapaSave= document.createElement('div');
                celda.setAttribute("colspan", "2");
                pSelCapaSave.innerHTML ='<p>Guardar En:</p>'+
                '<p><input type="radio" id="Acti" name="drone" value="huey" checked>'+
                  '<label for="Acti">Actividades</label> '+
                '<input type="radio" id="Indicador" name="drone" value="dewey">'+
                  '<label for="Indicador">Meta del Indicador</label></p>';
                celda.appendChild(pSelCapaSave);
                hilera.appendChild(celda);
              }
              if(i == 2){   
                var pSaveGraf = document.createElement("BUTTON");   // Create a <button> element
                pSaveGraf.innerHTML = '<i class = "esri-icon-save" style="padding-right: 5px;"></i>Guardar en BD'; 
                pSaveGraf.onclick = function() {
                  pthis.SaveGraphics();
                }
                celda.appendChild(pSaveGraf);
                var celda2 = document.createElement("td");
                var pidentify = document.createElement("BUTTON");   // Create a <button> element
                pidentify.innerHTML = '<i class = "esri-icon-collection" style="padding-right: 5px;"></i>Seleccionar por Intersección'; 
                pidentify.onclick = function() {
                  pthis.IdentifyShow();
                }
                celda2.appendChild(pidentify);
                hilera.appendChild(celda);
                hilera.appendChild(celda2);
              }          
              tblBody.appendChild(hilera);
            }
            tabla.appendChild(tblBody);
      this.content.append(tabla);
    }
    this.pPanGeoref = jsPanel.create({
        id: "pGeoRef",
        container: document.getElementsByTagName(this.pNameComponent),
        //setStatus: 'smallified',
        position: {
          my: "right-bottom",
          at: "right-bottom", 
          offsetX: pRect.left + pRect.width - 360,
          offsetY: pRect.top + 105
      },
        //resizeit: {minWidth: 350, maxWidth: 350, minHeight: 185, maxHeight: 185},
        headerTitle: 'Georeferenciar Elementos',
        theme: 'primary',
        panelSize: '350 250',
        dragit: {containment: pAreaDragPanel},
        headerControls: {
          minimize: 'remove',
          maximize: 'remove',
          close: 'remove'
        },
        borderRadius: '1rem',
        content: InitComponentGeoRef//'<div id="GeoProDiv"></div>'
      });
    
    function InitComponentAddData() {
      var pdTab = document.createElement('div');
      pdTab.setAttribute('class', 'tab');
      //pdTab.style.cssText = 'padding: 5px;';
      var pServTab = document.createElement("BUTTON");   // Create a <button> element
      pServTab.innerHTML = "Servicios";
      pServTab.setAttribute('class', 'tablinksAddData');
      pServTab.onclick = function() { openTab(event, 'pIdServices', 'tabcontentAddData', 'tablinksAddData'); }  
      var pShapeTab = document.createElement("BUTTON");   // Create a <button> element
      pShapeTab.innerHTML = "Shapefile";  
      pShapeTab.setAttribute('class', 'tablinksAddData');
      pShapeTab.onclick = function() { openTab(event, 'pIdShape', 'tabcontentAddData', 'tablinksAddData'); }          
      var pCSVTab = document.createElement("BUTTON");   // Create a <button> element
      pCSVTab.innerHTML = "CSV";  
      pCSVTab.setAttribute('class', 'tablinksAddData');
      pCSVTab.onclick = function() { openTab(event, 'pIdCSV', 'tabcontentAddData', 'tablinksAddData'); } 

      ///////////////  Construye pestaña de Servicios  ////////////      
      var pdTabCont1 = document.createElement('div');
      pdTabCont1.id ="pIdServices"; 
      pdTabCont1.setAttribute('class', 'tabcontentAddData');

        var tabla   = document.createElement("table");
        var tblBody = document.createElement("tbody");
        // Crea las celdas
        for (var i = 0; i < 2; i++) {
          // Crea las hileras de la tabla
          var hilera = document.createElement("tr");
          
          if(i == 0){
            var celda1 = document.createElement("td");
            var pcel1= document.createElement('div');
            pcel1.innerHTML = '<p style="position: relative; font-family: Verdana, Arial, sans-serif;font-size: 10px; display: inline;">'+
                'Cargar Servicio Geográfico Ejemplo: </p>';
            var celda2 = document.createElement("td");
            var pcel2= document.createElement('div');
            pcel2.innerHTML = '<p style="position: relative; font-family: Verdana, Arial, sans-serif;font-size: 8.3px; overflow-wrap: anywhere;">'+
             'https://services6.arcgis.com/yq6pe3Lw2oWFjWtF/ArcGIS/rest/services/Areas_protegidas_declaradas_CAR/FeatureServer/0 </p>';
            celda1.appendChild(pcel1);
            celda2.appendChild(pcel2);
            hilera.appendChild(celda1);
            hilera.appendChild(celda2);
          }
          if(i == 1){
            var celda1 = document.createElement("td");
            var pload = document.createElement("BUTTON");   // Create a <button> element
            pload.innerHTML = '<i class = "esri-icon-upload" style="padding-right: 5px;"></i>Cargar Servicio'; 
            pload.onclick = function() {
              pthis.LoadService((<HTMLInputElement>document.getElementById('pUrlServ')).value);
            }
            celda1.appendChild(pload);

            var celda2 = document.createElement("td");
            var pcel2= document.createElement('div');
            var x = document.createElement("INPUT");
            x.setAttribute("type", "text");
            x.setAttribute("id", "pUrlServ");
            var labelUrl = document.createElement("label");
            labelUrl.innerHTML = "url/Rest:"
            labelUrl.htmlFor = "pUrlServ";
            celda2.appendChild(labelUrl);
            celda2.appendChild(x);
            hilera.appendChild(celda1);
            hilera.appendChild(celda2);
          }

          
          tblBody.appendChild(hilera);
        }
        tabla.appendChild(tblBody);
        pdTabCont1.appendChild(tabla);

  ///////////////  Construye pestaña de Shape  //////////////////////
        var pdTabCont2 = document.createElement('div');
        pdTabCont2.id ="pIdShape"; 
        pdTabCont2.setAttribute('class', 'tabcontentAddData');
     
        var tabla   = document.createElement("table");
        var tblBody = document.createElement("tbody");
        // Crea las celdas
        for (var i = 0; i < 1; i++) {
          // Crea las hileras de la tabla
          var hilera = document.createElement("tr");
          var celda1 = document.createElement("td");
            var pcel1= document.createElement('div');
            pcel1.innerHTML =  '<p>Subir Shapefile en un archivo ".Zip".</p> <p>'+
            'Mas informacion acerca del formato <a target="_blank"'+
            'href="https://doc.arcgis.com/en/arcgis-online/reference/shapefiles.htm">Shapefile</a></p>'+
            '<form enctype="multipart/form-data" method="post" id="uploadForm2">'+
              '<div class="field"> <label class="file-upload">'+
                  '<input type="file" id="myfile" accept=".zip"</label>'+ //(change)="handleFileInputShp($event.target.files)"> 
              '</div> </form> <div id="fileInfo"></div>';
            celda1.appendChild(pcel1);
          hilera.appendChild(celda1);
          tblBody.appendChild(hilera);
        }
        tabla.appendChild(tblBody);
        pdTabCont2.appendChild(tabla);
  ///////////////////////////////////////////////////////////////
        ///////////////  Construye pestaña de Shape  //////////////////////
        var pdTabCont3 = document.createElement('div');
        pdTabCont3.id ="pIdCSV"; 
        pdTabCont3.setAttribute('class', 'tabcontentAddData');

        var tabla   = document.createElement("table");
        var tblBody = document.createElement("tbody");
        // Crea las celdas
        for (var i = 0; i < 1; i++) {
          // Crea las hileras de la tabla
          var hilera = document.createElement("tr");
          var celda1 = document.createElement("td");
            var pcel1= document.createElement('div');
            pcel1.innerHTML =  '<div style="padding-left:4px;">'+
            '<p>Subir CSV ("id;latitud;Longitud", en grados decimales)</p>'+
            '<input type="file"  name="Upload CSV"  id="CSVFileUpload" ' +
            'class="custom-file-input" accept=".csv" /> <div id="fileInfo"></div></div>';
            celda1.appendChild(pcel1);
          hilera.appendChild(celda1);
          tblBody.appendChild(hilera);
        }
        tabla.appendChild(tblBody);
        pdTabCont3.appendChild(tabla);
  ///////////////////////////////////////////////////////////////
        pdTab.appendChild(pServTab);
        pdTab.appendChild(pShapeTab);
        pdTab.appendChild(pCSVTab);
        this.content.append(pdTab);
        this.content.append(pdTabCont1);
        this.content.append(pdTabCont2);
        this.content.append(pdTabCont3);
        pShapeTab.click();
    }


    this.pPanAddData = jsPanel.create({
        id: "pAddData",
        container: document.getElementsByTagName(this.pNameComponent),
        //setStatus: 'smallified',
        position: {
          my: "right-bottom",
          at: "right-bottom", 
          offsetX: pRect.left + pRect.width - 360,
          offsetY: pRect.top + 150
      },
        //resizeit: {minWidth: 350, maxWidth: 350, minHeight: 185, maxHeight: 185},
        headerTitle: 'Importar Datos',
        theme: 'primary',
        panelSize: '350 218',
        dragit: {containment: pAreaDragPanel},
        headerControls: {
          minimize: 'remove',
          maximize: 'remove',
          close: 'remove'
        },
        borderRadius: '1rem',
        content: InitComponentAddData
      });

      this.pPanAddData.style.visibility = "hidden";
      this.pPanGeoref.style.visibility = "hidden";
      this.pPanPrint.style.visibility = "hidden";
      this.pPanProcess.style.visibility = "hidden";
      this.pPanTable.style.visibility = "hidden";
      this.pPanStats.style.visibility = "hidden";
      
  }

  CapasOper: Capa[];
  SelCapaOper: Capa;
  SelCapaInter: Capa;
  SelCapa2Inter: Capa;
  CapasSave: Capa[];
  selectedCapa: Capa;
  distBuff: number= 5000; // Distancia inicial del buffer 5 km.
  distBuff2: number= 6000;
  selectedCapas: Capa[];
  constructor(private http: HttpClient) {
    //////// Se debe leer desde un JSON o de la base de datos  //////////  
    this.CapasSave= [
              {name: 'Avance Actividades', code: 1},
              {name: 'Avance Indicadores', code: 2},
          ];
      this.selectedCapas= [
            {name: 'Avance Actividades', code: 1},
            {name: 'Avance Indicadores', code: 2},
        ];
      this.CapasOper = [
         {name: "Cuencas 2do Orden", code: 0},
         {name: "Indicador Poligono", code: 1},
         {name: "Avance Actividad Poligono", code: 2},
         {name: "Avance Actividad Linea", code: 3},
         {name: "Indicador Linea", code: 4},
         {name: "Avance Actividad Punto", code: 5}];
         //{name: "Ediciones de Usuario", code: 6},
         //{name: "Capa Buffer Resultados", code: 7}
  }

  toggleGeorefPanel():void{
    const nodePanel = document.getElementById("pGeoRef");
    if (this._tooglePanelTOC) {
      this.pPanGeoref.smallify();
      nodePanel.style.visibility ="hidden";
      this._tooglePanelTOC = false;
    } else {
      this.pPanGeoref.front();
      this.pPanGeoref.unsmallify();
      nodePanel.style.visibility ="visible";

      this._tooglePanelTOC = true;
    }  
  }
  toggleLoadDataPanel():void{
    const nodePanel = document.getElementById("pAddData");
    if (this._toogleLoadData) {
      this.pPanAddData.smallify();
      nodePanel.style.visibility ="hidden";
      this._toogleLoadData = false;
    } else {
      this.pPanAddData.front();
      this.pPanAddData.unsmallify();
      nodePanel.style.visibility ="visible";
      this._toogleLoadData = true;
    }
  }
  togglePrintPanel():void{
    const nodePanel = document.getElementById("pPrint");
    if (this._tooglePanelPrint) {
      nodePanel.style.visibility ="hidden";      
      this._tooglePanelPrint = false;
    } else {
      this.pPanPrint.front();
      nodePanel.style.visibility ="visible";
      this._tooglePanelPrint = true;
    }
  }
  toggleProcesPanel():void{
    const nodePanel = document.getElementById("pGeoProces");
    if (this._tooglePanelProces) {     
      this.pPanProcess.smallify();
      nodePanel.style.visibility ="hidden";
      this._tooglePanelProces = false;
    } else {
      this.pPanProcess.front();
      this.pPanProcess.unsmallify();
      nodePanel.style.visibility ="visible";
      this._tooglePanelProces = true;
    }
  }


  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [esriConfig, EsriMap, EsriMapView, GroupLayer, request, FeatureLayer, FeatureTable, LayerList, EsriLegend,
        Sketch, GraphicsLayer, Print] = await loadModules([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/GroupLayer",
        "esri/request",
        "esri/layers/FeatureLayer",
        "esri/widgets/FeatureTable",
        "esri/widgets/LayerList",
        "esri/widgets/Legend",
        "esri/widgets/Sketch",
        "esri/layers/GraphicsLayer",
        "esri/widgets/Print",      
      ]);

      this.ConstPaneles();
      // Configure the Map
      const mapProperties: esri.MapProperties = {
        basemap: this._basemap
      };

      const map: esri.Map = new EsriMap(mapProperties);

      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map,
        ui: {
          padding: {
            bottom: 15,
            right: 15
          }
        }
      };
      ////////////////////////  CLASES PARA LAS ETIQUETAS    ////////////////////////////
      
      const labelClass = {
        // autocasts as new LabelClass()
        symbol: {
          type: "text", // autocasts as new TextSymbol()
          color: "blue",
          font: {
            // autocast as new Font()
            family: "Playfair Display",
            size: 12,
            weight: "bold"
          }
        },
        labelPlacement: "above-center",
        labelExpressionInfo: {
          expression: "$feature.Descrippcion"
        }
      };
      ////////////////////  conf de popups  //////////////
      let templateIndicador = {
          // autocasts as new PopupTemplate()
          title: "Indicador",
          content: [
            { type: "fields",
              fieldInfos: [
                {
                  fieldName: "Id_Car",
                  label: "Identificador de la CAR"
                },
                {
                  fieldName: "Id_Indicador",
                  label: "Identificador del Indicador",
                }
              ]}]};
      let templateActividad = {
                // autocasts as new PopupTemplate()
                title: "Indicador",
                content: [
                  { type: "fields",
                    fieldInfos: [
                      {
                        fieldName: "Id_Actividad",
                        label: "Identificador de la Act."
                      },
                      {
                        fieldName: "Contrato",
                        label: "Contrato",
                      },
                      {
                        fieldName: "Descripcion",
                        label: "Descripcion de la Act.",
                      }
                    ]}]};
      let templateCuenca = {
                      // autocasts as new PopupTemplate()
                      title: "Cuenca {Nombre}",
                      content: [
                        { type: "fields",
                          fieldInfos: [
                            {
                              fieldName: "Cod_cuenca_segundo",
                              label: "Cod. Cuenca"
                            },
                            {
                              fieldName: "Shape__Area",
                              label: "Area de la cuenca",
                            }
                          ]}]};
      // Typical usage
      const layer0 = new FeatureLayer({
        // URL to the service
        url: "https://services6.arcgis.com/yq6pe3Lw2oWFjWtF/ArcGIS/rest/services/CuencasCAR/FeatureServer/3",
        title: "Cuencas 2do Orden",
        popupTemplate: templateCuenca
      }); 
      const layer1 = new FeatureLayer({
        // URL to the service
        url: "https://services8.arcgis.com/KNerkhBqH4JPpw28/arcgis/rest/services/SIPGA_GIS/FeatureServer/4",
        popupTemplate: templateIndicador,
        title: "Indicador Poligono",
        labelingInfo: [labelClass],
        renderer: {
                  type: "simple", // autocasts as new SimpleRenderer()
                  symbol: {
                    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                    color: "rgba(0,100,0,0.6)",
                    size: 3,
                    outline: {
                      color: [0, 0, 0, 0.1],
                      width: 0.5
                    }
                  }
                }
      });
      layer1.labelsVisible = false;
      //////////////  capa provisional de guardado  //////////////    
      this._layer2 = new FeatureLayer({
        // URL to the service
        url: "https://services8.arcgis.com/KNerkhBqH4JPpw28/arcgis/rest/services/SIPGA_GIS/FeatureServer/5",
        title: "Avance Actividad Poligono",
        popupTemplate: templateActividad
      });
      const layer3 = new FeatureLayer({
        // URL to the service
        url: "https://services8.arcgis.com/KNerkhBqH4JPpw28/arcgis/rest/services/SIPGA_GIS/FeatureServer/3",
        title: "Avance Actividad Linea",
        popupTemplate: templateIndicador
      });
      const layer4 = new FeatureLayer({
        // URL to the service
        url: "https://services8.arcgis.com/KNerkhBqH4JPpw28/arcgis/rest/services/SIPGA_GIS/FeatureServer/2",
        title: "Indicador Linea",
        popupTemplate: templateActividad
      });
      
      const layer5 = new FeatureLayer({
        // URL to the service
        url: "https://services8.arcgis.com/KNerkhBqH4JPpw28/arcgis/rest/services/SIPGA_GIS/FeatureServer/1",
        title: "Avance Actividad Punto",
        popupTemplate: templateIndicador,
      });
      var ActividadesGroupLayer = new GroupLayer({
        title: "Avances Actividades",
        visible: true,
        visibilityMode: "independent",
        layers: [this._layer2, layer3, layer5]
      });
      map.layers.add(ActividadesGroupLayer);
      var IndicadoresGroupLayer = new GroupLayer({
        title: "Metas Indicadores",
        visible: true,
        //visibilityMode: "exclusive",
        layers: [layer1, layer4]
      });
      map.layers.add(IndicadoresGroupLayer);
      const CuencasGroupLayer = new GroupLayer({
        title: "Límite de Cuencas",
        visible: true,
        //visibilityMode: "exclusive",
        layers: [layer0]
      });
      map.layers.add(CuencasGroupLayer);
      ///////////////// Contenedor de graficos dibujados  //////////////////
      this._pGraphics = new GraphicsLayer({
        title: "Ediciones de Usuario",
        listMode: "hide"
      });
      this._GraphicsBuffer= new GraphicsLayer({
        title: "Capa Buffer Resultados",
        listMode: "hide"
      });
      this._GraphicsCSV= new GraphicsLayer({
        title: "Capa CSV",
        listMode: "hide"
      });
      this._GraphicsSHP= new GraphicsLayer({
        title: "Load Shapefile",
        listMode: "hide"
      });
      map.layers.add(this._pGraphics);
      map.layers.add(this._GraphicsBuffer);
      map.layers.add(this._GraphicsCSV);
      map.layers.add(this._GraphicsSHP);
      this._view = new EsriMapView(mapViewProperties);
      let pCapa: number = 0;
      const layerList = new LayerList({
        view: this._view,
        container: "mapLeyen",
        
        listItemCreatedFunction: function(event) {
          const item = event.item;
          //console.log("itemName::::",item.title);
          //console.log("item::::",item.actionsOpen);
          if(item.title == "Avances Actividades"){
            item.open = true;
            console.log("item::::",item.actionsOpen);
          }
          if (item.layer.type != "group" && item.layer.type !="graphics") {
            // don't show legend twice
            //if (item.title == "Area de Influencia PAI") {
              item.panel = {
                content: "legend",
                open: false,
              };
              //if (item.title === "Cuencas 2do Orden") {
                item.actionsSections = [[{
                  title: "Tabla de atributos",
                  className: "esri-icon-table",
                  id: "table",
                  capa: item.layer
                },{
                  title: "On/Off etiquetas",
                  className: "esri-icon-labels",
                  id: "labels",
                  capa: item.layer
                },{
                  title: "Estadisticas",
                  className: "esri-icon-chart",  
                  id: "Estadisticas",
                  capa: item.layer
                },{
                  title: "Descargar Informacion",
                  className: "esri-icon-download",
                  id: "ExtractData",
                  capa: item.layer
                },{
                  title: "Layer information",
                  className: "esri-icon-description",
                  id: "information",
                  capa: item.layer
                },]];
              //}
              //// AQUI PRENDER Y APAGAR LABELS  /////////////
              // change the title to something more descriptive
              //item.title = "Population by county";
              // set an action for zooming to the full extent of the layer
              
            //}

          }
        }
      });
      
      const nodePanelTable = document.getElementById("pTable");
      const nodePanelStats = document.getElementById("pStats");
      let pthis = this;

      layerList.on("trigger-action", function(event) {
        console.log("id click:",event.action.capa.layerId);
        if (event.action.id === "table") {
          console.log("id click:",event.action.capa.title);
          console.log( this.pPanelTable);
          if(nodePanelTable.style.visibility ==="hidden"){
            pthis.pPanTable.front();
            nodePanelTable.style.visibility = "visible";
            //this.pPanelTable.nativeElement.style.visibility = "visible";
            let table = new FeatureTable({
              layer: event.action.capa,
              container: "tableDiv"
            });
          }else{
            const nodeTable = document.getElementById("tableDiv");
            nodeTable.innerHTML = "";
            let table = new FeatureTable({
              layer: event.action.capa,
              container: "tableDiv"
            });
          }
          
        }
        if (event.action.id === "labels") {
          event.action.capa.labelsVisible = event.action.capa.labelsVisible ? false : true; 
          console.log(event.action.capa.labelsVisible);
          ///https://analysis8.arcgis.com/arcgis/rest/services/tasks/GPServer/ExtractData
          //Documentacion de como se ControlSourcesComponent
          //https://developers.arcgis.com/rest/analysis/api-reference/extract-data.htm
        }
        if (event.action.id === "Estadisticas") {
          if(nodePanelStats.style.visibility ==="hidden"){nodePanelStats.style.visibility = "visible";}
          else{
            const nodeStats = document.getElementById("tableDiv");
            nodeStats.innerHTML = "chartdiv";
          }
          if(event.action.capa.layerId == 4){CreateChartMultiserie();}
          else if(event.action.capa.layerId == 2){CreateChart("XY", event.action.capa);}
          else if(event.action.capa.layerId == 5){CreateChart("XY", event.action.capa);}
          else { CreateChatPie();}
        }
        if (event.action.id === "information") {
          window.open(event.action.capa.url);
          ///https://analysis8.arcgis.com/arcgis/rest/services/tasks/GPServer/ExtractData
          //Documentacion de como se ControlSourcesComponent
          //https://developers.arcgis.com/rest/analysis/api-reference/extract-data.htm
        }
        if (event.action.id === "ExtractData") {
          //alert("En desarrollo");
          //http://datosgeograficos.car.gov.co/datasets/ed418474401f49baa2931e35dd7a8919_3/data
          window.open("http://datosgeograficos.car.gov.co/datasets/ed418474401f49baa2931e35dd7a8919_3/data");
          ///https://analysis8.arcgis.com/arcgis/rest/services/tasks/GPServer/ExtractData
        }

        
      });
      this._pSketch = new Sketch({
        layer: this._pGraphics,
        view: this._view,
        container: "DrawTool",
        //layout: "vertical",
        // graphic will be selected as soon as it is created
        creationMode: "update"
      });

      const print = new Print({
        view: this._view,
        container: "PrintTool", 
        // specify your own print service
        printServiceUrl:
          "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
      });


      const portalUrl = "https://www.arcgis.com";
      let view = this._view;

      //// Coloca el evento de captura del file en el boton///
      document
        .getElementById("uploadForm2")
        .addEventListener("change", function(event) { //handleFileInput($event.target.files)
          //console.log(event.target.files);
          var x = (<HTMLInputElement>document.getElementById('myfile'));
          var pval = (<HTMLInputElement>document.getElementById('myfile')).value;
          var txt = "";
          if ('files' in x) {
            if (x.files.length == 0) {
              txt = "Select one or more files.";
            } else {
              pthis.handleFileInputShp(x.files);
              for (var i = 0; i < x.files.length; i++) {
                txt += "<br><strong>" + (i+1) + ". file</strong><br>";
                var file = x.files[i];
                if ('name' in file) {
                  txt += "name: " + file.name + "<br>";
                }
                if ('size' in file) {
                  txt += "size: " + file.size + " bytes <br>";
                }
              }
            }
          } 
          else {
            if (pval == "") {
              txt += "Select one or more files.";
            } 
          }
          console.log("fileLoad:::", txt);
        });  
      document
        .getElementById("CSVFileUpload")
        .addEventListener("change", function(event){
          var x = (<HTMLInputElement>document.getElementById('CSVFileUpload'));
          var pval = (<HTMLInputElement>document.getElementById('CSVFileUpload')).value;
          var txt = "";
          if ('files' in x) {
            if (x.files.length == 0) {
              txt = "Select one or more files.";
            } else {
              pthis.uploadListener(x.files);
              for (var i = 0; i < x.files.length; i++) {
                txt += "<br><strong>" + (i+1) + ". file</strong><br>";
                var file = x.files[i];
                if ('name' in file) {
                  txt += "name: " + file.name + "<br>";
                }
                if ('size' in file) {
                  txt += "size: " + file.size + " bytes <br>";
                }
              }
            }
          } 
          else {
            if (pval == "") {
              txt += "Select one or more files.";
            } 
          }
          console.log("fileLoadCSV:::", txt);
        });
      function CreateChart(ptipo:string, pdata:any){
        //alert(ptipo);
        let chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.paddingRight = 20;
        let data = [];
            let visits = 10;
            for (let i = 1; i < 366; i++) {
              visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
              data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
            }

          chart.data = data;

          let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
          dateAxis.renderer.grid.template.location = 0;

          let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          valueAxis.tooltip.disabled = true;
          valueAxis.renderer.minWidth = 35;

          let series = chart.series.push(new am4charts.LineSeries());
          series.dataFields.dateX = "date";
          series.dataFields.valueY = "value";

          series.tooltipText = "{valueY.value}";
          chart.cursor = new am4charts.XYCursor();

          let scrollbarX = new am4charts.XYChartScrollbar();
          scrollbarX.series.push(series);
          chart.scrollbarX = scrollbarX;
          chart.exporting.menu = new am4core.ExportMenu();
          chart.exporting.menu.align = "left";
          chart.exporting.menu.verticalAlign = "top";
          chart.exporting.filePrefix = "SIPGACAR_Export";
      }
      function CreateChatPie():void{
        var chart = am4core.create("chartdiv", am4charts.PieChart);
        // Add data
        chart.data = [{
          "category": "Actividad A",
          "value": 70
        }, {
          "category": "Actividad B",
          "value": 20
        }, {
          "category": "actividad C",
          "value": 50
        }];

        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "category";

        pieSeries.labels.template.maxWidth = 130;
        pieSeries.labels.template.wrap = true;
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "left";
        chart.exporting.menu.verticalAlign = "top";
      }
      function CreateChartMultiserie():void{
        let data = [
          { device: "dev1", date: new Date(2018, 0, 1), value: 450 },
          { device: "dev2", date: new Date(2018, 0, 1), value: 362 },
          { device: "dev3", date: new Date(2018, 0, 1), value: 699 },
          
          { device: "dev1", date: new Date(2018, 0, 2), value: 269 },
          { device: "dev2", date: new Date(2018, 0, 2), value: 450 },
          { device: "dev3", date: new Date(2018, 0, 2), value: 841 },
          
          { device: "dev1", date: new Date(2018, 0, 3), value: 700 },
          { device: "dev2", date: new Date(2018, 0, 3), value: 358 },
          { device: "dev3", date: new Date(2018, 0, 3), value: 698 }
        ];
        
        // Create chart instance
        let chart = am4core.create("chartdiv", am4charts.XYChart);
        
        // Add data
        chart.data = data;
        
        // Add data pre-processor
        chart.events.on("beforedatavalidated", function(ev) {
          var source = ev.target.data;
          var dates = {};
          var data = [];
          for(var i = 0; i < source.length; i++) {
            var row = source[i];
            if (dates[row.date] == undefined) {
              dates[row.date] = {
                date: row.date
              };
              data.push(dates[row.date]);
            }
            dates[row.date][source[i].device] = row.value;
          }
          chart.data = data;
        });
        
        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.minGridDistance = 30;
        
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        
        // Create series
        function createSeries(field, name) {
          var series = chart.series.push(new am4charts.LineSeries());
          series.dataFields.valueY = field;
          series.dataFields.dateX = "date";
          series.name = name;
          series.tooltipText = "{dateX}: [b]{valueY}[/]";
          series.strokeWidth = 2;
          
          var bullet = series.bullets.push(new am4charts.CircleBullet());
          bullet.circle.stroke = am4core.color("#fff");
          bullet.circle.strokeWidth = 2;
          
          return series;
        }
        
        createSeries("dev1", "Indicador A");
        createSeries("dev2", "Indicador C");
        createSeries("dev3", "Indicador D");
        
        chart.legend = new am4charts.Legend();
        chart.cursor = new am4charts.XYCursor();
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "left";
        chart.exporting.menu.verticalAlign = "top";
      }
      
      this._view.ui.move("zoom", "top-right");
      //this._view.ui.add(legend, "top-right");
      this._view.ui.add(["ZoneButon",  "PanelAddData"], "top-right");       
      //this._view.ui.add(["pPanelProcess"], "top-left");  //,"pStats"
      this._pSketch.on("update", this.onGraphicUpdate);
      console.log("layers::", map.layers.toArray()[6].title);

      //CapasOper


      ///////////////////////////////////////////////////////////////

      await this._view.when();
      return this._view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }
  private onGraphicUpdate(event) {        
    if (event.state === "start") {
      //alert("termino Dibujar");
      console.log(event.graphics[0].geometry.type);
      this._pGraphicsSave = event.graphics[0].geometry;
      console.log(this._pGraphicsSave.geometry);
    }

  }

  /**
   * name
   */
  IdentifyShow(){
    document.getElementById("viewDiv").style.cursor = "help";
    let pThis = this;
    this.popupOnOff(true);
    let handler = this._view.on("click", identify);
    function identify(event){
      document.getElementById("viewDiv").style.cursor = "progress";
      setTimeout(function(){
        document.getElementById("viewDiv").style.cursor = "auto";
      }, 1000);
      handler.remove();
    }
    this._view.popup.watch("visible",function(evt){
      if(!evt){
        console.log("apagando popups...");
        pThis.popupOnOff(false);
      }
      
    });
    /*this._view.popup.on("trigger-action", function(event){
      // If the zoom-out action is clicked, than execute the following code
      console.log("evento", event );

      if(event.action.id === "zoom-out"){
        // Zoom out two levels (LODs)2
        }
      });*/
  }
  async IntersectGraphics(capaIn:string, CapaInter:String){
  try{
    console.log("Entra a intersectar");
    document.getElementById("viewDiv").style.cursor = "help";
    const [Graphic, geometryEngine] = await loadModules(["esri/Graphic", "esri/geometry/geometryEngine"]);
    let pThis = this;
///////////  debe seleccionar la url de la capa /////////////////
    let pfInter;
    this._view.map.layers.find(function(layer){    
      if (layer.type == "group"){ 
        let pGroup = layer as esri.GroupLayer;
        pfInter =  pGroup.layers.find(function(pLay){return pLay.title == capaIn});
      }
      return pfInter;
    });
    let pf2Inter;
    this._view.map.layers.find(function(layer){    
      if (layer.type == "group"){ 
        let pGroup = layer as esri.GroupLayer;
        pf2Inter =  pGroup.layers.find(function(pLay){return pLay.title == CapaInter});
      }
      return pf2Inter;
    });
    
    
    pThis.popupOnOff(false);
    ///////////////////// Evento para la captura del evento click ///////////////////
    let handler = this._view.on("click", executeIntersection);
    function executeIntersection(event) {
      document.getElementById("viewDiv").style.cursor = "progress";
      let query = pfInter.createQuery();
      query.geometry = event.mapPoint;
      pfInter.queryFeatures(query).then(function(response) {
                console.log("graficos", response.features.length);
          if (response.features.length > 0){
                let pgeo = response.features[0].geometry;
                //let buffer = geometryEngine.geodesicBuffer(pgeo, 200, "miles");
                let simpleFillSymbol = {
                  type: "simple-fill",
                  color: [95, 135, 221, 0.8],  // orange, opacity 80%
                  outline: {
                    color: [255, 255, 255],
                    width: 2
                  }
                };

                let query = pf2Inter.createQuery();
                query.geometry = pgeo;
                pf2Inter.queryFeatures(query).then(function(res) {
                    console.log("graficosintersec", res.features.length);
                    for (let i = 0; i < res.features.length; i++) {
                      let pgeo2 = res.features[i].geometry;
                      let InterGeom = geometryEngine.intersect(pgeo, pgeo2);
                      let polygonGraphicInter = new Graphic({
                        geometry: InterGeom,
                        symbol: simpleFillSymbol
                      });
                      pThis._view.graphics.add(polygonGraphicInter);
                      document.getElementById("viewDiv").style.cursor = "auto";
                      pThis.popupOnOff(true);
                    }
                });  
              } else{alert("Por favor seleccione un elementdo de la capa " + capaIn);}                    
      });

      handler.remove();

    }
    } catch (error) {
      console.log("EsriLoader: ", error);
      document.getElementById("viewDiv").style.cursor = "auto";
    }
  }
  SaveGraphics():void{
    try {

////////////  Preguntar geometria para guardar actividad   ////////////////////
      const addFeature =  this._pGraphics.graphics.getItemAt(0)
      /////// Preguntar geometria para guardar /////////////

      console.log(this._pGraphics.graphics);  ///.getItemAt(0).geometry.type
      this._layer2.applyEdits({addFeatures: [addFeature]});
      //alert("Accediendo a geometrias");
    } catch (error) {
      console.log("EsriLoader: ", error);
    }  
  }
  async LoadService(pUrl:string){
    try {
          //alert(this.pTextService.nativeElement.value);
          const [FeatureLayer] = await loadModules(["esri/layers/FeatureLayer"]);
          //let pUrl = this.pTextService.nativeElement.value;
          
          let pFeaLoad = new FeatureLayer({
            // URL to the service
            url: pUrl.replace(" ", '')
          });
          this._view.map.add(pFeaLoad);

      ////////////  Preguntar geometria para guardar actividad   ////////////////////
          } catch (error) {
            console.log("EsriLoader: ", error);
          }  
  }
  async handleFileInputShp(files: FileList) {  
    console.log("Entra al evento....")
    const [Polygon, FeatureSet, Graphic] = await loadModules(["esri/geometry/Polygon", "esri/tasks/support/FeatureSet", "esri/Graphic"]);
    let pThis = this;
    await this.readFileContent(files.item(0))
      .toPromise().then(
        res => {
          shp(res).then(function (geojson) {
            let pfeaSet = FeatureSet.fromJSON(geojson);
            let fullExtent;
            console.log("GeoJson", geojson);
            console.log("featureSet", pfeaSet);
            for (let i = 0; i < geojson["features"].length; i++) {
              if( geojson["features"][i]["geometry"]["type"] == "Polygon"){
                const polygon = new Polygon({
                  hasZ: false,
                  hasM: false,
                  rings: geojson["features"][i]["geometry"]["coordinates"],
                  spatialReference: { wkid: 4326 }
                });
                const graphicShp = new Graphic({
                  geometry: polygon,
                  symbol: { type: "simple-fill" }
                });
                              
                pThis._GraphicsSHP.graphics.push(graphicShp); 
                //fullExtent = fullExtent ? fullExtent.union(polygon) : polygon;
                //view.graphics.add(graphicShp);
              }
            }
            pThis._GraphicsSHP.listMode = "show";
            
            //pThis._view.goTo(fullExtent); 
            

            

            
            /*const blob = new Blob([JSON.stringify(geojson)], {type: "application/json"});
            const purl  = URL.createObjectURL(blob);
            console.log("urlCreada", purl);
            let layerShp = new GeoJSONLayer({ url: purl });
            console.log("json", layerShp);
            this._view.map.layers.add(layerShp);
            console.log("Agrego");*/
          })
        }
      );
    
    this.fileToUpload = files.item(0);
    console.log("nom::", this.fileToUpload.name);
    let view = this._view;
    /*
    //////////////////////////  Apaga popups de todos los layers  ///////////////
    view.map.allLayers.forEach(function(item, i){
      if(item.type == "feature"){
        console.log("id:",i,"obj",item.type);
        let pL = view.map.layers.find(function(layer){return layer.title == item.title;}) as esri.FeatureLayer;
        pL.popupEnabled = true;
        console.log("myLa", item.title, "pp", pL.popupEnabled);
      }
    });
    /////////////////////////////////////////////////////////////////////////////*/


    //this.addUnit(this.fileToUpload);
    /*this.http.post<any>('https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer', { title: 'Angular POST Request Example' }).
        subscribe(data => {
            //this.postId = data.layers;
            //console.log('response', this.postId);
        })
    
    this._requestMap() (portalUrl + "/sharing/rest/content/features/generate", {
      query: myContent,
      body: document.getElementById("uploadForm"),
      responseType: "json"
    })
      .then(function(response) {
        var layerName =
          response.data.featureCollection.layers[0].layerDefinition.name;
        document.getElementById("upload-status").innerHTML =
          "<b>Loaded: </b>" + layerName;
        addShapefileToMap(response.data.featureCollection);
      })
      .catch(errorHandler);*/
  }
  readFileContent(file: File) {
    let fileReader: FileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    return Observable.create(observer => {
      fileReader.onloadend = () => {
        observer.next(fileReader.result);
        observer.complete();
      };
    });
  }


  async addUnit(event: any){
    console.log("jjj", event.shapefile);
    console.log(event.name);
    const portalUrl = "https://www.arcgis.com";
    const [esriConfig, esriRequest] = await loadModules(["esri/config", "esri/request"]);
    
    let params: any = {
      name: name,
      targetSR: this._view.spatialReference,
      maxRecordCount: 1000,
      enforceInputFileSizeLimit: true,
      enforceOutputJsonSizeLimit: true
    };

    // generalize features to 10 meters for better performance
    params.generalize = true;
    params.maxAllowableOffset = 10;
    params.reducePrecision = true;
    params.numberOfDigitsAfterDecimal = 0;

    let myContent: any = {
      filetype: "shapefile",
      publishParameters: JSON.stringify(params),
      //text: event,
      f: "json"
    };
    /*
    let url = "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer";    
    let options : any ={
      query: {
        f: 'json'
      },
      responseType: 'json'
    };
    esriRequest(url, options).then(function(response) {
      console.log('response', response);
      const responseJSON = JSON.stringify(response, null, 2);
      console.log("Resp::", responseJSON);
    });
*/


    
    esriRequest(portalUrl + "/sharing/rest/content/features/generate", {
      query: myContent,
      form: this.pAddDataForm.nativeElement, //event, //document.getElementById("uploadForm"), //
      responseType: "json"
    })
      .then( response => {
        //var layerName = response.data.featureCollection.layers[0].layerDefinition.name;
        console.log("layerName");
        //document.getElementById("upload-status").innerHTML =
        //  "<b>Loaded: </b>" + layerName;
        //addShapefileToMap(response.data.featureCollection);
      }).catch((err) => {
        console.error('error encontrado',err)
      });
  }

  async ApplayBuffer(CapaIn:String){
    try{
    //const pCapaIn =  this._pGraphics.graphics.getItemAt(0)
    this.popupOnOff(false);
    document.getElementById("viewDiv").style.cursor = "help";
    const [FeatureLayer, Graphic, geometryEngine, esriRequest, Polygon, GraphicsLayer] = await loadModules(["esri/layers/FeatureLayer",
    "esri/Graphic", "esri/geometry/geometryEngine", "esri/request", "esri/geometry/Polygon", "esri/layers/GraphicsLayer"]);
    let flBuf;
    ///////////  debe seleccionar la url de la capa /////////////////
    this._view.map.layers.find(function(layer){    
      if (layer.type == "group"){ 
        let pGroup = layer as esri.GroupLayer;
        flBuf =  pGroup.layers.find(function(pLay){return pLay.title == CapaIn});
      }
      return flBuf;
    });

    ///////////////////////
    let pThis = this;
    let view = this._view;
    let pdistBuffer = (<HTMLInputElement>document.getElementById('xDistBuff')).value;//this.distBuff;
    ///////////////////// Evento para la captura del evento click ///////////////////
    let handler = this._view.on("click", executeIdentifyTask);
    function executeIdentifyTask(event) {
      document.getElementById("viewDiv").style.cursor = "progress";
      let query = flBuf.createQuery();
      query.geometry = event.mapPoint;
      //query.where = "Cod_cuenca_segundo  = '2120'";
      //query.outFields = [ "Nombre" ];
      flBuf.queryFeatures(query).then(function(response) {
        if(response.features.length>0){
                let pgeo = response.features[0].geometry;
                var simpleFillSymbol = {
                  type: "simple-fill",
                  color: [227, 139, 79, 0.7],  // orange, opacity 80%
                  outline: {
                    color: [255, 255, 255],
                    width: 1
                  }
                };
                let bufferGeom = geometryEngine.geodesicBuffer(pgeo, pdistBuffer, "meters");
                var polygonGraphicBuff = new Graphic({
                  geometry: bufferGeom,
                  symbol: simpleFillSymbol
                });
                view.graphics.add(polygonGraphicBuff);
                document.getElementById("viewDiv").style.cursor = "auto";
                pThis.popupOnOff(true); 
          } else{alert("Por favor seleccione un elementdo de la capa " + CapaIn);}       
      });

      handler.remove();

    }
  } catch (error) {
    console.log("EsriLoader: ", error);
    document.getElementById("viewDiv").style.cursor = "auto";
  }
  }

  async AddRemovePomcas(){
    const [FeatureLayer, GroupLayer] = await loadModules(["esri/layers/FeatureLayer", "esri/layers/GroupLayer"]);
    let Urllay0 = "https://services6.arcgis.com/yq6pe3Lw2oWFjWtF/ArcGIS/rest/services/Zonificacion_POMCA_Bogota_2120_2019/FeatureServer/0";
    let Urllay1 = "https://services6.arcgis.com/yq6pe3Lw2oWFjWtF/ArcGIS/rest/services/Zonificaci%c3%b3n_Ambiental_POMCA_R%c3%ado_Magdalena/FeatureServer/0";
    let Urllay2 = "https://services6.arcgis.com/yq6pe3Lw2oWFjWtF/ArcGIS/rest/services/Zonificaci%c3%b3n_Ambiental_POMCA_R%c3%ado_Blanco_Negro_Guayuriba/FeatureServer/0";
    if (!this._LoadPomcas) { // Si no estan cargadas...
      console.log("cargar capas pomcas");
      let flay0 = new FeatureLayer({
        // URL to the service
        url: Urllay0,
        popupTemplate: {
          // autocasts as new PopupTemplate()
          title: "POMCA Bogota 2019-2020",
          content: [
            { type: "fields",
              fieldInfos: [
                {
                  fieldName: "CODIGO",
                  label: "Codigo"
                },{
                  fieldName: "NOMENCLAT",
                  label: "Nomenclatura"
                },{
                  fieldName: "DESCRIP",
                  label: "Descripción",
                }
              ]}]},

      });
      let flay1 = new FeatureLayer({
        // URL to the service
        url: Urllay1
      });
      let flay2 = new FeatureLayer({
        // URL to the service
        url: Urllay2
      });

      var Pomcas = new GroupLayer({
        title: "Pomcas Disponibles",
        visible: true,
        //visibilityMode: "exclusive",
        layers: [flay0, flay1, flay2]
      });
      this._view.map.layers.add(Pomcas);
      this._LoadPomcas = true;
    } else {
      console.log("Remover capas pomcas");
      this._toogleLoadData = false;
    }
  }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(mapView => {
      // The map has been initialized
      console.log("mapView ready: ", this._view.ready);
      this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true);
      this.popupOnOff(false);
      /////////  Inicializar lista de capas Operacionales Buffer Intersecciones etc ///////////
      /*let i:number = 0;
      for (let p of  this._view.map.layers.toArray()){
              console.log((p.id.substring(-1)));
              this.CapasOper.push({name: p.title, code: i});
              i += 1;
            }
      console.log("jjj::::", this.CapasOper);*/
      let pthis = this;
      setTimeout(function () {
        let curtain = pthis.pLoader.nativeElement;
        curtain.parentElement.removeChild(curtain);
        console.log("removiendo cortina");
      }, 2000);
      //this.plistBuffer.nativeElement.options = "CapasOper";
    });
    
  }

  ngOnDestroy() {
    if (this._view) {
      // destroy the map view
      this._view.container = null;

    }
  }

  uploadListener(files: FileList): void {  
  
    let text = [];  
    //let files = $event.srcElement.files;  
  
    if (this.isValidCSVFile(files[0])) {  
  
      //let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result; 
        
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray);  
        console.log("titulos",headersRow);
        this.GraficarCSV(csvRecordsArray, headersRow);  
      };  
  
      reader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };  
  
    } else {  
      alert("Please import valid .csv file.");  
      this.fileReset();  
    }  
  }  
  
  async GraficarCSV(csvRecordsArray: any, header: any) {  
    //let csvArr = [];
    const [ Graphic, Point] = await loadModules(["esri/Graphic", "esri/geometry/Point"]);
    
    let idLat, idLon;
    for (let i = 0; i < header.length; i++) { 
      if(header[i].toUpperCase( ) == "LATITUD"){idLat = i;} 
      if(header[i].toUpperCase( ) == "LONGITUD"){idLon = i;} 
    }
    for (let i = 1; i < csvRecordsArray.length; i++) {  
        let curruntRecord = (<string>csvRecordsArray[i]).split(';');  

        let point = {
          type: "point",  // autocasts as new Point()
          longitude: parseFloat(curruntRecord[idLon]),
          latitude: parseFloat(curruntRecord[idLat]),

        };
        
        // Create a symbol for drawing the point
        let markerSymbol = {
          type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
          color: [226, 119, 40]
        };
        
        // Create a graphic and add the geometry and symbol to it
        let pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
          attributes: {"id": curruntRecord[0]},
          popupTemplate : {title: "Punto Cargado", content: [{type: "fields",
          fieldInfos: [{
            fieldName: "id",
            label: "Identificador"
         }]}]}
        });
        console.log(pointGraphic);
        this._GraphicsCSV.graphics.push(pointGraphic);
    }
    this._GraphicsCSV.listMode = "show";  
    
  }  
  
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }  
  
  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(';');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  }  
  
  fileReset() {  
    (<HTMLInputElement>document.getElementById('CSVFileUpload')).value = "";  
    this.records = [];  
  }

  popupOnOff(pval:boolean){
    let p = pval;
    let view = this._view;
    view.map.allLayers.forEach(function(item, i){
      if(item.type == "feature"){
        console.log("id-+:",i,"obj",item.type);
        console.log("id--:",i,"obj",item.title);
        let pL;
        view.map.layers.find(function(layer){    
          if (layer.type == "group"){ 
            let pGroup = layer as esri.GroupLayer;
            pL =  pGroup.layers.find(function(pLay){return pLay.title == item.title});
          }
          return pL;
        });
        pL.popupEnabled = p;
      }
    });
  }

}

