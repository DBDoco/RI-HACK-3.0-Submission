import {AfterViewInit, Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-input',
  template: '<div id="map" style="height: 300px;"></div>',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MapInputComponent),
      multi: true
    }
  ]
})
export class MapInputComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  private map: L.Map;
  private marker: L.Marker;
  private value: [number, number] | null = null;
  private onChange: (value: [number, number] | null) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    L.Marker.prototype.options.icon = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([45.815, 15.9819], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.setMarker(e.latlng);
    });

    // If there's an initial value, set the marker
    if (this.value) {
      this.setMarker(L.latLng(this.value[0], this.value[1]));
    }
  }

  private setMarker(latlng: L.LatLng): void {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker(latlng).addTo(this.map);
    this.value = [latlng.lat, latlng.lng];
    this.onChange(this.value);
    this.onTouched();
  }

  // ControlValueAccessor methods
  writeValue(value: [number, number] | null): void {
    this.value = value;
    if (this.map && value) {
      this.setMarker(L.latLng(value[0], value[1]));
    }
  }

  registerOnChange(fn: (value: [number, number] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

}
