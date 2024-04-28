import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class ManageProductsService extends ApiService {
  uploadProductsCSV(file: File): Observable<unknown> {
    if (!this.endpointEnabled('import')) {
      console.warn(
        'Endpoint "import" is disabled. To enable change your environment.ts config',
      );
      return EMPTY;
    }

    return this.getPreSignedUrl(file.name).pipe(
      map((url: { url: string }) => {
        console.log('url', url);
        return url.url;
      }),
      switchMap((url) =>
        this.http.put(url, file, {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Access-Control-Allow-Origin': '*',
          },
        }),
      ),
    );
  }

  private getPreSignedUrl(fileName: string): Observable<{ url: string }> {
    const url = this.getUrl('import', 'import');

    return this.http.get<{ url: string }>(url, {
      params: {
        name: fileName,
      },
    });
  }
}
