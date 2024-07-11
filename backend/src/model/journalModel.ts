/**
 * Interface to specify the data that can be used during Journal entries data CRUD operations
 */
export interface JournalData {
  content: string;
  day: {
    connect: {
      id: number;
    };
  };
}
