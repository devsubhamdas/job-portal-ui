import { Injectable, signal } from '@angular/core';
import { SearchJobsQuery } from '../../../generated/operations';
type Job = SearchJobsQuery['searchJobs']['data'][number];

@Injectable({
  providedIn: 'root',
})
export class JobSearchStateService {
  searchTerm = signal<string>('');
  searchResults = signal<Job[]>([]);
  hasMore = signal<boolean>(true);
  cursor = signal<string | null>(null);

  setValue(payload: {
    searchTerm?: string;
    searchResults: Job[];
    hasMore: boolean;
    cursor: string | null;
  }) {
    this.searchResults.set(payload.searchResults);
    this.hasMore.set(payload.hasMore);
    this.cursor.set(payload.cursor);
  }

  getValue() {
    return {
      searchTerm: this.searchTerm(),
      searchResults: this.searchResults(),
      hasMore: this.hasMore(),
      cursor: this.cursor(),
    };
  }
}
