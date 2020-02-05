import { Component, NgZone, OnInit } from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  map: any;
  GoogleAutocomplete: any;
  autocomplete: any;
  autocompleteItems = [];
  geocoder: any;
  markers = [];

  service: any;
  position: any = { ok: false };

  puerta = '';
  constructor(
    private zone: NgZone
  ) {
    this.service = new google.maps.DistanceMatrixService();
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.geocoder = new google.maps.Geocoder;
    this.markers = [];
  }

  ngOnInit() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.9011, lng: -56.1645 },
      zoom: 15,
      disableDefaultUI: true,
      // zoomControl: true
    });
  }

  updateSearchResults() {

    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }

    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }


  selectSearchResult(item) {
    this.clearMarkers();
    this.autocompleteItems = [];
    this.autocomplete.input = item.description;

    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.position = {
          ok: true,
          address: item.description,
          coors: {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          }
        };
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
        });
        this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);
      } else {
        this.position = {
          ok: false
        };
      }
    })
  }

  clearMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

}
