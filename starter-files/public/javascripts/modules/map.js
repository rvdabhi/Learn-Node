import axios from 'axios';
import {$} from './bling';

const mapOptions = {
	center: { lat: 18.51, lng: 73.93},
	zoom: 15
}
function loadPlaces(map, lat=18.51, lng= 73.93) {
	axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
		.then(res => {
			const places = res.data;

			if(!places.length) {
				alert('no places found');
				return;
			}
			// create a bounds
			const bounds = new google.maps.LatLngBounds();
			const infoWindow = new google.maps.InfoWindow();

			const markers = places.map(place => {
				const [placeLng, placeLat] = place.location.coordinates;
				const position = {lat: placeLat, lng: placeLng };
				bounds.extend(position);
				const marker = new google.maps.Marker({ map, position });
				marker.place = place;
				return marker;
			});

			// when someone click on marker show details
			markers.forEach(marker => marker.addListener('click', function(){
				const html = `
					<div class="popup">
						<a href="/store/${this.place.slug}">
							<img src="/uploads/${this.place.photo || 'store.png'}" alt="${this.place.name}" />
							<p>${this.place.name} - ${this.place.location.address}</p>
						</a>
					</div>
				`
				infoWindow.setContent(html);
				infoWindow.open(map, this);
			}));

			// then zoom the map to fit all the markers perfectly
			map.setCenter(bounds.getCenter());
		});
}

function makeMap(mapDiv) {
	if(!mapDiv) return;
	// make our map
	const map = new google.maps.Map(mapDiv, mapOptions);
	loadPlaces(map);

	const input = $('[name="geolocate"');
	const autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.addListener('place_changed', () => {
		const place = autocomplete.getPlace();
		loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());
	})
};

export default makeMap;