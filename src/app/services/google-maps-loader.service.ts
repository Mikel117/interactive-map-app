import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private loadingPromise: Promise<void> | null = null;

  load(apiKey: string = environments.GOOGLE_MAPS_API_KEY, libraries: string[] = ['marker']): Promise<void> {
    if ((window as any).google?.maps) return Promise.resolve();
    if (this.loadingPromise) return this.loadingPromise;

    const params = new URLSearchParams({ key: apiKey, libraries: libraries.join(',') });
    const scriptUrl = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;

    this.loadingPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(script);
    });

    return this.loadingPromise;
  }
}
