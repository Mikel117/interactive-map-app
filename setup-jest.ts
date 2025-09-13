import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
setupZoneTestEnv();

// Minimal Google Maps JS API mocks for unit tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).google = {
	maps: {
		Map: jest.fn().mockImplementation(() => ({
			addListener: jest.fn(),
			fitBounds: jest.fn(),
		})),
		marker: {
			AdvancedMarkerElement: jest.fn().mockImplementation(() => ({
				setMap: jest.fn(),
				addListener: jest.fn(),
				zIndex: 0,
			})),
		},
		InfoWindow: jest.fn().mockImplementation(() => ({
			setContent: jest.fn(),
			open: jest.fn(),
			close: jest.fn(),
		})),
		LatLng: jest.fn().mockImplementation((lat: number, lng: number) => ({ lat, lng })),
		LatLngBounds: jest.fn().mockImplementation(() => ({
			extend: jest.fn(),
		})),
		DirectionsService: jest.fn().mockImplementation(() => ({
			route: jest.fn().mockResolvedValue({ routes: [{ legs: [], bounds: {} }] }),
		})),
		DirectionsRenderer: jest.fn().mockImplementation(() => ({
			setDirections: jest.fn(),
				set: jest.fn(),
		})),
		CollisionBehavior: { REQUIRED: 'REQUIRED' },
		TravelMode: { DRIVING: 'DRIVING' },
		places: {
			PlacesService: jest.fn().mockImplementation(() => ({
				nearbySearch: jest.fn((_, cb) => cb([], { OK: 'OK' })),
			})),
			PlacesServiceStatus: { OK: 'OK' },
		},
	},
};
